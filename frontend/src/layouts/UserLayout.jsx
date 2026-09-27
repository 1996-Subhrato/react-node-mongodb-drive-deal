import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserHeader from '../components/UserHeader';
import UserSidebar from '../components/UserSidebar';
import Footer from '../components/Footer';

const UserLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', overflow: 'hidden' }}>
      <UserSidebar />
      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <UserHeader />
        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
