import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async (categorySlug = '') => {
        try {
            setLoading(true);
            let url = '/products';
            if (categorySlug) {
                // This requires the backend to support filtering by category slug
                // Let's assume for now the category endpoint can give us the ID
                // Or that the product endpoint can be filtered by slug
                // For now, let's just get all products and filter on the client
                // A better implementation would be server-side filtering
                console.warn("Filtering by category slug is not fully implemented on the backend yet.");
            }
            const res = await api.get(url);
            setProducts(res.data);
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, loading, error, fetchProducts }}>
            {children}
        </ProductContext.Provider>
    );
};
