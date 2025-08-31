const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).populate('carrito.producto');
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json(usuario.carrito);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

// Add product to cart
exports.addToCart = async (req, res) => {
    const { productoId, cantidad } = req.body;

    try {
        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        const usuario = await Usuario.findById(req.user.id);
        const itemIndex = usuario.carrito.findIndex(p => p.producto.toString() === productoId);

        if (itemIndex > -1) {
            // Product already in cart, update quantity
            usuario.carrito[itemIndex].cantidad += cantidad || 1;
        } else {
            // Product not in cart, add new item
            usuario.carrito.push({ producto: productoId, cantidad: cantidad || 1 });
        }

        await usuario.save();
        const populatedUsuario = await Usuario.findById(req.user.id).populate('carrito.producto');
        res.json(populatedUsuario.carrito);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;

    try {
        const usuario = await Usuario.findById(req.user.id);

        usuario.carrito = usuario.carrito.filter(
            ({ producto }) => producto.toString() !== productId
        );

        await usuario.save();
        const populatedUsuario = await Usuario.findById(req.user.id).populate('carrito.producto');
        res.json(populatedUsuario.carrito);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

// Update cart item quantity
exports.updateCartItemQuantity = async (req, res) => {
    const { productId } = req.params;
    const { cantidad } = req.body;

    if (cantidad <= 0) {
        return res.status(400).json({ msg: 'La cantidad debe ser mayor que cero' });
    }

    try {
        const usuario = await Usuario.findById(req.user.id);
        const itemIndex = usuario.carrito.findIndex(p => p.producto.toString() === productId);

        if (itemIndex > -1) {
            usuario.carrito[itemIndex].cantidad = cantidad;
            await usuario.save();
            const populatedUsuario = await Usuario.findById(req.user.id).populate('carrito.producto');
            res.json(populatedUsuario.carrito);
        } else {
            return res.status(404).json({ msg: 'Producto no encontrado en el carrito' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};
