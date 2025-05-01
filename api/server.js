const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const app = express();

// JWT_SECRET kontrolü
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set in environment variables. Using a default value for development.');
  process.env.JWT_SECRET = 'pos-application-secret-key-for-development';
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// Karakter kodlaması ayarları
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Statik dosya sunumu için uploads klasörünü ayarla
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Uploads klasörünün varlığını kontrol et
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads klasörü oluşturuldu:', uploadsDir);
}

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000, // 10 saniye timeout
  socketTimeoutMS: 45000, // 45 saniye socket timeout
  retryWrites: true,
  w: 'majority'
})
.then(() => {
  console.log('MongoDB bağlantısı başarılı');
})
.catch((err) => {
  console.error('MongoDB bağlantı hatası:', err);
  process.exit(1); // Bağlantı başarısız olursa uygulamayı sonlandır
});

// MongoDB bağlantı durumunu izle
mongoose.connection.on('error', err => {
  console.error('MongoDB bağlantı hatası:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB bağlantısı kesildi');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB bağlantısı yeniden kuruldu');
});

// Route'ları import et
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const billRoutes = require('./routes/bills');
const uploadRouter = require('./routes/upload');
const orderRoutes = require('./routes/orderRoutes');

// Route'ları kullan
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/upload', uploadRouter);
app.use('/api/orders', orderRoutes);

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




