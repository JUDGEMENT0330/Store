require('dotenv').config();
const express = require('express');
const cors = require('cors');
// DB connection
const connectDB = require('./config/db');

// Pre-load all models
require('./models/Usuario');
require('./models/Producto');
require('./models/Categoria');
require('./models/Pedido');

const app = express();

// Connect to Database only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(cors());
app.use(express.json());

// Passport middleware
const passport = require('passport');
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Basic Route
app.get('/', (req, res) => {
    res.send('FashionHub API is running...');
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/admin/categories', require('./routes/admin/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin/products', require('./routes/admin/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin/orders', require('./routes/admin/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/checkout', require('./routes/checkoutRoutes'));


const PORT = process.env.PORT || 5000;

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;