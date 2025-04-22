const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Kategori adı zorunludur'],
        unique: true
    },
    image: {
        type: String,
        required: [true, 'Kategori görseli zorunludur']
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
