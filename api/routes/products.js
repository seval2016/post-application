const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isManager, isInventoryManager, hasRole } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// Tüm ürünleri getir
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Ürünler getirilirken hata:', error);
    res.status(500).json({ message: 'Ürünler getirilirken bir hata oluştu' });
  }
});

// Tek bir ürün getir (herkes erişebilir)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Ürün getirilirken bir hata oluştu', error: error.message });
    }
});

// Yeni ürün ekle
router.post('/', async (req, res) => {
  try {
    const { title, price, image, category, description } = req.body;

    // Gerekli alanları kontrol et
    if (!title || !price || !image || !category) {
      return res.status(400).json({
        message: 'Eksik alanlar var',
        details: {
          title: !title ? 'Ürün adı zorunludur' : null,
          price: !price ? 'Ürün fiyatı zorunludur' : null,
          image: !image ? 'Ürün görseli zorunludur' : null,
          category: !category ? 'Kategori zorunludur' : null
        }
      });
    }

    // Yeni ürün oluştur
    const product = new Product({
      title: title.trim(),
      price: Number(price),
      image: image.trim(),
      category: category.trim(),
      description: description ? description.trim() : ''
    });

    // Ürünü kaydet
    const savedProduct = await product.save();
    console.log('Yeni ürün eklendi:', savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Ürün eklenirken hata:', error);
    res.status(500).json({ message: 'Ürün eklenirken bir hata oluştu' });
  }
});

// Ürün güncelle
router.put('/:id', async (req, res) => {
  try {
    const { title, price, image, category, description } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    // Güncelleme yap
    product.title = title || product.title;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.description = description || product.description;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error);
    res.status(500).json({ message: 'Ürün güncellenirken bir hata oluştu' });
  }
});

// Ürün sil (yetkilendirme gerekli)
router.delete('/:id', verifyToken, hasRole(['admin', 'manager']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    console.error('Ürün silinirken hata:', error);
    res.status(500).json({ message: 'Ürün silinirken bir hata oluştu' });
  }
});

// Stok güncelle (sadece admin, manager ve inventory)
router.patch('/:id/stock', verifyToken, hasRole(['admin', 'manager', 'inventory']), async (req, res) => {
    try {
        const { stock } = req.body;
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }

        product.stock = stock;
        await product.save();
        
        res.json({ 
            message: 'Stok başarıyla güncellendi',
            product: {
                id: product._id,
                name: product.name,
                stock: product.stock
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Stok güncellenirken bir hata oluştu', error: error.message });
    }
});

module.exports = router; 