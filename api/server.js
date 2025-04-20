const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});




