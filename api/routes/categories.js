const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { verifyToken, hasRole } = require('../middleware/authMiddleware');

// Tüm kategorileri getir (herkes erişebilir)
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        const formattedCategories = categories.map(category => ({
            id: category._id,
            name: category.name,
            image: category.image
        }));
        res.status(200).json(formattedCategories);
    } catch (error) {
        res.status(500).json({ error: 'Kategoriler getirilirken bir hata oluştu' });
    }
});

// Tek bir kategori getir (herkes erişebilir)
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }
        res.json({
            id: category._id,
            name: category.name,
            image: category.image
        });
    } catch (error) {
        res.status(500).json({ message: 'Kategori getirilirken bir hata oluştu', error: error.message });
    }
});

// Yeni kategori ekle (tüm giriş yapmış kullanıcılar)
router.post('/', async (req, res) => {
    try {
        console.log('POST /api/categories - Gelen istek başladı');
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        
        const { name, image } = req.body;
        console.log('Ayrıştırılan veriler:', { name, image });
        
        // Boş değerleri kontrol et
        if (!name || name.trim() === '') {
            console.log('Validasyon hatası: name boş');
            return res.status(400).json({ error: 'Kategori adı zorunludur' });
        }
        
        if (!image || image.trim() === '') {
            console.log('Validasyon hatası: image boş');
            return res.status(400).json({ error: 'Kategori görseli zorunludur' });
        }
        
        // Temizlenmiş değerleri kullan
        const cleanName = name.trim();
        const cleanImage = image.trim();
        
        console.log('Temizlenmiş veriler:', { cleanName, cleanImage });
        
        // Kategori modelini oluştur
        const newCategory = new Category({
            name: cleanName,
            image: cleanImage
        });
        
        console.log('Oluşturulan kategori modeli:', newCategory);
        
        // Kategoriyi kaydet
        console.log('Kategori kaydediliyor...');
        const savedCategory = await newCategory.save();
        console.log('Kaydedilen kategori:', savedCategory);
        
        // Başarılı yanıt döndür
        const response = {
            id: savedCategory._id,
            name: savedCategory.name,
            image: savedCategory.image
        };
        console.log('Gönderilen yanıt:', response);
        
        res.status(201).json(response);
    } catch (error) {
        console.error('Kategori ekleme hatası:', error);
        
        // Mongoose validation hatası
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: validationErrors.join(', ') });
        }
        
        // Duplicate key hatası
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Bu kategori adı zaten kullanılıyor' });
        }
        
        res.status(500).json({ error: 'Kategori eklenirken bir hata oluştu' });
    }
});

// Kategori güncelle (tüm giriş yapmış kullanıcılar)
router.put('/:id', verifyToken, hasRole(['admin', 'manager', 'cashier']), async (req, res) => {
    try {
        const { name, image } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { 
                name,
                image
            },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Kategori bulunamadı' });
        }
        res.status(200).json({
            id: updatedCategory._id,
            name: updatedCategory.name,
            image: updatedCategory.image
        });
    } catch (error) {
        res.status(500).json({ error: 'Kategori güncellenirken bir hata oluştu' });
    }
});

// Kategori sil (sadece admin ve manager)
router.delete('/:id', verifyToken, hasRole(['admin', 'manager']), async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Kategori bulunamadı' });
        }
        res.status(200).json({ message: 'Kategori başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ error: 'Kategori silinirken bir hata oluştu' });
    }
});

// Tüm kategorileri sil (sadece admin)
router.delete('/', verifyToken, hasRole(['admin']), async (req, res) => {
    try {
        const result = await Category.deleteMany({});
        res.status(200).json({ 
            message: 'Tüm kategoriler başarıyla silindi',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Kategoriler silinirken hata:', error);
        res.status(500).json({ error: 'Kategoriler silinirken bir hata oluştu' });
    }
});

module.exports = router;
