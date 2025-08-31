const passport = require('passport');

// Middleware to protect routes by verifying JWT
const protect = passport.authenticate('jwt', { session: false });

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, isAdmin };