import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from '../components/ProductList/ProductList';
import CategoryMenu from '../components/CategoryMenu/CategoryMenu';

const ShopPage = () => {
    const { categorySlug } = useParams();

    return (
        <div className="shop-page">
            <div className="category-menu-container">
                <CategoryMenu />
            </div>
            <div className="product-list-container">
                <h1>Shop</h1>
                <p>Browse our collection of products.</p>
                <ProductList categorySlug={categorySlug} />
            </div>
        </div>
    );
};

export default ShopPage;