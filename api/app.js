const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Routes
const categoriesRouter = require('./routes/categories');
app.use('/api/categories', categoriesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 