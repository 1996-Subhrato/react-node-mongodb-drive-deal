import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { PageLoader } from './ui/Loaders';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Determine which verification API to call based on the path or allowedRoles
        let response;
        if (location.pathname.startsWith('/admin') || allowedRoles.includes('admin')) {
          response = await authService.checkAdminToken();
        } else if (location.pathname.startsWith('/seller') || allowedRoles.includes('seller')) {
          response = await authService.checkSellerToken();
        } else {
          response = await authService.checkUserToken();
        }

        if (response.data.success) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (error) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [location.pathname, allowedRoles]);

  if (loading) {
    return <PageLoader />;
  }

  if (!authorized) {
    const loginPath = location.pathname.startsWith('/admin') ? '/admin/login' :
                      location.pathname.startsWith('/seller') ? '/seller/login' :
                      '/user/login';
    
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }


  return children;
};

export default ProtectedRoute;
