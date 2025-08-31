import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Stripe Elements
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTgbpR5o'); // Replace with your actual publishable key

const CheckoutForm = ({ totalAmount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { cartItems, clearCart } = useContext(CartContext);
    const [shippingAddress, setShippingAddress] = useState({
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        pais: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleShippingChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        const cardElement = elements.getElement(CardElement);

        try {
            // 1. Create Payment Intent on your backend
            const { data: clientSecretData } = await axios.post(`${process.env.REACT_APP_API_URL}/api/checkout/create-payment-intent`, {
                amount: Math.round(totalAmount * 100) // Amount in cents
            });

            const clientSecret = clientSecretData.clientSecret;

            // 2. Confirm the card payment with Stripe
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'Customer Name', // Replace with actual customer name from user context
                    },
                },
            });

            if (confirmError) {
                setError(confirmError.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // 3. Create Order on your backend
                await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, {
                    orderItems: cartItems.map(item => ({
                        producto: item._id,
                        nombre: item.nombre,
                        cantidad: item.qty,
                        imagen: item.imagenes[0],
                        precio: item.precio
                    })),
                    shippingAddress: shippingAddress,
                    paymentIntentId: paymentIntent.id,
                    total: totalAmount
                });

                setSuccess(true);
                clearCart(); // Clear cart after successful order
                setLoading(false);
                navigate('/my-orders'); // Redirect to user's orders page
            } else {
                setError('Payment not successful. Please try again.');
                setLoading(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Shipping Address</h2>
            <input type="text" name="direccion" placeholder="Address" value={shippingAddress.direccion} onChange={handleShippingChange} required />
            <input type="text" name="ciudad" placeholder="City" value={shippingAddress.ciudad} onChange={handleShippingChange} required />
            <input type="text" name="codigoPostal" placeholder="Postal Code" value={shippingAddress.codigoPostal} onChange={handleShippingChange} required />
            <input type="text" name="pais" placeholder="Country" value={shippingAddress.pais} onChange={handleShippingChange} required />

            <h2>Payment Information</h2>
            <CardElement className="card-element" />

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Payment Successful!</div>}

            <button type="submit" disabled={!stripe || loading}>
                {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
            </button>
        </form>
    );
};


const CheckoutPage = () => {
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.precio, 0);
    const shippingCost = 10; // Example shipping cost
    const totalAmount = subtotal + shippingCost;

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart'); // Redirect if cart is empty
        }
    }, [cartItems, navigate]);

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <div className="order-summary">
                <h2>Order Summary</h2>
                {cartItems.map(item => (
                    <div key={item._id} className="summary-item">
                        <span>{item.nombre} x {item.qty}</span>
                        <span>${(item.qty * item.precio).toFixed(2)}</span>
                    </div>
                ))}
                <div className="summary-total">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-total">
                    <span>Shipping:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="summary-total final-total">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                </div>
            </div>

            <Elements stripe={stripePromise}>
                <CheckoutForm totalAmount={totalAmount} />
            </Elements>
        </div>
    );
};

export default CheckoutPage;