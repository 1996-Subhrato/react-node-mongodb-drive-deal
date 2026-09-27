import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from '../components/SellerSidebar';
import SellerHeader from '../components/SellerHeader';


const SellerLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <SellerSidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '280px' }}>
                <SellerHeader />
                <main style={{ 
                    flex: 1, 
                    padding: '2.5rem',
                    backgroundColor: '#f8fafc',
                    minHeight: 'calc(100vh - 70px)'
                }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;
