const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    updateOrderStatus
} = require('../../controllers/orderController');
const { protect, isAdmin } = require('../../middleware/authMiddleware');

router.route('/').get(protect, isAdmin, getAllOrders);
router.route('/:id').put(protect, isAdmin, updateOrderStatus);

module.exports = router;