const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { errorHandler } = require('./utils/errorHandler');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();

// CORS ayarları
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads klasörünü statik olarak sunma
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));
console.log('Uploads path:', uploadsPath);

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    createTestAdmin();
  })
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Routes
const categoriesRouter = require('./routes/categories');
const productRoutes = require('./routes/products');
const uploadRouter = require('./routes/upload');
const orderRoutes = require('./routes/orderRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const authRouter = require('./routes/auth');

app.use('/api/categories', categoriesRouter);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use(errorHandler);

// Test admin kullanıcısı oluştur
const createTestAdmin = async () => {
    try {
        const adminEmail = 'admin@example.com';
        const adminPassword = 'Admin123!';
        
        // Önce admin kullanıcısını kontrol et
        let admin = await User.findOne({ email: adminEmail });
        
        if (!admin) {
            // Admin kullanıcısı yoksa oluştur
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            admin = new User({
                firstName: 'Admin',
                lastName: 'User',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isVerified: true,
                isActive: true
            });
            
            await admin.save();
            console.log('Test admin kullanıcısı oluşturuldu');
        } else {
            // Admin kullanıcısı varsa şifresini güncelle
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            admin.password = hashedPassword;
            admin.role = 'admin';
            admin.isVerified = true;
            admin.isActive = true;
            await admin.save();
            console.log('Test admin kullanıcısının şifresi güncellendi');
        }
        
        console.log('Admin kullanıcı bilgileri:', {
            _id: admin._id,
            email: admin.email,
            role: admin.role
        });
    } catch (error) {
        console.error('Test admin kullanıcısı oluşturulurken hata:', error);
    }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

module.exports = app; 