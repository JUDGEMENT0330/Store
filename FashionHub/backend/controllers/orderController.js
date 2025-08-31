const Pedido = require('../models/Pedido');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    const { orderItems, shippingAddress, paymentIntentId, total } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    try {
        const order = new Pedido({
            usuario: req.user._id,
            productos: orderItems,
            direccionEnvio: shippingAddress,
            stripePaymentIntentId: paymentIntentId,
            total: total,
            estado: 'pagado' // Assuming payment is confirmed on creation
        });

        const createdOrder = await order.save();

        // Update stock
        for (const item of orderItems) {
            await Producto.findByIdAndUpdate(item.producto, {
                $inc: { stock: -item.cantidad }
            });
        }

        // Add order to user's orders array
        await Usuario.findByIdAndUpdate(req.user._id, { $push: { pedidos: createdOrder._id } });

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Pedido.find({ usuario: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Pedido.find({}).populate('usuario', 'id nombre');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Pedido.findById(req.params.id);

        if (order) {
            order.estado = req.body.status || order.estado;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};