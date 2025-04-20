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
        console.log('MongoDB bağlantısı başlatılıyor...');
        console.log('MONGODB_URI:', MONGODB_URI);
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log("MongoDB'ye başarıyla bağlandı");
    } catch (error) {
        console.error("MongoDB bağlantı hatası:", error);
        process.exit(1);
    }
};

// Veritabanına bağlan
connectDB();

// Route'ları import et
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const billRoutes = require('./routes/bills');

// Route'ları kullan
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bills', billRoutes);

// Ana route
app.get('/', (req, res) => {
    res.json({ message: 'POS API çalışıyor' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'İstenen kaynak bulunamadı'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Hata:', err);
    res.status(500).json({
        success: false,
        message: 'Sunucu hatası',
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});




