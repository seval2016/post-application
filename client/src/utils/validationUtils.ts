export const validationUtils = {
  email: {
    required: 'E-posta adresi zorunludur',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Geçerli bir e-posta adresi giriniz'
    }
  },

  password: {
    required: 'Şifre zorunludur',
    minLength: {
      value: 6,
      message: 'Şifre en az 6 karakter olmalıdır'
    }
  },

  name: {
    required: 'İsim zorunludur',
    minLength: {
      value: 2,
      message: 'İsim en az 2 karakter olmalıdır'
    }
  },

  phone: {
    required: 'Telefon numarası zorunludur',
    pattern: {
      value: /^[0-9]{10}$/,
      message: 'Geçerli bir telefon numarası giriniz'
    }
  },

  businessName: {
    required: 'İşletme adı zorunludur',
    minLength: {
      value: 2,
      message: 'İşletme adı en az 2 karakter olmalıdır'
    }
  },

  price: {
    required: 'Fiyat zorunludur',
    min: {
      value: 0,
      message: 'Fiyat 0\'dan büyük olmalıdır'
    }
  },

  category: {
    required: 'Kategori seçimi zorunludur'
  },

  image: {
    required: 'Ürün görseli zorunludur'
  }
}; 