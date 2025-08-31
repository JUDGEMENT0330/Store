import React from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import CategoryMenu from '../CategoryMenu/CategoryMenu';
import CartIcon from '../CartIcon/CartIcon';
import './Header.css';

const Header = () => {
    return (
        <header className="app-header">
            <div className="logo">
                <Link to="/">FashionHub</Link>
            </div>
            <nav className="main-nav">
                <CategoryMenu />
            </nav>
            <div className="header-actions">
                <ThemeSwitcher />
                <CartIcon />
            </div>
        </header>
    );
};

export default Header;