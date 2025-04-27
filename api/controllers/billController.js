const Bill = require('../models/Bill');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all bills
// @route   GET /api/v1/bills
// @access  Public
exports.getAllBills = asyncHandler(async (req, res, next) => {
  const bills = await Bill.find()
    .populate('orderId', 'status')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bills.length,
    data: bills
  });
});

// @desc    Get single bill
// @route   GET /api/v1/bills/:id
// @access  Public
exports.getBillById = asyncHandler(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id)
    .populate('orderId', 'status');
  
  if (!bill) {
    return next(new ErrorResponse(`Bill not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: bill
  });
});

// @desc    Get bill by order ID
// @route   GET /api/v1/bills/order/:orderId
// @access  Public
exports.getBillByOrderId = asyncHandler(async (req, res, next) => {
  const bill = await Bill.findOne({ orderId: req.params.orderId })
    .populate('orderId', 'status');
  
  if (!bill) {
    return next(new ErrorResponse(`Bill not found for order ${req.params.orderId}`, 404));
  }

  res.status(200).json({
    success: true,
    data: bill
  });
});

// @desc    Create new bill
// @route   POST /api/v1/bills
// @access  Private/Admin
exports.createBill = asyncHandler(async (req, res, next) => {
  // Check if order exists
  const order = await Order.findById(req.body.orderId);
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.body.orderId}`, 404));
  }

  // Generate bill number
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const billNumber = `BILL-${year}${month}-${random}`;

  // Create bill
  const bill = await Bill.create({
    ...req.body,
    billNumber,
    items: order.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price
    })),
    subtotal: order.subtotal,
    tax: order.tax,
    shippingCost: order.shippingCost,
    total: order.total,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    data: bill
  });
});

// @desc    Update bill
// @route   PUT /api/v1/bills/:id
// @access  Private/Admin
exports.updateBill = asyncHandler(async (req, res, next) => {
  let bill = await Bill.findById(req.params.id);

  if (!bill) {
    return next(new ErrorResponse(`Bill not found with id of ${req.params.id}`, 404));
  }

  bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: bill
  });
});

// @desc    Update bill status
// @route   PUT /api/v1/bills/:id/status
// @access  Private/Admin
exports.updateBillStatus = asyncHandler(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);

  if (!bill) {
    return next(new ErrorResponse(`Bill not found with id of ${req.params.id}`, 404));
  }

  bill.status = req.body.status;
  await bill.save();

  // Update order status if bill is paid
  if (req.body.status === 'paid') {
    await Order.findByIdAndUpdate(bill.orderId, {
      status: 'processing'
    });
  }

  res.status(200).json({
    success: true,
    data: bill
  });
});

// @desc    Delete bill
// @route   DELETE /api/v1/bills/:id
// @access  Private/Admin
exports.deleteBill = asyncHandler(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);

  if (!bill) {
    return next(new ErrorResponse(`Bill not found with id of ${req.params.id}`, 404));
  }

  await bill.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 