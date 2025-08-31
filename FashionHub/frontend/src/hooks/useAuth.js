import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const { user, loading, isAdmin } = useContext(UserContext);
    const navigate = useNavigate();

    const isAuthenticated = () => {
        if (loading) return false; // Still loading, can't determine
        return !!user; // Returns true if user object exists
    };

    const requireAuth = (redirectPath = '/login') => {
        if (loading) return false; // Still loading
        if (!user) {
            navigate(redirectPath);
            return false;
        }
        return true;
    };

    const requireAdmin = (redirectPath = '/') => {
        if (loading) return false; // Still loading
        if (!user || !isAdmin) {
            navigate(redirectPath);
            return false;
        }
        return true;
    };

    return { isAuthenticated, requireAuth, requireAdmin, user, loading, isAdmin };
};

export default useAuth;