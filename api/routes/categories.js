const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isManager, hasRole } = require('../middleware/authMiddleware');
const Category = require('../models/Category');

// Tüm kategorileri getir (herkes erişebilir)
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Kategoriler getirilirken bir hata oluştu', error: error.message });
    }
});

// Tek bir kategori getir (herkes erişebilir)
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Kategori getirilirken bir hata oluştu', error: error.message });
    }
});

// Yeni kategori oluştur (sadece admin ve manager)
router.post('/', verifyToken, hasRole(['admin', 'manager']), async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Kategori oluşturulurken bir hata oluştu', error: error.message });
    }
});

// Kategori güncelle (sadece admin ve manager)
router.patch('/:id', verifyToken, hasRole(['admin', 'manager']), async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }

        if (name) category.name = name;
        if (description) category.description = description;

        await category.save();
        res.json(category);
    } catch (error) {
        res.status(400).json({ message: 'Kategori güncellenirken bir hata oluştu', error: error.message });
    }
});

// Kategori sil (sadece admin)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }

        await category.deleteOne();
        res.json({ message: 'Kategori başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Kategori silinirken bir hata oluştu', error: error.message });
    }
});

module.exports = router;
