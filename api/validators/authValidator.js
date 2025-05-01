const { body } = require('express-validator');

const registerValidation = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('Ad alanı zorunludur')
        .isLength({ min: 2 })
        .withMessage('Ad en az 2 karakter olmalıdır'),
    
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Soyad alanı zorunludur')
        .isLength({ min: 2 })
        .withMessage('Soyad en az 2 karakter olmalıdır'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email alanı zorunludur')
        .isEmail()
        .withMessage('Geçerli bir email adresi giriniz'),
    
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Şifre alanı zorunludur')
        .isLength({ min: 6 })
        .withMessage('Şifre en az 6 karakter olmalıdır')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        .withMessage('Şifre en az bir harf ve bir rakam içermelidir'),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage('Geçerli bir telefon numarası giriniz')
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email alanı zorunludur')
        .isEmail()
        .withMessage('Geçerli bir email adresi giriniz'),
    
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Şifre alanı zorunludur')
];

module.exports = {
    registerValidation,
    loginValidation
}; 