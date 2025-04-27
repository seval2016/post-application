const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', billController.getAllBills);
router.get('/:id', billController.getBillById);
router.get('/order/:orderId', billController.getBillByOrderId);

// Protected routes
router.use(protect);

// Admin only routes
router.use(authorize('admin'));

router.post('/', billController.createBill);
router.put('/:id', billController.updateBill);
router.put('/:id/status', billController.updateBillStatus);
router.delete('/:id', billController.deleteBill);

module.exports = router; 