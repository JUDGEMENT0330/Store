import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product._id);
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product._id}`}>
                <img src={product.imagenes[0]} alt={product.nombre} className="product-image" />
                <div className="product-info">
                    <h3 className="product-name">{product.nombre}</h3>
                    <p className="product-price">${product.precio.toFixed(2)}</p>
                </div>
            </Link>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Añadir al Carrito
            </button>
        </div>
    );
};

export default ProductCard;
