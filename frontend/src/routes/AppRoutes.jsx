import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { PageLoader } from '../components/ui/Loaders';

// Layouts
const MainLayout = lazy(() => import('../layouts/PublicLayout'));
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const SellerLayout = lazy(() => import('../layouts/SellerLayout'));
const UserLayout = lazy(() => import('../layouts/UserLayout'));

// Public Pages
const Home = lazy(() => import('../pages/Home'));
const Cars = lazy(() => import('../pages/Cars'));
const SingleCar = lazy(() => import('../pages/SingleCar'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Compare = lazy(() => import('../pages/Compare'));
const UserLogin = lazy(() => import('../pages/UserLogin'));
const UserSignup = lazy(() => import('../pages/UserSignup'));
const SellerLogin = lazy(() => import('../pages/SellerLogin'));
const SellerSignup = lazy(() => import('../pages/SellerSignup'));
const AdminLogin = lazy(() => import('../pages/AdminLogin'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ManageSellers = lazy(() => import('../pages/admin/ManageSellers'));
const ManageCategories = lazy(() => import('../pages/admin/ManageCategories'));
const ViewPurchaseRequests = lazy(() => import('../pages/admin/ViewPurchaseRequests'));

// Seller Pages
const SellerDashboard = lazy(() => import('../pages/seller/SellerDashboard'));
const SellerManageCars = lazy(() => import('../pages/seller/SellerManageCars'));
const SellerPurchaseRequests = lazy(() => import('../pages/seller/SellerPurchaseRequests'));
const SellerProfile = lazy(() => import('../pages/seller/SellerProfile'));
const SellerEditCar = lazy(() => import('../pages/seller/SellerEditCar'));

// User Pages
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));
const UserMyCars = lazy(() => import('../pages/user/UserMyCars'));
const UserProfile = lazy(() => import('../pages/user/UserProfile'));
const BookingSuccess = lazy(() => import('../pages/user/BookingSuccess'));

// Common
const ChangePassword = lazy(() => import('../pages/common/ChangePassword'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/cars" element={<Cars />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/single_car/:id" element={<SingleCar />} />
                    <Route path="/contact" element={<Contact />} />
                </Route>

                {/* Auth Routes (No Header/Footer) */}
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/user/signup" element={<UserSignup />} />
                <Route path="/seller/login" element={<SellerLogin />} />
                <Route path="/seller/signup" element={<SellerSignup />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="manage_sellers" element={<ManageSellers />} />
                    <Route path="manage_categories" element={<ManageCategories />} />
                    <Route path="view_purchase_requests" element={<ViewPurchaseRequests />} />
                    <Route path="change_password" element={<ChangePassword />} />
                </Route>

                {/* Seller Routes */}
                <Route path="/seller" element={<ProtectedRoute allowedRoles={['seller']}><SellerLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<SellerDashboard />} />
                    <Route path="manage_cars" element={<SellerManageCars />} />
                    <Route path="purchase_requests" element={<SellerPurchaseRequests />} />
                    <Route path="view_sold_cars" element={<SellerPurchaseRequests />} />
                    <Route path="profile" element={<SellerProfile />} />
                    <Route path="edit_car/:id" element={<SellerEditCar />} />
                    <Route path="change_password" element={<ChangePassword />} />
                </Route>

                {/* User Routes */}
                <Route path="/user" element={<ProtectedRoute allowedRoles={['user']}><UserLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="mypurchase_requests" element={<UserMyCars />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="purchase_success" element={<BookingSuccess />} />
                    <Route path="change_password" element={<ChangePassword />} />
                </Route>

                {/* Redirects */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/seller" element={<Navigate to="/seller/dashboard" replace />} />
                <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
