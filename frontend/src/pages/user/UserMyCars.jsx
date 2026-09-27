import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import carService from '../../services/carService';
import styles from './UserMyCars.module.css';

const UserMyCars = () => {
    const [purchaseRequests, setPurchaseRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [reviewData, setReviewData] = useState({ carId: '', rating: '5', feedback: '' });
    const [submitting, setSubmitting] = useState(false);

    const [selectedCar, setSelectedCar] = useState(null);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [showSellerOffcanvas, setShowSellerOffcanvas] = useState(false);
    const [categories, setCategories] = useState([]);

    const getImageUrl = (photo) => {
        if (!photo) return '/assets/img/cars/car_placeholder.png';
        if (photo.startsWith('http')) return photo;
        const cleanPath = photo.startsWith('/') ? photo : `/uploads/${photo}`;
        return `http://localhost:5000${cleanPath}`;
    };

    const fetchCategories = async () => {
        try {
            const response = await carService.getCategories();
            if (response.data.success) {
                setCategories(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const response = await carService.getUserPurchaseRequests();
            if (response.data.success) {
                setPurchaseRequests(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching purchase requests:", error);
            toast.error("Failed to load your purchase history");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
        fetchCategories();
    }, [fetchRequests]);

    const openInfo = (car) => {
        setSelectedCar(car);
        setShowOffcanvas(true);
    };

    const closeInfo = () => {
        setShowOffcanvas(false);
        setTimeout(() => setSelectedCar(null), 300);
    };

    const openSellerInfo = (seller) => {
        setSelectedSeller(seller);
        setShowSellerOffcanvas(true);
    };

    const closeSellerInfo = () => {
        setShowSellerOffcanvas(false);
        setTimeout(() => setSelectedSeller(null), 300);
    };

    const openReviewModal = (carId, existingReview = null) => {
        if (existingReview) {
            setReviewData({
                carId,
                rating: existingReview.rating.toString(),
                feedback: existingReview.feedback
            });
        } else {
            setReviewData({ carId, rating: '5', feedback: '' });
        }
        setShowModal(true);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const loadingToast = toast.loading("Processing your feedback...");
        try {
            const response = await carService.addReview(reviewData);
            if (response.data.success) {
                toast.success(response.data.message, { id: loadingToast });
                setShowModal(false);
                fetchRequests();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review", { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending': return styles.statusPending;
            case 'Approved': return styles.statusApproved;
            case 'Rejected': return styles.statusCancelled;
            case 'Sold': return styles.statusCompleted;
            default: return '';
        }
    };

    if (loading) return (
        <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p>Gathering your fleet data...</p>
        </div>
    );

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <header className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>My <span className={styles.gradientText}>Garage</span></h1>
                    <div className={styles.headerBadge}>
                        <i className="fas fa-car-side me-2"></i> {purchaseRequests.length} Active Orders
                    </div>
                </header>

                <div className={styles.grid}>
                    {purchaseRequests.length > 0 ? (
                        purchaseRequests.map((req) => (
                            <div key={req._id} className={styles.card}>
                                <div className={styles.imageWrapper}>

                                    {/* <button className={styles.infoBtn} onClick={() => openInfo(req.car)} title="Detailed View">
                                        <i className="fas fa-expand-alt"></i>
                                    </button> */}
                                    <div className={styles.cardOverlay}></div>
                                    <img
                                        src={getImageUrl(req.car?.photo)}
                                        alt={req.car?.name}
                                        className={styles.image}
                                    />
                                </div>

                                <div className={styles.content}>
                                    <div className={styles.carInfo}>
                                        <span className={styles.carBrand}>{req.car?.brand}</span>
                                        <h3 className={styles.carName}>{req.car?.name}</h3>
                                    </div>

                                    <div className={styles.dealStats}>
                                        <div className={styles.statItem}>
                                            <label>Order Date</label>
                                            <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <label>Quote</label>
                                            <span className={styles.priceHighlight}>₹{req.car?.price?.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className={styles.trackingSection}>
                                        <label className={styles.sectionLabel}>Request Progress</label>
                                        <div className={styles.tracker}>
                                            <div className={`${styles.trackerPoint} ${['Pending', 'Approved', 'Sold'].includes(req.status) ? styles.pointActive : ''}`}>
                                                <div className={styles.pointIcon}><i className="fas fa-paper-plane"></i></div>
                                                <span>Sent</span>
                                            </div>
                                            <div className={styles.trackerLine}>
                                                <div className={`${styles.lineFill} ${['Approved', 'Sold'].includes(req.status) ? styles.fillActive : ''}`}></div>
                                            </div>
                                            <div className={`${styles.trackerPoint} ${['Approved', 'Sold'].includes(req.status) ? styles.pointActive : ''}`}>
                                                <div className={styles.pointIcon}><i className="fas fa-check-circle"></i></div>
                                                <span>Approved</span>
                                            </div>
                                            <div className={styles.trackerLine}>
                                                <div className={`${styles.lineFill} ${req.status === 'Sold' ? styles.fillActive : ''}`}></div>
                                            </div>
                                            <div className={`${styles.trackerPoint} ${req.status === 'Sold' ? styles.pointActive : ''}`}>
                                                <div className={styles.pointIcon}><i className="fas fa-handshake"></i></div>
                                                <span>Deal Closed</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.footer}>
                                        <button className={`${styles.actionBtn} ${styles.secondaryBtn}`} onClick={() => openInfo(req.car)}>
                                            <i className="fas fa-info-circle"></i> Specs
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.sellerBtn}`}
                                            onClick={() => openSellerInfo(req.seller)}
                                        >
                                            <i className="fas fa-user-tie"></i> Seller
                                        </button>
                                        {req.status === 'Sold' && (
                                            <button
                                                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                                onClick={() => openReviewModal(req.car?._id, req.existingReview)}
                                            >
                                                <i className={req.existingReview ? "fas fa-edit" : "fas fa-star"}></i>
                                                {req.existingReview ? 'Edit Review' : 'Rate Deal'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <i className="fas fa-car-on"></i>
                            </div>
                            <h2 className="fw-bold mb-3">No Active Orders Found</h2>
                            <p className="text-muted mb-5 fs-5">Your dream car is waiting for you in our showroom. Start exploring today!</p>
                            <Link to="/cars" className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ maxWidth: '300px', margin: '0 auto' }}>
                                Explore Inventory <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                            <h3 className="mb-0">Rate Your Experience</h3>
                            <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleReviewSubmit} className={styles.modalBody}>
                            <div className={styles.ratingBox}>
                                {[1, 2, 3, 4, 5].map(v => (
                                    <button
                                        key={v}
                                        type="button"
                                        className={`${styles.starBtn} ${reviewData.rating >= v ? styles.starBtnActive : ''}`}
                                        onClick={() => setReviewData({ ...reviewData, rating: v.toString() })}
                                    >
                                        <i className="fas fa-star"></i>
                                    </button>
                                ))}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Detailed Feedback</label>
                                <textarea
                                    className={styles.textarea}
                                    rows="4"
                                    placeholder="Tell us about the transaction, car quality, and seller service..."
                                    value={reviewData.feedback}
                                    onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Post Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modern Offcanvas Detail View */}
            <div className={`${styles.offcanvasOverlay} ${showOffcanvas ? styles.overlayVisible : ''}`} onClick={closeInfo}></div>
            <div className={`${styles.offcanvas} ${showOffcanvas ? styles.offcanvasOpen : ''}`}>
                {selectedCar && (
                    <div className={styles.offcanvasContent}>
                        <div className={styles.offHeader}>
                            <div className={styles.offTitle}>
                                <h2>Technical Details</h2>
                                <p>{selectedCar.brand} {selectedCar.name}</p>
                            </div>
                            <button className={styles.offClose} onClick={closeInfo}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className={styles.offBody}>
                            <div className={styles.offImageCard}>
                                <img src={getImageUrl(selectedCar.photo)} alt={selectedCar.name} />
                                <div className={styles.priceFloating}>₹{selectedCar.price?.toLocaleString()}</div>
                            </div>

                            <div className={styles.specGrid}>
                                <div className={styles.specItem}>
                                    <div className={styles.specIcon}><i className="fas fa-calendar-alt"></i></div>
                                    <div className={styles.specText}>
                                        <label>Model Year</label>
                                        <span>{selectedCar.model}</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <div className={styles.specIcon}><i className="fas fa-gas-pump"></i></div>
                                    <div className={styles.specText}>
                                        <label>Fuel Type</label>
                                        <span>{selectedCar.fuelType}</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <div className={styles.specIcon}><i className="fas fa-cog"></i></div>
                                    <div className={styles.specText}>
                                        <label>Transmission</label>
                                        <span>{selectedCar.transmissionType}</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <div className={styles.specIcon}><i className="fas fa-microchip"></i></div>
                                    <div className={styles.specText}>
                                        <label>Engine</label>
                                        <span>{selectedCar.engineCapacity} cc</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <div className={styles.specIcon}><i className="fas fa-road"></i></div>
                                    <div className={styles.specText}>
                                        <label>KM Driven</label>
                                        <span>{selectedCar.kmDriven?.toLocaleString()} km</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <div className={styles.specIcon}><i className="fas fa-tag"></i></div>
                                    <div className={styles.specText}>
                                        <label>Category</label>
                                        <span>{categories.find(c => c._id == selectedCar.category)?.name || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.additionalInfo}>
                                <div className={styles.infoBlock}>
                                    <i className="fas fa-fingerprint"></i>
                                    <div>
                                        <label>Chassis Identification</label>
                                        <p>{selectedCar.chassisNumber}</p>
                                    </div>
                                </div>
                                <div className={styles.infoBlock}>
                                    <i className="fas fa-history"></i>
                                    <div>
                                        <label>Accidental History</label>
                                        <p>{selectedCar.accidentalHistory || 'No Reported Incidents'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Seller Info Offcanvas */}
                <div className={`${styles.offcanvasOverlay} ${showSellerOffcanvas ? styles.overlayVisible : ''}`} onClick={closeSellerInfo}></div>
                <div className={`${styles.offcanvas} ${showSellerOffcanvas ? styles.offcanvasOpen : ''}`}>
                    {selectedSeller && (
                        <div className={styles.offcanvasContent}>
                            <div className={styles.offHeader}>
                                <div className={styles.offTitle}>
                                    <h2>Seller Profile</h2>
                                    <p>Verified Dealership</p>
                                </div>
                                <button className={styles.offClose} onClick={closeSellerInfo}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className={styles.offBody}>
                                <div className={styles.sellerHero}>
                                    <div className={styles.sellerAvatar}>
                                        <img src={getImageUrl(selectedSeller.photo)} alt={selectedSeller.name} />
                                    </div>
                                    <h3 className={styles.sellerName}>{selectedSeller.name}</h3>
                                    <div className={styles.sellerLocation}>
                                        <i className="fas fa-map-marker-alt"></i> {selectedSeller.city}, {selectedSeller.address}
                                    </div>
                                </div>

                                <div className={styles.contactGrid}>
                                    <div className={styles.contactCard}>
                                        <div className={styles.contactIcon}><i className="fas fa-envelope"></i></div>
                                        <div className={styles.contactText}>
                                            <label>Email Address</label>
                                            <span>{selectedSeller.email}</span>
                                        </div>
                                        <a href={`mailto:${selectedSeller.email}`} className={styles.contactAction}>
                                            <i className="fas fa-paper-plane"></i>
                                        </a>
                                    </div>
                                    <div className={styles.contactCard}>
                                        <div className={styles.contactIcon}><i className="fas fa-phone-alt"></i></div>
                                        <div className={styles.contactText}>
                                            <label>Mobile Number</label>
                                            <span>{selectedSeller.mobile}</span>
                                        </div>
                                        <a href={`tel:${selectedSeller.mobile}`} className={styles.contactAction}>
                                            <i className="fas fa-phone-alt"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className={styles.sellerBadges}>
                                    <div className={styles.badgeItem}>
                                        <i className="fas fa-shield-check"></i>
                                        <span>Verified Identity</span>
                                    </div>
                                    {/* <div className={styles.badgeItem}>
                                        <i className="fas fa-award"></i>
                                        <span>Top Rated Seller</span>
                                    </div> */}
                                    {/* <div className={styles.badgeItem}>
                                        <i className="fas fa-history"></i>
                                        <span>5+ Years Active</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserMyCars;
