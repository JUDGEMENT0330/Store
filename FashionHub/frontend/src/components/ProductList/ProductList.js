import React from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

const ProductList = ({ categorySlug }) => {
    const { products, loading, error } = useProducts();

    // TODO: Implement actual filtering based on categorySlug
    const filteredProducts = products;

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (filteredProducts.length === 0) {
        return <div>No se encontraron productos.</div>;
    }

    return (
        <div className="product-list">
            {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
