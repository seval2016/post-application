const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    console.log('Gelen sipariş verisi:', JSON.stringify(req.body, null, 2));

    const {
      customer,
      items,
      subtotal,
      vat,
      shipping,
      grandTotal,
      paymentMethod,
      shippingMethod,
      status,
      notes
    } = req.body;

    // Müşteri bilgilerini kontrol et
    if (!customer || !customer.firstName || !customer.lastName || !customer.email || 
        !customer.phone || !customer.address || !customer.city || 
        !customer.district || !customer.postalCode) {
      console.log('Müşteri bilgileri eksik:', customer);
      return res.status(400).json({
        success: false,
        message: 'Müşteri bilgileri eksik',
        errors: {
          customer: {
            firstName: !customer?.firstName ? 'Ad alanı zorunludur' : undefined,
            lastName: !customer?.lastName ? 'Soyad alanı zorunludur' : undefined,
            email: !customer?.email ? 'E-posta alanı zorunludur' : undefined,
            phone: !customer?.phone ? 'Telefon alanı zorunludur' : undefined,
            address: !customer?.address ? 'Adres alanı zorunludur' : undefined,
            city: !customer?.city ? 'Şehir alanı zorunludur' : undefined,
            district: !customer?.district ? 'İlçe alanı zorunludur' : undefined,
            postalCode: !customer?.postalCode ? 'Posta kodu alanı zorunludur' : undefined
          }
        }
      });
    }

    // E-posta formatını kontrol et
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(customer.email)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz e-posta formatı',
        errors: { email: 'Geçerli bir e-posta adresi giriniz' }
      });
    }

    // Telefon numarası formatını kontrol et
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(customer.phone.replace(/\D/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz telefon numarası formatı',
        errors: { phone: 'Telefon numarası 10 haneli olmalıdır' }
      });
    }

    // Posta kodu formatını kontrol et
    const postalCodeRegex = /^[0-9]{5}$/;
    if (!postalCodeRegex.test(customer.postalCode)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz posta kodu formatı',
        errors: { postalCode: 'Posta kodu 5 haneli olmalıdır' }
      });
    }

    // Vergi numarası varsa formatını kontrol et
    if (customer.taxNumber && !phoneRegex.test(customer.taxNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz vergi numarası formatı',
        errors: { taxNumber: 'Vergi numarası 10 haneli olmalıdır' }
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Ürün bilgileri eksik:', items);
      return res.status(400).json({
        success: false,
        message: 'Sipariş ürünleri eksik',
        errors: { items: 'En az bir ürün seçilmelidir' }
      });
    }

    if (!paymentMethod) {
      console.log('Ödeme yöntemi eksik:', paymentMethod);
      return res.status(400).json({
        success: false,
        message: 'Ödeme yöntemi eksik',
        errors: { paymentMethod: 'Ödeme yöntemi seçilmelidir' }
      });
    }

    // Sayısal değerleri kontrol et
    if (isNaN(subtotal) || subtotal <= 0) {
      console.log('Geçersiz ara toplam:', subtotal);
      return res.status(400).json({
        success: false,
        message: 'Geçersiz ara toplam',
        errors: { subtotal: 'Ara toplam 0\'dan büyük olmalıdır' }
      });
    }

    if (isNaN(vat) || vat < 0) {
      console.log('Geçersiz KDV:', vat);
      return res.status(400).json({
        success: false,
        message: 'Geçersiz KDV',
        errors: { vat: 'KDV 0\'dan küçük olamaz' }
      });
    }

    if (isNaN(shipping) || shipping < 0) {
      console.log('Geçersiz kargo ücreti:', shipping);
      return res.status(400).json({
        success: false,
        message: 'Geçersiz kargo ücreti',
        errors: { shipping: 'Kargo ücreti 0\'dan küçük olamaz' }
      });
    }

    if (isNaN(grandTotal) || grandTotal <= 0) {
      console.log('Geçersiz genel toplam:', grandTotal);
      return res.status(400).json({
        success: false,
        message: 'Geçersiz genel toplam',
        errors: { grandTotal: 'Genel toplam 0\'dan büyük olmalıdır' }
      });
    }

    // Yeni sipariş oluştur
    const newOrder = new Order({
      customer,
      items,
      subtotal,
      vat,
      shipping,
      grandTotal,
      paymentMethod,
      shippingMethod,
      status: status || 'pending',
      notes
    });

    // Siparişi veritabanına kaydet
    const savedOrder = await newOrder.save();
    console.log('Sipariş başarıyla oluşturuldu:', savedOrder);

    // Başarılı yanıt döndür
    return res.status(201).json({
      success: true,
      message: 'Sipariş başarıyla oluşturuldu',
      orderNumber: savedOrder._id,
      order: savedOrder
    });
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Sipariş oluşturulurken bir hata oluştu',
      error: error.message
    });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('items.productId', 'title price');

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Siparişler getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'title price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Sipariş getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
    }

    order.status = status;
    await order.save();

    // Update invoice status if order is cancelled
    if (status === 'cancelled') {
      await Invoice.findOneAndUpdate(
        { orderId: order._id },
        { status: 'cancelled' }
      );
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Sipariş durumu güncellenirken bir hata oluştu',
      error: error.message
    });
  }
}; 