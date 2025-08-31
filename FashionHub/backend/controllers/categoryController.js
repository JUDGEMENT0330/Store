const Categoria = require('../models/Categoria');

// Function to create a slug from a string
const slugify = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    const { nombre, parent } = req.body;
    try {
        const categoria = await Categoria.create({
            nombre,
            slug: slugify(nombre),
            parent: parent || null
        });
        res.status(201).json(categoria);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ message: 'Category with this name already exists.' });
        } else {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        // This simple find can be enhanced to build a nested tree structure
        const categories = await Categoria.find().populate('parent');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    const { nombre, parent } = req.body;
    try {
        const categoria = await Categoria.findById(req.params.id);

        if (categoria) {
            categoria.nombre = nombre || categoria.nombre;
            categoria.slug = nombre ? slugify(nombre) : categoria.slug;
            categoria.parent = parent !== undefined ? parent : categoria.parent;

            const updatedCategoria = await categoria.save();
            res.json(updatedCategoria);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
         if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ message: 'Category with this name already exists.' });
        } else {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);

        if (categoria) {
            // TODO: Add logic to handle children categories and associated products before deletion
            await categoria.deleteOne(); // Using deleteOne instead of remove
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};