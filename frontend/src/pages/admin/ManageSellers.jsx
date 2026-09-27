import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import styles from './AdminShared.module.css';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Offcanvas from '../../components/ui/Offcanvas';
import { toast } from 'react-hot-toast';

const ManageSellers = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [currentSeller, setCurrentSeller] = useState(null);
    const [isStatusLoading, setIsStatusLoading] = useState(false);


    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getSellers();
            if (response.data.success) {
                setSellers(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch sellers:', error);
            toast.error("Failed to fetch sellers");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        try {
            setIsStatusLoading(true);
            const response = await adminService.updateSellerStatus(id, newStatus);
            if (response.data.success) {
                setSellers(sellers.map(s =>
                    s._id === id ? { ...s, status: newStatus } : s
                ));
                if (currentSeller && currentSeller._id === id) {
                    setCurrentSeller({ ...currentSeller, status: newStatus });
                }
                toast.success(`Seller ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setIsStatusLoading(false);
        }
    };

    const handleDeleteClick = (seller) => {
        setCurrentSeller(seller);
        setIsDeleteModalOpen(true);
    };

    const handleViewDetails = (seller) => {
        setCurrentSeller(seller);
        setIsDetailsOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await adminService.deleteSeller(currentSeller._id);
            if (response.data.success) {
                setSellers(sellers.filter(s => s._id !== currentSeller._id));
                toast.success("Seller deleted successfully");
                setIsDetailsOpen(false);
            }
        } catch (error) {
            toast.error("Failed to delete seller");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return `${styles.statusBadge} ${styles.statusActive}`;
            case 'Inactive': return `${styles.statusBadge} ${styles.statusInactive}`;
            case 'Pending': return `${styles.statusBadge} ${styles.statusPending}`;
            default: return styles.statusBadge;
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className={styles.title}>Seller Management</h2>
                    <p className={styles.welcomeText} style={{ fontSize: '0.95rem' }}>Review and manage marketplace sellers and their listings.</p>
                </div>
                <div className={styles.statsBadge}>
                    <i className="fas fa-users"></i>
                    <span className='text-white'>Total Sellers: <strong>{sellers.length}</strong></span>
                </div>
            </div>

            {sellers.length > 0 ? (
                <div className={styles.grid}>
                    {sellers.map((seller) => (
                        <div key={seller._id} className={styles.gridCard}>
                            <div className={styles.gridCardImgWrapper}>
                                <img
                                    src={seller.photo?.startsWith('http') ? seller.photo : `http://localhost:5000${seller.photo}`}
                                    alt={seller.name}
                                    className={styles.gridCardImg}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Seller'}
                                />
                                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                    <span className={getStatusStyle(seller.status)}>
                                        {seller.status}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.gridCardBody}>
                                <h4 className={styles.gridCardTitle}>{seller.name}</h4>
                                <p className="mb-4 text-truncate" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                    <i className="fa-solid fa-envelope me-2 text-info"></i> {seller.email}
                                </p>

                                <div className="d-flex gap-2">
                                    <button
                                        className={styles.btnPrimary}
                                        style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                                        onClick={() => handleViewDetails(seller)}
                                    >
                                        <i className="fas fa-info-circle"></i> View Profile
                                    </button>
                                    <button
                                        className={styles.btnDanger}
                                        style={{ flex: '0 0 45px', padding: '0.6rem' }}
                                        onClick={() => handleDeleteClick(seller)}
                                        title="Delete Seller"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <p className="text-muted fs-5">No sellers registered yet.</p>
                </div>
            )}

            {/* Seller Details Offcanvas */}
            <Offcanvas
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Seller Portfolio"
            >
                {currentSeller && (
                    <div className="dealer-profile-saas">
                        {/* Profile Overview Header */}
                        <div className="text-center pb-5 pt-2">
                            <div className="position-relative d-inline-block mb-4">
                                <div className="rounded-circle overflow-hidden border border-4 border-info shadow-lg" style={{ width: '130px', height: '130px' }}>
                                    <img
                                        src={currentSeller.photo?.startsWith('http') ? currentSeller.photo : `http://localhost:5000${currentSeller.photo}`}
                                        alt={currentSeller.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/130x130?text=Seller'}
                                    />
                                </div>
                            </div>
                            <h3 className="fw-800 mb-2" style={{ color: '#f8fafc', letterSpacing: '-0.5px' }}>{currentSeller.name}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }} className="mb-3">
                                <i className="fas fa-calendar-alt me-2 text-info"></i>
                                Partnered {new Date(currentSeller.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                            <div className="mb-1">
                                <span className={getStatusStyle(currentSeller.status)}>
                                    {currentSeller.status}
                                </span>
                            </div>
                        </div>

                        {/* Information Sections */}
                        <div className="saas-section mb-4 p-4 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <h6 className="text-uppercase fw-800 mb-4" style={{ fontSize: '0.75rem', color: '#f59e0b', letterSpacing: '0.15em' }}>Identity & Verification</h6>

                            <div className="d-flex align-items-start mb-4">
                                <div className="bg-white p-2 rounded-3 shadow-sm me-3 border border-light" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-id-card text-warning"></i>
                                </div>
                                <div>
                                    <label className="d-block text-muted small fw-bold mb-1">Aadhaar Number</label>
                                    <p className="fw-bold mb-0" style={{ fontSize: '1rem', color: '#0f172a' }}>{currentSeller.adhar_card}</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-start">
                                <div className="bg-white p-2 rounded-3 shadow-sm me-3 border border-light" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-user-check text-warning"></i>
                                </div>
                                <div>
                                    <label className="d-block text-muted small fw-bold mb-1">Verification Status</label>
                                    <p className="fw-bold mb-0 text-success">Verified Partner</p>
                                </div>
                            </div>
                        </div>

                        <div className="saas-section mb-5 p-4 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <h6 className="text-uppercase fw-800 mb-4" style={{ fontSize: '0.75rem', color: '#f59e0b', letterSpacing: '0.15em' }}>Business Contact</h6>

                            <div className="d-flex align-items-start mb-4">
                                <div className="bg-white p-2 rounded-3 shadow-sm me-3 border border-light" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-envelope text-warning"></i>
                                </div>
                                <div className="overflow-hidden">
                                    <label className="d-block text-muted small fw-bold mb-1">Business Email</label>
                                    <p className="fw-bold mb-0 text-truncate" title={currentSeller.email} style={{ color: '#0f172a' }}>{currentSeller.email}</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-start mb-4">
                                <div className="bg-white p-2 rounded-3 shadow-sm me-3 border border-light" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-phone-alt text-warning"></i>
                                </div>
                                <div>
                                    <label className="d-block text-muted small fw-bold mb-1">Mobile Phone</label>
                                    <p className="fw-bold mb-0" style={{ color: '#0f172a' }}>{currentSeller.mobile}</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-start">
                                <div className="bg-white p-2 rounded-3 shadow-sm me-3 border border-light" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-map-marker-alt text-warning"></i>
                                </div>
                                <div>
                                    <label className="d-block text-muted small fw-bold mb-1">Operating City</label>
                                    <p className="fw-bold mb-0" style={{ color: '#0f172a' }}>{currentSeller.city}</p>
                                </div>
                            </div>
                        </div>


                        {/* Action Buttons */}
                        <div className="pt-2">
                            <button
                                className="btn w-100 mb-3 py-3 rounded-4 d-flex align-items-center justify-content-center gap-3"
                                style={{
                                    backgroundColor: currentSeller.status === 'Active' ? '#fff1f2' : '#f0fdf4',
                                    color: currentSeller.status === 'Active' ? '#e11d48' : '#16a34a',
                                    border: `1px solid ${currentSeller.status === 'Active' ? '#fecaca' : '#bcf1d2'}`,
                                    fontWeight: '700',
                                    opacity: isStatusLoading ? 0.7 : 1,
                                    cursor: isStatusLoading ? 'not-allowed' : 'pointer'
                                }}
                                onClick={() => toggleStatus(currentSeller._id, currentSeller.status)}
                                disabled={isStatusLoading}
                            >
                                {isStatusLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className={`fas ${currentSeller.status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                                        {currentSeller.status === 'Active' ? 'Suspend Seller Account' : 'Approve Seller Account'}
                                    </>
                                )}
                            </button>

                            <button
                                className="btn w-100 py-3 rounded-4 d-flex align-items-center justify-content-center gap-3"
                                style={{
                                    backgroundColor: '#f8fafc',
                                    color: '#64748b',
                                    border: '1px solid #e2e8f0',
                                    fontWeight: '700'
                                }}
                                onClick={() => handleDeleteClick(currentSeller)}
                            >
                                <i className="fas fa-trash-alt"></i>
                                Terminate Partnership
                            </button>
                        </div>
                    </div>
                )}
            </Offcanvas>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Seller"
                message={`Are you sure you want to delete "${currentSeller?.name}"? This will remove all their data from the platform.`}
                confirmText="Delete"
                cancelText="Cancel"
                icon="fas fa-user-minus"
            />
        </div>
    );
};

export default ManageSellers;
