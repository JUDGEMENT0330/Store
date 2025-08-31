import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:categorySlug" element={<ShopPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;