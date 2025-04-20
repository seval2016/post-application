const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Token'ı header'dan al
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Yetkilendirme token\'ı gerekli'
            });
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('Verifying token:', token); // Hata ayıklama için

        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Hata ayıklama için

        // Kullanıcıyı bul
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz token'
            });
        }

        // Kullanıcı aktif değilse
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Hesabınız devre dışı bırakılmış'
            });
        }

        // Request'e user bilgisini ekle
        req.user = {
            userId: user._id,
            role: user.role
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
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