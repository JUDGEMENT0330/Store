import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import './CartDropdown.css';
import { useNavigate } from 'react-router-dom';

const CartDropdown = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const goToCheckoutHandler = () => {
        navigate('/checkout');
        // Optionally, close the dropdown here
    };

    return (
        <div className="cart-dropdown-container">
            <div className="cart-items">
                {cartItems.length ? (
                    cartItems.map((item) => (
                        <div key={item._id} className="cart-item">
                            <img src={item.imagenes[0]} alt={item.nombre} />
                            <div className="item-details">
                                <span className="name">{item.nombre}</span>
                                <span className="price">
                                    {item.qty} x ${item.precio}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <span className="empty-message">Your cart is empty</span>
                )}
            </div>
            <button onClick={goToCheckoutHandler}>GO TO CHECKOUT</button>
            {cartItems.length > 0 && (
                <button onClick={clearCart} className="clear-cart-button">Clear Cart</button>
            )}
        </div>
    );
};

export default CartDropdown;