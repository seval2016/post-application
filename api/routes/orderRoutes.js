const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);

// Update order status (PATCH)
router.patch('/:id/status', orderController.updateOrderStatus);

// Update order status (PUT) - Alternatif rota
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router; 