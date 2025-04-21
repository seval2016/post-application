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
require('dotenv').config();

// JWT token oluşturma fonksiyonu
const generateToken = (userId) => {
  try {
    console.log('Generating token for userId:', userId); // Hata ayıklama için
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Hata ayıklama için

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Token generated successfully:', token); // Hata ayıklama için
    return token;
  } catch (error) {
    console.error('Token generation error:', error); // Hata ayıklama için
    throw error;
  }
};

// Email gönderme fonksiyonu
const sendVerificationEmail = async (email, token) => {
  // Gerçek uygulamada burada email gönderme işlemi yapılır
  console.log(`Doğrulama linki: http://localhost:3000/verify-email/${token}`);
};

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);
router.patch('/profile', verifyToken, updateProfile);
router.patch('/change-password', verifyToken, changePassword);

// Email doğrulama
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

// Şifre sıfırlama talebi endpoint'i
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

    // Rastgele token oluştur
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Token'ı kullanıcıya kaydet
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 saat geçerli
    await user.save();

    // TODO: Email gönderme işlemi eklenecek
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

// Şifre sıfırlama endpoint'i
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token ve yeni şifre gereklidir'
      });
    }

    // Token'ı hashle
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Token'a sahip ve süresi geçmemiş kullanıcıyı bul
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

    // Yeni şifreyi kaydet
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
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
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

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    // Client tarafında token'ı silmek yeterli olacaktır
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

// Kullanıcı profili görüntüleme endpoint'i
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.userId; // Auth middleware'den gelen user bilgisi
    console.log('Fetching profile for userId:', userId);

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

// Kullanıcı profili güncelleme endpoint'i
router.patch('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.userId; // Auth middleware'den gelen user bilgisi
    const updates = req.body;
    console.log('Updating profile for userId:', userId);

    // Güvenlik için hassas alanların güncellenmesini engelle
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

// Şifre değiştirme endpoint'i
router.post('/change-password', auth, async (req, res) => {
  try {
    const userId = req.user.userId; // Auth middleware'den gelen user bilgisi
    const { currentPassword, newPassword } = req.body;
    console.log('Changing password for userId:', userId);

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

    // Mevcut şifreyi kontrol et
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mevcut şifre yanlış'
      });
    }

    // Yeni şifreyi kaydet
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

// Adres ekleme endpoint'i
router.post('/addresses', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressData = req.body;
    console.log('Adding address for userId:', userId);

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

// Adres güncelleme endpoint'i
router.patch('/addresses/:addressId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;
    const updates = req.body;
    console.log('Updating address for userId:', userId, 'addressId:', addressId);

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

// Adres silme endpoint'i
router.delete('/addresses/:addressId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;
    console.log('Deleting address for userId:', userId, 'addressId:', addressId);

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

// Ödeme yöntemi ekleme endpoint'i
router.post('/payment-methods', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const paymentData = req.body;
    console.log('Adding payment method for userId:', userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Kredi kartı numarasını maskele
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

// Ödeme yöntemi güncelleme endpoint'i
router.patch('/payment-methods/:paymentId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentId } = req.params;
    const updates = req.body;
    console.log('Updating payment method for userId:', userId, 'paymentId:', paymentId);

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

    // Kredi kartı numarası güncellenmişse maskele
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

// Ödeme yöntemi silme endpoint'i
router.delete('/payment-methods/:paymentId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentId } = req.params;
    console.log('Deleting payment method for userId:', userId, 'paymentId:', paymentId);

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

module.exports = router; 