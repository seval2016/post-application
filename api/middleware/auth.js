const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
    try {
        // Token'ı header'dan al
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            logger.warn('Auth attempt without token', { ip: req.ip });
            return res.status(401).json({ message: 'Yetkilendirme başarısız' });
        }

        logger.info('Processing token:', { token });

        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.info('Decoded token:', decoded);
        
        // Token'ın süresi dolmuş mu kontrol et
        if (decoded.exp < Date.now() / 1000) {
            logger.warn('Expired token attempt', { ip: req.ip });
            return res.status(401).json({ message: 'Token süresi dolmuş' });
        }

        // Kullanıcı ID'sini ObjectId'ye çevir
        let userId;
        try {
            userId = new mongoose.Types.ObjectId(decoded.userId);
            logger.info('Converted userId to ObjectId:', { userId: userId.toString() });
        } catch (error) {
            logger.error('Invalid userId format:', { error: error.message, userId: decoded.userId });
            return res.status(401).json({ message: 'Geçersiz kullanıcı kimliği' });
        }

        // Kullanıcıyı bul
        const user = await User.findById(userId).select('-password');
        logger.info('User lookup result:', { 
            found: !!user, 
            userId: userId.toString(),
            user: user ? { _id: user._id, email: user.email, role: user.role } : null
        });

        if (!user) {
            logger.warn('Invalid user token', { userId: userId.toString(), ip: req.ip });
            return res.status(401).json({ message: 'Yetkilendirme başarısız' });
        }

        // Kullanıcı hesabı aktif mi kontrol et
        if (!user.isActive) {
            logger.warn('Inactive account attempt', { userId: user._id, ip: req.ip });
            return res.status(401).json({ message: 'Hesabınız aktif değil' });
        }

        // Kullanıcı bilgilerini request'e ekle
        req.user = user;
        req.token = token;

        // Rate limiting için IP'yi logla
        logger.info('Successful authentication', { 
            userId: user._id, 
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        next();
    } catch (error) {
        logger.error('Auth middleware error:', { 
            error: error.message,
            stack: error.stack,
            ip: req.ip
        });
        res.status(401).json({ message: 'Yetkilendirme başarısız' });
    }
};

// Admin yetkisi kontrolü
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Bu işlem için admin yetkisi gerekli'
        });
    }
    next();
};

module.exports = {
    auth,
    isAdmin
}; 