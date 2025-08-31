import React, { useState } from 'react';
import ProductManager from '../../admin/ProductManager';
import CategoryManager from '../../admin/CategoryManager';
import OrderViewer from '../../admin/OrderViewer'; // Import OrderViewer
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products'); // 'products', 'categories', 'orders'

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <ProductManager />;
            case 'categories':
                return <CategoryManager />;
            case 'orders':
                return <OrderViewer />; // Use OrderViewer
            default:
                return <ProductManager />;
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <nav className="admin-nav">
                <button onClick={() => setActiveTab('products')} className={activeTab === 'products' ? 'active' : ''}>Products</button>
                <button onClick={() => setActiveTab('categories')} className={activeTab === 'categories' ? 'active' : ''}>Categories</button>
                <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>Orders</button>
            </nav>
            <div className="admin-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;