const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isManager, isInventoryManager, hasRole } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// Tüm ürünleri getir (herkes erişebilir)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
            .sort({ name: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Ürünler getirilirken bir hata oluştu', error: error.message });
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

// Yeni ürün oluştur (sadece admin, manager ve inventory)
router.post('/', verifyToken, hasRole(['admin', 'manager', 'inventory']), async (req, res) => {
    try {
        const { name, description, price, category, stock, sku, barcode } = req.body;
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            sku,
            barcode
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Ürün oluşturulurken bir hata oluştu', error: error.message });
    }
});

// Ürün güncelle (sadece admin, manager ve inventory)
router.patch('/:id', verifyToken, hasRole(['admin', 'manager', 'inventory']), async (req, res) => {
    try {
        const { name, description, price, category, stock, sku, barcode } = req.body;
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (stock !== undefined) product.stock = stock;
        if (sku) product.sku = sku;
        if (barcode) product.barcode = barcode;

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: 'Ürün güncellenirken bir hata oluştu', error: error.message });
    }
});

// Ürün sil (sadece admin)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }

        await product.deleteOne();
        res.json({ message: 'Ürün başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Ürün silinirken bir hata oluştu', error: error.message });
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