const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    firstName: { type: String, required: [true, 'Ad alanı zorunludur'] },
    lastName: { type: String, required: [true, 'Soyad alanı zorunludur'] },
    email: { 
      type: String, 
      required: [true, 'E-posta alanı zorunludur'],
      match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta adresi giriniz']
    },
    phone: { 
      type: String, 
      required: [true, 'Telefon alanı zorunludur'],
      match: [/^[0-9]{10}$/, 'Telefon numarası 10 haneli olmalıdır']
    },
    address: { type: String, required: [true, 'Adres alanı zorunludur'] },
    city: { type: String, required: [true, 'Şehir alanı zorunludur'] },
    district: { type: String, required: [true, 'İlçe alanı zorunludur'] },
    postalCode: { 
      type: String, 
      required: [true, 'Posta kodu alanı zorunludur'],
      match: [/^[0-9]{5}$/, 'Posta kodu 5 haneli olmalıdır']
    },
    country: { type: String, default: 'Turkey' },
    companyName: { type: String },
    taxNumber: { 
      type: String,
      match: [/^[0-9]{10}$/, 'Vergi numarası 10 haneli olmalıdır']
    },
    taxOffice: { type: String }
  },
  items: [{
    productId: { type: String, required: [true, 'Ürün ID alanı zorunludur'] },
    title: { type: String, required: [true, 'Ürün adı alanı zorunludur'] },
    quantity: { 
      type: Number, 
      required: [true, 'Miktar alanı zorunludur'],
      min: [1, 'Miktar en az 1 olmalıdır']
    },
    price: { 
      type: Number, 
      required: [true, 'Fiyat alanı zorunludur'],
      min: [0, 'Fiyat 0\'dan büyük olmalıdır']
    }
  }],
  subtotal: { 
    type: Number, 
    required: [true, 'Ara toplam alanı zorunludur'],
    min: [0, 'Ara toplam 0\'dan büyük olmalıdır']
  },
  vat: { 
    type: Number, 
    required: [true, 'KDV alanı zorunludur'],
    min: [0, 'KDV 0\'dan büyük olmalıdır']
  },
  shipping: { 
    type: Number, 
    required: [true, 'Kargo ücreti alanı zorunludur'],
    min: [0, 'Kargo ücreti 0\'dan büyük olmalıdır']
  },
  grandTotal: { 
    type: Number, 
    required: [true, 'Genel toplam alanı zorunludur'],
    min: [0, 'Genel toplam 0\'dan büyük olmalıdır']
  },
  paymentMethod: { 
    type: String, 
    required: [true, 'Ödeme yöntemi alanı zorunludur'],
    enum: {
      values: ['credit_card', 'cash_on_delivery', 'bank_transfer'],
      message: 'Geçersiz ödeme yöntemi'
    }
  },
  shippingMethod: { 
    type: String, 
    required: [true, 'Kargo yöntemi alanı zorunludur'],
    default: 'standard',
    enum: {
      values: ['standard', 'express'],
      message: 'Geçersiz kargo yöntemi'
    }
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema); 