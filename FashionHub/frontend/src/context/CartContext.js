import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useUser } from './UserContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser(); // Use the new hook

    const getCart = async (token) => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await api.get('/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(res.data);
        } catch (err) {
            console.error('Error fetching cart', err.response ? err.response.data : err.message);
            if (err.response && err.response.status === 404) {
                setCart([]);
            }
        } finally {
            setLoading(false);
        }
    };

    // All action functions will now get the token from the user object
    const addToCart = async (productoId, cantidad = 1) => {
        const token = user?.token;
        if (!token) {
            alert('Por favor, inicie sesión para agregar productos al carrito.');
            return;
        }
        try {
            const res = await api.post('/cart', { productoId, cantidad }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(res.data);
        } catch (err) {
            console.error('Error adding to cart', err.response ? err.response.data : err.message);
        }
    };

    const removeFromCart = async (productoId) => {
        const token = user?.token;
        if (!token) return;
        try {
            const res = await api.delete(`/cart/${productoId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(res.data);
        } catch (err) {
            console.error('Error removing from cart', err.response ? err.response.data : err.message);
        }
    };

    const updateCartItemQuantity = async (productoId, cantidad) => {
        const token = user?.token;
        if (!token) return;
        try {
            const res = await api.put(`/cart/${productoId}`, { cantidad }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(res.data);
        } catch (err) {
            console.error('Error updating cart quantity', err.response ? err.response.data : err.message);
        }
    };

    useEffect(() => {
        const token = user?.token;
        if (token) {
            getCart(token);
        } else {
            // Clear cart if user logs out or no token
            setCart([]);
            setLoading(false);
        }
    }, [user]);

    const value = {
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        cartCount: cart.reduce((acc, item) => acc + item.cantidad, 0),
        cartTotal: cart.reduce((acc, item) => {
            if (item.producto && typeof item.producto.precio === 'number') {
                return acc + item.producto.precio * item.cantidad;
            }
            return acc;
        }, 0),
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};