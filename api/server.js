const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantı URL'i
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB'ye bağlanma fonksiyonu
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB'ye başarıyla bağlandı");
    } catch (error) {
        console.error("MongoDB bağlantı hatası:", error);
        process.exit(1);
    }
};

// Veritabanına bağlan
connectDB();

// Route'ları import et
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');

// Route'ları kullan
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Ana route
app.get('/', (req, res) => {
    res.json({ message: 'POS API çalışıyor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});




