import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartIcon.css';
import { ReactComponent as ShoppingIcon } from '../../assets/shopping-bag.svg';

const CartIcon = () => {
    // Use the new useCart hook and cartCount from our backend-connected context
    const { cartCount } = useCart();

    return (
        <Link to="/cart" className="cart-icon-link">
            <div className="cart-icon">
                <ShoppingIcon className="shopping-icon" />
                <span className="item-count">{cartCount}</span>
            </div>
        </Link>
    );
};

export default CartIcon;