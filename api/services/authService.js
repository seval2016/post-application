const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');

class AuthService {
    async register(userData) {
        try {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new AppError('Bu email adresi zaten kullanımda', 400);
            }

            const user = new User(userData);
            await user.save();

            const token = this.generateToken(user);
            return { user, token };
        } catch (error) {
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async login(email, password) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AppError('Geçersiz email veya şifre', 401);
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                throw new AppError('Geçersiz email veya şifre', 401);
            }

            const token = this.generateToken(user);
            return { user, token };
        } catch (error) {
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async getCurrentUser(userId) {
        try {
            const user = await User.findById(userId).select('-password');
            if (!user) {
                throw new AppError('Kullanıcı bulunamadı', 404);
            }
            return user;
        } catch (error) {
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    generateToken(user) {
        return jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
    }
}

module.exports = new AuthService(); 