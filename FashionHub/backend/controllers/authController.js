const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
require('dotenv').config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const userExists = await Usuario.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Usuario.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Setup the first admin account
// @route   POST /api/auth/setup-admin
// @access  Protected by a secret key
const setupAdmin = async (req, res) => {
    const { nombre, email, password, adminSetupKey } = req.body;

    if (adminSetupKey !== process.env.ADMIN_SETUP_KEY) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        const adminExists = await Usuario.findOne({ rol: 'admin' });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin account already exists. This route is disabled.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rol: 'admin',
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                nombre: admin.nombre,
                email: admin.email,
                rol: admin.rol,
                token: generateToken(admin._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    setupAdmin,
};