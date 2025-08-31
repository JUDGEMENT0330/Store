const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');

// @route   GET /api/products
router.route('/').get(getProducts);

// @route   GET /api/products/:id
router.route('/:id').get(getProductById);

module.exports = router;