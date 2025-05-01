const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authService = require('../services/authService');
const { AppError } = require('../utils/errorHandler');

// Register new user
const register = async (req, res, next) => {
    try {
        const { user, token } = await authService.register(req.body);
        res.status(201).json({
            success: true,
            data: { user, token }
        });
    } catch (error) {
        next(error);
    }
};

// Login user
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        res.json({
            success: true,
            data: { user, token }
        });
    } catch (error) {
        next(error);
    }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await authService.getCurrentUser(req.user.id);
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Profil güncelleme yardımcı fonksiyonları
const validateProfileUpdate = (updates) => {
    const allowedFields = ['firstName', 'lastName', 'phone', 'addresses', 'paymentMethods'];
    const validatedUpdates = {};

    for (const field of allowedFields) {
        if (updates[field] !== undefined) {
            validatedUpdates[field] = updates[field];
        }
    }

    return validatedUpdates;
};

const updateUserProfile = async (userId, updates) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('Kullanıcı bulunamadı', 404);
    }

    const validatedUpdates = validateProfileUpdate(updates);
    Object.assign(user, validatedUpdates);

    return await user.save();
};

// Profil güncelleme ana fonksiyonu
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const updatedUser = await updateUserProfile(userId, updates);
        
        // Hassas bilgileri response'dan çıkar
        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        delete userResponse.resetPasswordToken;
        delete userResponse.resetPasswordExpires;

        res.json({
            success: true,
            message: 'Profil başarıyla güncellendi',
            data: userResponse
        });
    } catch (error) {
        next(error);
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mevcut şifre yanlış' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Şifre başarıyla güncellendi' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Make user admin
const makeAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        user.role = 'admin';
        await user.save();

        res.json({ 
            message: 'Kullanıcı admin yapıldı',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Make admin error:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Test admin kullanıcısı oluştur
const createTestAdmin = async () => {
    try {
        // Admin kullanıcısı var mı kontrol et
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        
        if (!adminExists) {
            // Admin kullanıcısı oluştur
            const admin = new User({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin',
                isActive: true
            });
            
            await admin.save();
            console.log('Test admin kullanıcısı oluşturuldu');
        } else {
            // Admin kullanıcısının şifresini güncelle
            adminExists.password = 'admin123';
            await adminExists.save();
            console.log('Test admin kullanıcısının şifresi güncellendi');
        }
    } catch (error) {
        console.error('Test admin oluşturma hatası:', error);
    }
};

// Uygulama başladığında test admin kullanıcısını oluştur
createTestAdmin();

module.exports = {
    register,
    login,
    getCurrentUser,
    updateProfile,
    changePassword,
    makeAdmin
}; 