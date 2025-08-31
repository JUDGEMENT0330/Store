const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, getCart);

// @route   POST api/cart
// @desc    Add product to cart
// @access  Private
router.post('/', protect, addToCart);

// @route   DELETE api/cart/:productId
// @desc    Remove product from cart
// @access  Private
router.delete('/:productId', protect, removeFromCart);

// @route   PUT api/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put('/:productId', protect, updateCartItemQuantity);

module.exports = router;
