import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from '../components/ProductList/ProductList';
import './ShopPage.css';

const ShopPage = () => {
    const { categorySlug } = useParams();

    return (
        <div className="shop-page">
            <header className="shop-header">
                <h1>{categorySlug ? `Categoría: ${categorySlug}` : 'Tienda'}</h1>
                <p>Explora nuestra colección.</p>
            </header>
            <main className="shop-main">
                <ProductList categorySlug={categorySlug} />
            </main>
        </div>
    );
};

export default ShopPage;