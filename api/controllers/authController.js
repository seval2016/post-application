const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register new user
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password,
            phone,
            role: role || 'user' // Eğer role belirtilmemişse varsayılan olarak 'user'
        });

        // Save user
        await user.save();
        console.log('User saved successfully:', user._id);

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        console.log('JWT token generated');

        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        console.log('Login attempt with email:', req.body.email);
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(401).json({ message: 'Geçersiz email veya şifre' });
        }

        console.log('User found:', user._id, 'Role:', user.role);

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password mismatch for user:', user._id);
            return res.status(401).json({ message: 'Geçersiz email veya şifre' });
        }

        console.log('Password verified for user:', user._id);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('JWT token generated for user:', user._id);

        res.json({
            message: 'Giriş başarılı',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;

        await user.save();
        res.json({ message: 'Profil başarıyla güncellendi', user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
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