require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create a payment intent
// @route   POST /api/checkout/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
    const { amount } = req.body; // amount should be in the smallest currency unit (e.g., cents)

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd', // or your desired currency
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createPaymentIntent,
};