import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

// Stripe Elements
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ totalAmount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { cart, removeFromCart, updateCartItemQuantity, cartTotal } = useCart(); // Updated context
    const { user } = useUser(); // Get user
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
            const { data: clientSecretData } = await api.post('/checkout/create-payment-intent', {
                amount: Math.round(totalAmount * 100) // Amount in cents
            });

            const clientSecret = clientSecretData.clientSecret;

            // 2. Confirm the card payment with Stripe
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: user ? user.nombre : 'Guest', // Use user's name
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
                // Note: The new cart context does not have a `clearCart` method,
                // as the cart is now managed on the backend. A successful order
                // should probably clear the cart on the backend as well.
                // For now, the cart will be fetched again on next load.
                await api.post('/orders', {
                    orderItems: cart.map(item => ({
                        producto: item.producto._id,
                        nombre: item.producto.nombre,
                        cantidad: item.cantidad, // Use 'cantidad' from new context
                        imagen: item.producto.imagenes[0],
                        precio: item.producto.precio
                    })),
                    shippingAddress: shippingAddress,
                    paymentIntentId: paymentIntent.id,
                    total: totalAmount
                });

                setSuccess(true);
                setLoading(false);
                // Maybe redirect to an order confirmation page
                navigate('/my-orders'); // Assuming this page exists
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
    const { cart, cartTotal } = useCart();
    const navigate = useNavigate();

    const shippingCost = 10; // Example shipping cost
    const totalAmount = cartTotal + shippingCost;

    useEffect(() => {
        // Redirect if cart is empty after initial load
        if (cart && cart.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <div className="order-summary">
                <h2>Order Summary</h2>
                {cart.map(item => (
                    <div key={item.producto._id} className="summary-item">
                        <span>{item.producto.nombre} x {item.cantidad}</span>
                        <span>${(item.cantidad * item.producto.precio).toFixed(2)}</span>
                    </div>
                ))}
                <div className="summary-total">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
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