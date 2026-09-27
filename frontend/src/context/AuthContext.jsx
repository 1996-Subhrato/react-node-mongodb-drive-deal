import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { user, role, isAuthenticated, setAuth, clearAuth } = useAuthStore();
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async () => {
        try {
            if (role === 'admin') await authService.adminLogout();
            else if (role === 'seller') await authService.sellerLogout();
            else await authService.userLogout();
            
            clearAuth();
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout failed:', error);
            clearAuth(); // Clear anyway
        }
    }, [role, clearAuth]);

    const checkSession = useCallback(async () => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        try {
            let response;
            if (role === 'admin') {
                response = await authService.checkAdminToken();
            } else if (role === 'seller') {
                response = await authService.checkSellerToken();
            } else {
                response = await authService.checkUserToken();
            }

            if (!response?.data?.success) {
                clearAuth();
            }
        } catch (error) {
            console.error('Session check failed:', error);
            // Only clear auth if it's an authentication error (401/403)
            if (error.response?.status === 401 || error.response?.status === 403) {
                clearAuth();
            }
        } finally {
            setLoading(false);
        }
    }, [role, isAuthenticated, clearAuth]);

    useEffect(() => {
        if (isAuthenticated) {
            checkSession();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, checkSession]);

    // Enhanced login helper
    const handleLogin = async (loginPromise, roleType) => {
        try {
            const response = await loginPromise;
            if (response.data.success) {
                const { token } = response.data.data;
                const decoded = jwtDecode(token);
                
                // Ensure user object has role property (some payloads use 'type' or nothing)
                const userWithRole = { 
                    ...decoded, 
                    role: decoded.role || decoded.type || roleType 
                };
                
                // Store in Zustand (persisted in localStorage)
                setAuth(userWithRole, roleType, token);
                
                toast.success('Login successful!');
                return { success: true };
            }
        } catch (error) {
            // Error handled by interceptor
            return { success: false, error };
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            role, 
            isAuthenticated, 
            loading, 
            login: handleLogin, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
