const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder);
router.route('/my-orders').get(protect, getMyOrders);

module.exports = router;