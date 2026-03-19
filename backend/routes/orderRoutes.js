const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/place', protect, placeOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/all', protect, admin, getAllOrders);
router.put('/status/:id', protect, admin, updateOrderStatus);

module.exports = router;
