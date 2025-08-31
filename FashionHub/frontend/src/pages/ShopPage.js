import React from 'react';
// We will later add components to list products
// import ProductList from '../components/ProductList/ProductList';

const ShopPage = () => {
    // We can get the category slug from the URL params
    // const { categorySlug } = useParams();

    return (
        <div>
            <h1>Shop</h1>
            <p>Browse our collection of products.</p>
            {/* <ProductList categorySlug={categorySlug} /> */}
        </div>
    );
};

export default ShopPage;