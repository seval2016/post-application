const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// JWT token oluşturma fonksiyonu
const generateToken = (userId) => {
    try {
        console.log('Generating token for userId:', userId);
        console.log('JWT_SECRET:', process.env.JWT_SECRET);

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Token generated successfully:', token);
        return token;
    } catch (error) {
        console.error('Token generation error:', error);
        throw error;
    }
};

// Email gönderme fonksiyonu
const sendVerificationEmail = async (email, token) => {
    try {
        // Email gönderici yapılandırması
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email içeriği
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Email Doğrulama',
            html: `
                <h1>Email Doğrulama</h1>
                <p>Email adresinizi doğrulamak için aşağıdaki linke tıklayın:</p>
                <a href="http://localhost:3000/verify-email/${token}">Doğrula</a>
                <p>Bu link 1 saat süreyle geçerlidir.</p>
            `
        };

        // Email gönderme
        await transporter.sendMail(mailOptions);
        console.log(`Doğrulama emaili gönderildi: ${email}`);
    } catch (error) {
        console.error('Email gönderme hatası:', error);
        throw error;
    }
};

module.exports = {
    generateToken,
    sendVerificationEmail
}; 