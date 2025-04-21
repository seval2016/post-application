const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Geçersiz token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Geçersiz token' });
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