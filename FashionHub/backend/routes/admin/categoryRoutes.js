const express = require('express');
const router = express.Router();
const {
    createCategory,
    updateCategory,
    deleteCategory
} = require('../../controllers/categoryController');

const { protect, isAdmin } = require('../../middleware/authMiddleware');

// @route   POST /api/admin/categories
router.route('/').post(protect, isAdmin, createCategory);

// @route   PUT /api/admin/categories/:id
// @route   DELETE /api/admin/categories/:id
router.route('/:id')
    .put(protect, isAdmin, updateCategory)
    .delete(protect, isAdmin, deleteCategory);

module.exports = router;