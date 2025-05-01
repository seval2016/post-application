const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        // Token'ı header'dan al
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            console.log('No Authorization header found');
            return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
        }

        // Bearer prefix varsa kaldır
        let token = authHeader;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.replace('Bearer ', '');
        }
        
        console.log('Processing token:', token);

        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        // Kullanıcıyı bul (hem userId hem id alanlarını kontrol et)
        const userId = decoded.userId || decoded.id;
        if (!userId) {
            console.log('No userId found in token');
            return res.status(401).json({ message: 'Geçersiz token' });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            console.log('No user found for id:', userId);
            return res.status(401).json({ message: 'Geçersiz token' });
        }

        // Kullanıcı aktif değilse
        if (!user.isActive) {
            console.log('User account is inactive:', userId);
            return res.status(401).json({ message: 'Hesabınız devre dışı bırakılmış' });
        }

        // Request'e user bilgisini ekle
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Geçersiz token formatı' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token süresi dolmuş' });
        }
        res.status(401).json({ message: 'Yetkilendirme başarısız' });
    }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Bu işlem için admin yetkisi gerekiyor' });
    }
};

// Check if user is manager
const isManager = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
        next();
    } else {
        res.status(403).json({ message: 'Bu işlem için yönetici yetkisi gerekiyor' });
    }
};

// Check if user is cashier
const isCashier = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'manager' || req.user.role === 'cashier')) {
        next();
    } else {
        res.status(403).json({ message: 'Bu işlem için kasiyer yetkisi gerekiyor' });
    }
};

// Check if user is inventory manager
const isInventoryManager = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'manager' || req.user.role === 'inventory')) {
        next();
    } else {
        res.status(403).json({ message: 'Bu işlem için stok yöneticisi yetkisi gerekiyor' });
    }
};

// Check if user has specific role
const hasRole = (roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'Bu işlem için gerekli yetkiye sahip değilsiniz' });
        }
    };
};

module.exports = {
    verifyToken,
    isAdmin,
    isManager,
    isCashier,
    isInventoryManager,
    hasRole
}; 