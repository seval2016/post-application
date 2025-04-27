const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      paymentMethod,
      shippingMethod
    } = req.body;

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      item.price = product.price;
      subtotal += item.price * item.quantity;
    }

    const vat = subtotal * 0.18; // 18% VAT
    const shipping = shippingMethod === 'express' ? 50 : 20;
    const grandTotal = subtotal + vat + shipping;

    // Create order
    const order = new Order({
      customer,
      items,
      subtotal,
      vat,
      shipping,
      grandTotal,
      paymentMethod,
      shippingMethod
    });

    await order.save();

    // Generate invoice number
    const currentYear = new Date().getFullYear();
    const invoiceCount = await Invoice.countDocuments();
    const invoiceNumber = `INV-${currentYear}-${(invoiceCount + 1).toString().padStart(4, '0')}`;

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber,
      orderId: order._id,
      customer,
      items,
      subtotal,
      vat,
      shipping,
      grandTotal,
      paymentMethod,
      shippingMethod
    });

    await invoice.save();

    res.status(201).json({
      success: true,
      data: {
        order,
        invoice
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
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