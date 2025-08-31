const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const user = await Usuario.findById(req.user._id).populate('carrito.producto');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.carrito);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    const { productoId, cantidad } = req.body;
    try {
        const user = await Usuario.findById(req.user._id);
        const producto = await Producto.findById(productoId);

        if (!producto) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const itemIndex = user.carrito.findIndex(item => item.producto.toString() === productoId);

        if (itemIndex > -1) {
            // Product already in cart, update quantity
            user.carrito[itemIndex].cantidad += cantidad;
        } else {
            // Product not in cart, add new item
            user.carrito.push({ producto: productoId, cantidad });
        }

        await user.save();
        res.status(200).json(user.carrito);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productoId
// @access  Private
const updateCartItem = async (req, res) => {
    const { productoId } = req.params;
    const { cantidad } = req.body;

    try {
        const user = await Usuario.findById(req.user._id);
        const itemIndex = user.carrito.findIndex(item => item.producto.toString() === productoId);

        if (itemIndex > -1) {
            user.carrito[itemIndex].cantidad = cantidad;
            await user.save();
            res.status(200).json(user.carrito);
        } else {
            res.status(404).json({ message: 'Product not in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productoId
// @access  Private
const removeFromCart = async (req, res) => {
    const { productoId } = req.params;
    try {
        const user = await Usuario.findById(req.user._id);
        user.carrito = user.carrito.filter(item => item.producto.toString() !== productoId);
        await user.save();
        res.status(200).json(user.carrito);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
};