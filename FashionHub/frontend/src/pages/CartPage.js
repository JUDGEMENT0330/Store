import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
    const { cart, removeFromCart, updateCartItemQuantity, cartTotal, loading } = useCart();

    if (loading) {
        return <div>Cargando carrito...</div>;
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="cart-page">
                <h2>Tu carrito está vacío</h2>
                <Link to="/shop" className="btn">
                    Ir a la tienda
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h2>Tu Carrito</h2>
            <div className="cart-items">
                {cart.map((item) => (
                    <div key={item.producto._id} className="cart-item">
                        <img src={item.producto.imagenes[0]} alt={item.producto.nombre} />
                        <div className="item-details">
                            <h3>{item.producto.nombre}</h3>
                            <p>Precio: ${item.producto.precio}</p>
                            <div className="quantity-controls">
                                <button onClick={() => updateCartItemQuantity(item.producto._id, item.cantidad - 1)} disabled={item.cantidad <= 1}>-</button>
                                <span>{item.cantidad}</span>
                                <button onClick={() => updateCartItemQuantity(item.producto._id, item.cantidad + 1)}>+</button>
                            </div>
                            <button className="remove-btn" onClick={() => removeFromCart(item.producto._id)}>
                                Eliminar
                            </button>
                        </div>
                        <div className="item-total">
                            Subtotal: ${item.producto.precio * item.cantidad}
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h3>Resumen del Pedido</h3>
                <p>Total: <strong>${cartTotal.toFixed(2)}</strong></p>
                <Link to="/checkout" className="btn btn-primary">
                    Proceder al Pago
                </Link>
            </div>
        </div>
    );
};

export default CartPage;
