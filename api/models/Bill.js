const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    shipping: {
        type: Number,
        default: 0
    },
    vat: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['Ödendi', 'Beklemede', 'İptal Edildi'],
        default: 'Beklemede'
    },
    paymentMethod: {
        type: String,
        enum: ['creditCard', 'bankTransfer'],
        required: true
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    billingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    notes: String,
    paymentDetails: {
        cardLastFourDigits: String,
        installmentCount: Number,
        installmentAmount: Number
    }
});

// Fatura numarası oluşturma
billSchema.pre('save', function(next) {
    if (!this.id) {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.id = `INV-${year}-${random}`;
    }
    next();
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill; 