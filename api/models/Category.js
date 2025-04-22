const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Kategori görseli zorunludur']
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
