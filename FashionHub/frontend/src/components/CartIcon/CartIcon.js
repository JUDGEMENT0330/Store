import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import './CartIcon.css';
import { ReactComponent as ShoppingIcon } from '../../assets/shopping-bag.svg';

const CartIcon = ({ onClick }) => {
    const { cartItems } = useContext(CartContext);
    const itemCount = cartItems.reduce((quantity, item) => quantity + item.qty, 0);

    return (
        <div className="cart-icon" onClick={onClick}>
            <ShoppingIcon className="shopping-icon" />
            <span className="item-count">{itemCount}</span>
        </div>
    );
};

export default CartIcon;