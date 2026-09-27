import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';
import Footer from '../components/Footer';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  return (
    <div className={`${styles.adminLayout} admin-theme`}>
      <div className={styles.meshGradient}></div>
      <div className={styles.glassCircle1}></div>
      <div className={styles.glassCircle2}></div>
      
      <AdminSidebar />
      <div className={styles.layoutContent}>
        <AdminHeader />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
