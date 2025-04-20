const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');

// Tüm ürünleri getir
router.get('/', async (req, res) => {
    try {
        const { category, search, sort, page = 1, limit = 10 } = req.query;
        
        // Filtreleme koşulları
        const filter = { isActive: true };
        if (category) {
            filter.category = category;
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Sıralama seçenekleri
        let sortOption = {};
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    sortOption = { price: 1 };
                    break;
                case 'price_desc':
                    sortOption = { price: -1 };
                    break;
                case 'name_asc':
                    sortOption = { title: 1 };
                    break;
                case 'name_desc':
                    sortOption = { title: -1 };
                    break;
                case 'newest':
                    sortOption = { createdAt: -1 };
                    break;
                default:
                    sortOption = { createdAt: -1 };
            }
        }
        
        // Sayfalama
        const skip = (page - 1) * limit;
        
        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('category', 'name');
            
        const total = await Product.countDocuments(filter);
        
        res.json({
            success: true,
            message: 'Ürünler başarıyla getirildi',
            data: {
                products,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ürünler getirilirken bir hata oluştu',
            error: error.message
        });
    }
});

// Tek bir ürün getir
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name');
            
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }
        
        res.json({
            success: true,
            message: 'Ürün başarıyla getirildi',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ürün getirilirken bir hata oluştu',
            error: error.message
        });
    }
});

// Yeni ürün oluştur (admin için)
router.post('/', isAdmin, async (req, res) => {
    try {
        const product = new Product({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.body.image,
            stock: req.body.stock || 0
        });

        const newProduct = await product.save();
        
        res.status(201).json({
            success: true,
            message: 'Ürün başarıyla oluşturuldu',
            data: newProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Ürün oluşturulurken bir hata oluştu',
            error: error.message
        });
    }
});

// Ürün güncelle (admin için)
router.patch('/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        const updateFields = [
            'title', 'description', 'price', 'category', 
            'image', 'stock', 'isActive'
        ];

        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        const updatedProduct = await product.save();
        
        res.json({
            success: true,
            message: 'Ürün başarıyla güncellendi',
            data: updatedProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Ürün güncellenirken bir hata oluştu',
            error: error.message
        });
    }
});

// Ürün sil (admin için)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        // Ürünü tamamen silmek yerine isActive'i false yap
        product.isActive = false;
        await product.save();
        
        res.json({
            success: true,
            message: 'Ürün başarıyla silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ürün silinirken bir hata oluştu',
            error: error.message
        });
    }
});

// Stok güncelleme
router.patch('/:id/stock', async (req, res) => {
    try {
        const { quantity, operation = 'set' } = req.body;
        
        if (!quantity || isNaN(quantity)) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir miktar belirtilmelidir'
            });
        }
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }
        
        // Stok işlemi
        switch (operation) {
            case 'add':
                product.stock += parseInt(quantity);
                break;
            case 'subtract':
                if (product.stock < quantity) {
                    return res.status(400).json({
                        success: false,
                        message: 'Yetersiz stok'
                    });
                }
                product.stock -= parseInt(quantity);
                break;
            case 'set':
                product.stock = parseInt(quantity);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz işlem'
                });
        }
        
        const updatedProduct = await product.save();
        res.json({
            success: true,
            message: 'Stok başarıyla güncellendi',
            data: updatedProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Stok güncellenirken bir hata oluştu',
            error: error.message
        });
    }
});

module.exports = router; 