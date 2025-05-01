const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, updateProfile, changePassword, makeAdmin } = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { auth } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const validate = require('../middleware/validationMiddleware');
const { generateToken, sendVerificationEmail } = require('../utils/authUtils');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Input validation middleware
const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', JSON.stringify(errors.array(), null, 2));
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    return res.status(400).json({ 
      success: false,
      message: 'Geçersiz giriş',
      errors: errors.array()
    });
  }
  next();
};

// Sanitize email and password
const sanitizeAuthInput = [
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Şifre gereklidir')
];

// Sanitize registration input
const sanitizeRegisterInput = [
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz (örn: test@example.com)'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir (örn: Test123)'),
  body('firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Ad en az 2 karakter olmalıdır')
    .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/)
    .withMessage('Ad sadece harf içermelidir (Türkçe karakterler kabul edilir)'),
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Soyad en az 2 karakter olmalıdır')
    .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/)
    .withMessage('Soyad sadece harf içermelidir (Türkçe karakterler kabul edilir)'),
  body('phone')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Geçerli bir telefon numarası giriniz (10 haneli, örn: 05551234567)'),
  body('businessName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('İşletme adı en az 2 karakter olmalıdır')
];

// Public routes
router.post('/register', sanitizeRegisterInput, validateInput, async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, businessName } = req.body;

    console.log('Register attempt for email:', email);
    console.log('Register data:', { email, firstName, lastName, phone, businessName });

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('Email already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor',
        errors: [{ msg: 'Bu e-posta adresi zaten kullanılıyor' }]
      });
    }

    // Create new user
    user = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      businessName,
      isVerified: true // Skip email verification for now
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    console.log('User registered successfully:', user._id);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası',
      errors: [{ msg: error.message }]
    });
  }
});

router.post('/login', sanitizeAuthInput, validateInput, async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ 
        success: false,
        message: 'Geçersiz kimlik bilgileri',
        errors: [{ msg: 'Kullanıcı bulunamadı' }]
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', user._id);
      return res.status(400).json({ 
        success: false,
        message: 'Geçersiz kimlik bilgileri',
        errors: [{ msg: 'Şifre yanlış' }]
      });
    }

    // Generate token
    const token = generateToken(user._id);
    console.log('Login successful for user:', user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası',
      errors: [{ msg: error.message }]
    });
  }
});

// Protected routes
router.get('/me', verifyToken, getCurrentUser);
router.patch('/profile', verifyToken, updateProfile);
router.patch('/change-password', verifyToken, changePassword);

// Email verification
router.get('/verify-email/:token', async (req, res) => {
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

// Password reset request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email adresi gereklidir'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    console.log('Reset password token:', resetToken);

    res.json({
      success: true,
      message: 'Şifre sıfırlama talimatları email adresinize gönderildi'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre sıfırlama talebi sırasında bir hata oluştu',
      error: error.message
    });
  }
});

// Password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token ve yeni şifre gereklidir'
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş token'
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Şifreniz başarıyla güncellendi'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre sıfırlama işlemi sırasında bir hata oluştu',
      error: error.message
    });
  }
});

// Admin routes
router.get('/', verifyToken, isAdmin, async (req, res) => {
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

// Get single user
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

// Update user
router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        const updateFields = [
            'firstName', 'lastName', 'phone', 'addresses', 
            'paymentMethods', 'role'
        ];

        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
        
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

// Delete user
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

// Logout
router.post('/logout', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Çıkış başarılı'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Çıkış işlemi sırasında bir hata oluştu',
      error: error.message
    });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil bilgileri alınırken bir hata oluştu',
      error: error.message
    });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    delete updates.password;
    delete updates.email;
    delete updates.role;
    delete updates.isVerified;
    delete updates.verificationToken;
    delete updates.resetPasswordToken;
    delete updates.resetPasswordExpires;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      data: user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil güncellenirken bir hata oluştu',
      error: error.message
    });
  }
});

// Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mevcut şifre ve yeni şifre gereklidir'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mevcut şifre yanlış'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Şifreniz başarıyla değiştirildi'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre değiştirilirken bir hata oluştu',
      error: error.message
    });
  }
});

// Add address
router.post('/addresses', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    user.addresses.push(addressData);
    await user.save();

    res.json({
      success: true,
      message: 'Adres başarıyla eklendi',
      data: user.addresses[user.addresses.length - 1]
    });

  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Adres eklenirken bir hata oluştu',
      error: error.message
    });
  }
});

// Update address
router.patch('/addresses/:addressId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Adres bulunamadı'
      });
    }

    Object.assign(address, updates);
    await user.save();

    res.json({
      success: true,
      message: 'Adres başarıyla güncellendi',
      data: address
    });

  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Adres güncellenirken bir hata oluştu',
      error: error.message
    });
  }
});

// Delete address
router.delete('/addresses/:addressId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Adres bulunamadı'
      });
    }

    address.remove();
    await user.save();

    res.json({
      success: true,
      message: 'Adres başarıyla silindi'
    });

  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Adres silinirken bir hata oluştu',
      error: error.message
    });
  }
});

// Add payment method
router.post('/payment-methods', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const paymentData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    if (paymentData.cardNumber) {
      paymentData.cardNumber = paymentData.cardNumber.slice(-4).padStart(16, '*');
    }

    user.paymentMethods.push(paymentData);
    await user.save();

    res.json({
      success: true,
      message: 'Ödeme yöntemi başarıyla eklendi',
      data: user.paymentMethods[user.paymentMethods.length - 1]
    });

  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Ödeme yöntemi eklenirken bir hata oluştu',
      error: error.message
    });
  }
});

// Update payment method
router.patch('/payment-methods/:paymentId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentId } = req.params;
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    const paymentMethod = user.paymentMethods.id(paymentId);
    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: 'Ödeme yöntemi bulunamadı'
      });
    }

    if (updates.cardNumber) {
      updates.cardNumber = updates.cardNumber.slice(-4).padStart(16, '*');
    }

    Object.assign(paymentMethod, updates);
    await user.save();

    res.json({
      success: true,
      message: 'Ödeme yöntemi başarıyla güncellendi',
      data: paymentMethod
    });

  } catch (error) {
    console.error('Update payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Ödeme yöntemi güncellenirken bir hata oluştu',
      error: error.message
    });
  }
});

// Delete payment method
router.delete('/payment-methods/:paymentId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    const paymentMethod = user.paymentMethods.id(paymentId);
    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: 'Ödeme yöntemi bulunamadı'
      });
    }

    paymentMethod.remove();
    await user.save();

    res.json({
      success: true,
      message: 'Ödeme yöntemi başarıyla silindi'
    });

  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Ödeme yöntemi silinirken bir hata oluştu',
      error: error.message
    });
  }
});

// Make user admin
router.patch('/make-admin/:id', verifyToken, isAdmin, makeAdmin);

// Tüm kullanıcıları listele (sadece admin)
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        logger.info('Users fetched successfully', { count: users.length });
        res.json(users);
    } catch (error) {
        logger.error('Error fetching users:', error);
        res.status(500).json({ message: 'Kullanıcılar getirilirken bir hata oluştu' });
    }
});

module.exports = router; 