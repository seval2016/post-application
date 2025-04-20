const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth, isAdmin } = require('../middleware/auth');

// Tüm kategorileri getir
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        res.json({
            success: true,
            message: 'Kategoriler başarıyla getirildi',
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategoriler getirilirken bir hata oluştu',
            error: error.message
        });
    }
});

// Tek bir kategori getir
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Kategori bulunamadı'
            });
        }
        res.json({
            success: true,
            message: 'Kategori başarıyla getirildi',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategori getirilirken bir hata oluştu',
            error: error.message
        });
    }
});

// Yeni kategori oluştur (admin için)
router.post('/', isAdmin, async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            icon: req.body.icon || 'default-icon'
        });

        const newCategory = await category.save();
        res.status(201).json({
            success: true,
            message: 'Kategori başarıyla oluşturuldu',
            data: newCategory
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Kategori oluşturulurken bir hata oluştu',
            error: error.message
        });
    }
});

// Kategori güncelle (admin için)
router.patch('/:id', isAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Kategori bulunamadı'
            });
        }

        if (req.body.name) {
            category.name = req.body.name;
        }
        if (req.body.description) {
            category.description = req.body.description;
        }
        if (req.body.icon) {
            category.icon = req.body.icon;
        }
        if (req.body.isActive !== undefined) {
            category.isActive = req.body.isActive;
        }

        const updatedCategory = await category.save();
        res.json({
            success: true,
            message: 'Kategori başarıyla güncellendi',
            data: updatedCategory
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Kategori güncellenirken bir hata oluştu',
            error: error.message
        });
    }
});

// Kategori sil (admin için)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Kategori bulunamadı'
            });
        }

        // Kategoriyi tamamen silmek yerine isActive'i false yap
        category.isActive = false;
        await category.save();

        res.json({
            success: true,
            message: 'Kategori başarıyla silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategori silinirken bir hata oluştu',
            error: error.message
        });
    }
});

module.exports = router;
