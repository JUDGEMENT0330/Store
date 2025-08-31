const express = require('express');
const router = express.Router();
const {
    createProduct,
    updateProduct,
    deleteProduct
} = require('../../controllers/productController');

const { protect, isAdmin } = require('../../middleware/authMiddleware');

// @route   POST /api/admin/products
router.route('/').post(protect, isAdmin, createProduct);

// @route   PUT /api/admin/products/:id
// @route   DELETE /api/admin/products/:id
router.route('/:id')
    .put(protect, isAdmin, updateProduct)
    .delete(protect, isAdmin, deleteProduct);

module.exports = router;