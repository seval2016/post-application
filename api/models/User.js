const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Ad alanı zorunludur'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Soyad alanı zorunludur'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email alanı zorunludur'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir email adresi giriniz']
    },
    password: {
        type: String,
        required: [true, 'Şifre alanı zorunludur'],
        minlength: [6, 'Şifre en az 6 karakter olmalıdır']
    },
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'manager', 'cashier', 'staff', 'inventory'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    addresses: [{
        title: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    paymentMethods: [{
        type: {
            type: String,
            enum: ['credit_card', 'debit_card', 'bank_account']
        },
        cardNumber: String,
        expiryDate: String,
        cardHolderName: String,
        isDefault: Boolean
    }],
    lastLogin: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Şifre hashleme middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Doğrulama tokeni oluşturma metodu
userSchema.methods.generateVerificationToken = function() {
    this.verificationToken = crypto.randomBytes(32).toString('hex');
    this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat geçerli
    return this.verificationToken;
};

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Kullanıcı bilgilerini JSON'a çevirirken hassas bilgileri çıkar
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.verificationToken;
    delete obj.verificationTokenExpires;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpires;
    return obj;
};

// Tam ad getter metodu
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('User', userSchema);

module.exports = User; 