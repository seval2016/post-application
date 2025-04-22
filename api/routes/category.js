const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Tüm kategorileri getir
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Kategoriler getirilirken hata:', error);
    res.status(500).json({ message: 'Kategoriler getirilirken bir hata oluştu' });
  }
});

// Yeni kategori ekle
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Kategori adı kontrolü
    if (!name) {
      return res.status(400).json({ message: 'Kategori adı gereklidir' });
    }
    
    // Aynı isimde kategori var mı kontrolü
    const existingCategory = await Category.findOne({ name: name.toLowerCase() });
    if (existingCategory) {
      return res.status(400).json({ message: 'Bu isimde bir kategori zaten mevcut' });
    }
    
    const category = new Category({
      name: name.toLowerCase(),
      description
    });
    
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Kategori eklenirken hata:', error);
    res.status(500).json({ message: 'Kategori eklenirken bir hata oluştu' });
  }
});

// Kategori güncelle
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Kategori adı kontrolü
    if (!name) {
      return res.status(400).json({ message: 'Kategori adı gereklidir' });
    }
    
    // Aynı isimde başka kategori var mı kontrolü
    const existingCategory = await Category.findOne({
      name: name.toLowerCase(),
      _id: { $ne: req.params.id }
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Bu isimde bir kategori zaten mevcut' });
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name.toLowerCase(),
        description
      },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Kategori güncellenirken hata:', error);
    res.status(500).json({ message: 'Kategori güncellenirken bir hata oluştu' });
  }
});

// Kategori sil
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }
    
    res.json({ message: 'Kategori başarıyla silindi' });
  } catch (error) {
    console.error('Kategori silinirken hata:', error);
    res.status(500).json({ message: 'Kategori silinirken bir hata oluştu' });
  }
});

module.exports = router; 