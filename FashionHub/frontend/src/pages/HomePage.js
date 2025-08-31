import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList/ProductList';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <header className="home-hero">
                <h1>Welcome to FashionHub</h1>
                <p>The latest trends in fashion, just a click away.</p>
                <Link to="/shop" className="hero-cta">Shop Now</Link>
            </header>
            <section className="featured-products">
                <h2>Featured Products</h2>
                <ProductList />
            </section>
        </div>
    );
};

export default HomePage;