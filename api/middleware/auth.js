const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Token'ı header'dan al
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            console.log('No Authorization header found');
            return res.status(401).json({
                success: false,
                message: 'Yetkilendirme token\'ı gerekli'
            });
        }

        let token = authHeader;
        // Bearer prefix varsa kaldır
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.replace('Bearer ', '');
        }
        
        console.log('Processing token:', token); // Hata ayıklama için

        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Hata ayıklama için

        // Kullanıcıyı bul
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log('No user found for id:', decoded.id);
            return res.status(401).json({
                success: false,
                message: 'Geçersiz token'
            });
        }

        // Kullanıcı aktif değilse
        if (!user.isActive) {
            console.log('User account is inactive:', decoded.id);
            return res.status(401).json({
                success: false,
                message: 'Hesabınız devre dışı bırakılmış'
            });
        }

        // Request'e user bilgisini ekle
        req.user = {
            id: user._id,
            role: user.role
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz token formatı',
                error: error.message
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token süresi dolmuş',
                error: error.message
            });
        }
        res.status(401).json({
            success: false,
            message: 'Yetkilendirme başarısız',
            error: error.message
        });
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