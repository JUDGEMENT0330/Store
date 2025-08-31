import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './ThemeSwitcher.css'; // We'll add some basic styling

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button onClick={toggleTheme} className="theme-switcher">
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
    );
};

export default ThemeSwitcher;