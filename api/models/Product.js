const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Ürün adı zorunludur'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Ürün fiyatı zorunludur'],
        min: [0, 'Fiyat 0\'dan küçük olamaz']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Kategori zorunludur']
    },
    image: {
        type: String,
        required: [true, 'Ürün görseli zorunludur']
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stok 0\'dan küçük olamaz']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 