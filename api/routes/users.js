const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Tüm kullanıcıları getir (admin için)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            success: true,
            message: 'Kullanıcılar başarıyla getirildi',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kullanıcılar getirilirken bir hata oluştu',
            error: error.message
        });
    }
});

// Tek bir kullanıcı getir
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }
        res.json({
            success: true,
            message: 'Kullanıcı başarıyla getirildi',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kullanıcı getirilirken bir hata oluştu',
            error: error.message
        });
    }
});

// Yeni kullanıcı oluştur
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Email kontrolü
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kullanımda'
            });
        }

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
            password: req.body.password,
            phone: req.body.phone,
            addresses: req.body.addresses,
            paymentMethods: req.body.paymentMethods
        });

        // Doğrulama tokeni oluştur
        user.generateVerificationToken();

        const newUser = await user.save();
        
        // Şifreyi response'dan çıkar
        const userResponse = newUser.toObject();
        delete userResponse.password;
        
        res.status(201).json({
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu',
            data: userResponse
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Kullanıcı oluşturulurken bir hata oluştu',
            error: error.message
        });
    }
});

// Kullanıcı güncelle
router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        // Güncellenebilir alanlar
        const updateFields = [
            'firstName', 'lastName', 'phone', 'addresses', 
            'paymentMethods', 'role'
        ];

        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        // Şifre güncelleme
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        
        // Şifreyi response'dan çıkar
        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        
        res.json({
            success: true,
            message: 'Kullanıcı başarıyla güncellendi',
            data: userResponse
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Kullanıcı güncellenirken bir hata oluştu',
            error: error.message
        });
    }
});

// Kullanıcı sil
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        await user.deleteOne();
        res.json({
            success: true,
            message: 'Kullanıcı başarıyla silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kullanıcı silinirken bir hata oluştu',
            error: error.message
        });
    }
});

// Email doğrulama
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            verificationToken: req.params.token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz veya süresi dolmuş doğrulama tokeni'
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Email başarıyla doğrulandı'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Email doğrulanırken bir hata oluştu',
            error: error.message
        });
    }
});

module.exports = router; 