import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import carService from '../../services/carService';
import styles from './SellerPurchaseRequests.module.css';
import { toast } from 'react-hot-toast';

const SellerPurchaseRequests = () => {
    const [carsWithRequests, setCarsWithRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCar, setSelectedCar] = useState(null);
    const [showRequestsOffcanvas, setShowRequestsOffcanvas] = useState(false);
    const location = useLocation();

    const isSoldView = location.pathname.includes('view_sold_cars');

    useEffect(() => {
        fetchData();
    }, [location.pathname]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = isSoldView ? { status: 'Sold' } : {};
            const response = await carService.getCarsWithRequests(params);
            if (response.data.success) {
                setCarsWithRequests(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, newStatus, carId) => {
        const loadingToast = toast.loading(`Updating status...`);
        try {
            const response = await carService.updateRequestStatus(requestId, newStatus);
            if (response.data.success) {
                toast.success(`Request marked as ${newStatus}!`, { id: loadingToast });
                
                // Fetch fresh data and get the updated car object
                const freshResponse = await carService.getCarsWithRequests();
                if (freshResponse.data.success) {
                    const freshData = freshResponse.data.data || [];
                    setCarsWithRequests(freshData);
                    
                    // Update the currently viewed car in offcanvas
                    if (selectedCar && selectedCar._id === carId) {
                        const updatedCar = freshData.find(c => c._id === carId);
                        if (updatedCar) setSelectedCar(updatedCar);
                    }
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed", { id: loadingToast });
        }
    };

    const getImageUrl = (photo) => {
        if (!photo) return '/assets/img/cars/car_placeholder.png';
        if (photo.startsWith('http')) return photo;
        const cleanPath = photo.startsWith('/') ? photo : `/uploads/${photo}`;
        return `http://localhost:5000${cleanPath}`;
    };

    const openRequests = (car) => {
        setSelectedCar(car);
        setShowRequestsOffcanvas(true);
    };

    if (loading) return (
        <div className={styles.pageContainer}>
            <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="mt-3 text-muted">Loading purchase insights...</p>
            </div>
        </div>
    );

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>{isSoldView ? 'Sold Inventory' : 'Purchase Inquiries'}</h1>
                    <p>
                        {isSoldView 
                            ? 'History of vehicles successfully sold to buyers' 
                            : 'Manage multiple buyer interests per vehicle and finalize deals'
                        }
                    </p>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableResponsive}>
                    <table className={styles.mainTable}>
                        <thead>
                            <tr>
                                <th>Vehicle</th>
                                <th>Category</th>
                                <th>Status</th>
                                {isSoldView ? <th>Buyer Review</th> : <th>Inquiries</th>}
                                <th>{isSoldView ? 'Sold Date' : 'Last Inquiry'}</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carsWithRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={styles.emptyRow}>
                                        <div className={styles.emptyState}>
                                            <i className={isSoldView ? "fas fa-check-circle" : "fas fa-hand-holding-usd"}></i>
                                            <h3>{isSoldView ? 'No sold vehicles yet' : 'No active inquiries'}</h3>
                                            <p>
                                                {isSoldView 
                                                    ? 'Your successfully closed deals will appear here.' 
                                                    : 'When buyers express interest in your cars, they will appear here.'
                                                }
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                carsWithRequests.map(car => (
                                    <tr key={car._id} className={styles.carRow}>
                                        <td>
                                            <div className={styles.carCell}>
                                                <img src={getImageUrl(car.photo)} alt="car" className={styles.carThumb} />
                                                <div className={styles.carDetails}>
                                                    <span className={styles.carTitle}>{car.brand} {car.name}</span>
                                                    <span className={styles.carPrice}>₹ {car.price?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={styles.categoryBadge}>{car.category?.name || 'Standard'}</span>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles['status' + car.status]}`}>
                                                {car.status}
                                            </span>
                                        </td>
                                        <td>
                                            {isSoldView ? (
                                                car.review ? (
                                                    <div className={styles.reviewCell}>
                                                        <div className={styles.ratingStars}>
                                                            {[...Array(5)].map((_, i) => (
                                                                <i key={i} className={`fas fa-star ${i < car.review.rating ? styles.starFilled : styles.starEmpty}`}></i>
                                                            ))}
                                                        </div>
                                                        <p className={styles.reviewText} title={car.review.feedback}>
                                                            {car.review.feedback.length > 30 ? car.review.feedback.substring(0, 30) + '...' : car.review.feedback}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className={styles.noReview}>No review yet</span>
                                                )
                                            ) : (
                                                <div className={styles.inquiryCount}>
                                                    <i className="fas fa-users me-2"></i>
                                                    {car.purchaseRequests.length}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {isSoldView ? 
                                                (car.updatedAt ? new Date(car.updatedAt).toLocaleDateString() : 'N/A') :
                                                (car.purchaseRequests.length > 0 ? new Date(car.purchaseRequests[0].createdAt).toLocaleDateString() : 'N/A')
                                            }
                                        </td>
                                        <td className="text-end">
                                            <button 
                                                className={styles.btnViewRequests}
                                                onClick={() => openRequests(car)}
                                            >
                                                View All Requests
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Requests Offcanvas */}
            <div className={`${styles.offcanvasOverlay} ${showRequestsOffcanvas ? styles.overlayVisible : ''}`} onClick={() => setShowRequestsOffcanvas(false)}></div>
            <div className={`${styles.offcanvas} ${showRequestsOffcanvas ? styles.offcanvasOpen : ''}`}>
                {selectedCar && (
                    <div className={styles.offcanvasContent}>
                        <div className={styles.offcanvasHeader}>
                            <div>
                                <h2>Buyer Inquiries</h2>
                                <p className="text-muted mb-0">{selectedCar.brand} {selectedCar.name}</p>
                            </div>
                            <button className={styles.btnClose} onClick={() => setShowRequestsOffcanvas(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className={styles.offcanvasBody}>
                            {selectedCar.purchaseRequests.length === 0 ? (
                                <p>No requests found for this car.</p>
                            ) : (
                                <div className={styles.requestsList}>
                                    {selectedCar.purchaseRequests.map(req => (
                                        <div key={req._id} className={`${styles.requestCard} ${req.status === 'Approved' ? styles.approvedCard : ''}`}>
                                            <div className={styles.requestHeader}>
                                                <div className={styles.buyerInfo}>
                                                    <div className={styles.buyerAvatar}>
                                                        {req.customer?.first_name?.[0]}{req.customer?.last_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <h4>{req.customer?.first_name} {req.customer?.last_name}</h4>
                                                        <span className={styles.requestDate}>
                                                            Requested on {new Date(req.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`${styles.reqStatusBadge} ${styles['req' + req.status]}`}>
                                                    {req.status}
                                                </span>
                                            </div>

                                            <div className={styles.requestContact}>
                                                <div className={styles.contactItem}>
                                                    <i className="fas fa-envelope"></i>
                                                    {req.customer?.email}
                                                </div>
                                                <div className={styles.contactItem}>
                                                    <i className="fas fa-phone"></i>
                                                    {req.customer?.mobile}
                                                </div>
                                            </div>

                                            <div className={styles.requestActions}>
                                                {req.status === 'Pending' && selectedCar.status !== 'Approved' && selectedCar.status !== 'Sold' && (
                                                    <button 
                                                        className={styles.btnApprove}
                                                        onClick={() => handleAction(req._id, 'Approved', selectedCar._id)}
                                                    >
                                                        <i className="fas fa-check me-2"></i> Approve Request
                                                    </button>
                                                )}

                                                {req.status === 'Approved' && (
                                                    <div className={styles.approvedActions}>
                                                        <button 
                                                            className={styles.btnSold}
                                                            onClick={() => handleAction(req._id, 'Sold', selectedCar._id)}
                                                        >
                                                            <i className="fas fa-handshake me-2"></i> Close Deal (Sold)
                                                        </button>
                                                        <button 
                                                            className={styles.btnCancel}
                                                            onClick={() => handleAction(req._id, 'Pending', selectedCar._id)}
                                                        >
                                                            Cancel Approval
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                {req.status === 'Sold' && (
                                                    <div className={styles.soldSuccess}>
                                                        <i className="fas fa-check-double me-2"></i> Deal Closed Successfully
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerPurchaseRequests;
