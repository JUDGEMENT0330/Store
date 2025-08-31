import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './ProductList.css';

const ProductList = ({ categorySlug }) => {
    const [products, setProducts] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = categorySlug ? `/api/products?category=${categorySlug}` : '/api/products';
                const { data } = await axios.get(url);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [categorySlug]);

    const handleAddToCart = async (productId) => {
        if (!user) {
            // Handle case where user is not logged in
            alert('Please login to add items to your cart.');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                '/api/cart',
                { productoId: productId, cantidad: 1 },
                config
            );
            // Optionally, update cart context or show a success message
            console.log('Cart updated:', data);
            alert('Product added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart.');
        }
    };

    return (
        <div className="product-list">
            {products.map((product) => (
                <div key={product._id} className="product-card">
                    <Link to={`/product/${product._id}`}>
                        <img src={product.imagenes[0]} alt={product.nombre} />
                        <h3>{product.nombre}</h3>
                        <p>${product.precio}</p>
                    </Link>
                    <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
                </div>
            ))}
        </div>
    );
};

export default ProductList;