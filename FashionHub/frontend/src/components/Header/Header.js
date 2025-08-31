import React, { useState } from 'react';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import CategoryMenu from '../CategoryMenu/CategoryMenu';
import CartIcon from '../CartIcon/CartIcon';
import CartDropdown from '../CartDropdown/CartDropdown';
import './Header.css';

const Header = () => {
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);

    const toggleCartDropdown = () => {
        setIsCartDropdownOpen(!isCartDropdownOpen);
    };

    return (
        <header className="app-header">
            <div className="logo">
                <a href="/">FashionHub</a>
            </div>
            <nav className="main-nav">
                <CategoryMenu />
            </nav>
            <div className="header-actions">
                <ThemeSwitcher />
                <CartIcon onClick={toggleCartDropdown} />
            </div>
            {isCartDropdownOpen && <CartDropdown />}
        </header>
    );
};

export default Header;