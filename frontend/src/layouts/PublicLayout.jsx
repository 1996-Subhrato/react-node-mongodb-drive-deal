import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useAuthStore from '../store/authStore';

const PublicLayout = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  return (
    <div className="public-layout">
      <Header key={isAuthenticated ? 'auth' : 'unauth'} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
