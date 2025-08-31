import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryMenu.css';

const CategoryMenu = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <nav className="category-nav">
            <ul>
                {categories.map(category => (
                    <li key={category._id}>
                        <a href={`/shop/${category.slug}`}>{category.nombre}</a>
                        {/* We can add logic here for sub-menus if category.children exists */}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default CategoryMenu;