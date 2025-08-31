const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            const category = await Categoria.findOne({ slug: req.query.category });
            if (category) {
                filter.categoria = category._id;
            } else {
                // Handle case where category slug does not exist
                return res.json([]);
            }
        }
        const products = await Producto.find(filter).populate('categoria');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Producto.findById(req.params.id).populate('categoria');

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const { nombre, descripcion, precio, imagenes, categoria, stock } = req.body;

    try {
        const product = new Producto({
            nombre,
            descripcion,
            precio,
            imagenes,
            categoria,
            stock,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { nombre, descripcion, precio, imagenes, categoria, stock } = req.body;

    try {
        const product = await Producto.findById(req.params.id);

        if (product) {
            product.nombre = nombre || product.nombre;
            product.descripcion = descripcion || product.descripcion;
            product.precio = precio || product.precio;
            product.imagenes = imagenes || product.imagenes;
            product.categoria = categoria || product.categoria;
            product.stock = stock !== undefined ? stock : product.stock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Producto.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};