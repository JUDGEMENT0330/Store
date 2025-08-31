import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/'); // Redirect if already logged in
        }
    }, [user, navigate]);

    const handleLogin = async (email, password) => {
        try {
            await login(email, password);
        } catch (error) {
            alert(error); // Display error message
        }
    };

    const handleRegister = (email, password, name) => {
        // This will be implemented later, for now just a placeholder
        alert('Registration not yet implemented.');
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                {isLogin ? (
                    <LoginForm onLogin={handleLogin} />
                ) : (
                    <RegisterForm onRegister={handleRegister} />
                )}
                <button onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </button>
            </div>
        </div>
    );
};

// Placeholder for LoginForm
const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

// Placeholder for RegisterForm
const RegisterForm = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegister(email, password, name);
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default AuthPage;