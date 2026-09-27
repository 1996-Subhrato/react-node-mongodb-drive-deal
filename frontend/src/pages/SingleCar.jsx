import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import carService from '../services/carService';
import { toast } from 'react-hot-toast';
import styles from './SingleCar.module.css';

const SingleCar = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Purchase Request States
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isRequested, setIsRequested] = useState(false);

    const getImageUrl = (photo) => {
        if (!photo) return '/assets/img/cars/car_placeholder.png';
        if (photo.startsWith('http')) return photo;
        const cleanPath = photo.startsWith('/') ? photo : `/uploads/${photo}`;
        return `http://localhost:5000${cleanPath}`;
    };

    const fetchCar = useCallback(async () => {
        try {
            setLoading(true);
            const response = await carService.getSingleCar(id);
            if (response.data.success) {
                setCar(response.data.data);
            } else {
                setError('Vehicle not found');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch car details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    const checkRequestStatus = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const response = await carService.checkPurchaseRequest(id);
            if (response.data.success) {
                setIsRequested(response.data.requested);
            }
        } catch (error) {
            console.error("Failed to check request status:", error);
        }
    }, [id, isAuthenticated]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCar();
        checkRequestStatus();
    }, [fetchCar, checkRequestStatus]);

    const handleOpenRequest = () => {
        if (!isAuthenticated) {
            toast.error("Please login to send a purchase request");
            navigate('/user/login', { state: { from: `/single_car/${id}` } });
            return;
        }
        
        if (isRequested) {
            toast.error("You have already sent a purchase request for this vehicle");
            return;
        }

        setShowRequestModal(true);
    };

    const submitPurchaseRequest = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const loadingToast = toast.loading('Sending your request to seller...');
        try {
            const requestData = {
                car: car._id,
                seller: car.seller?._id || car.seller
            };

            const res = await carService.addPurchaseRequest(requestData);
            if (res.data.success) {
                toast.success("Purchase request sent successfully!", { id: loadingToast });
                setShowRequestModal(false);
                navigate('/user/mypurchase_requests');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send request", { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p>Gathering specifications...</p>
        </div>
    );

    if (error) return (
        <div className={styles.errorWrapper}>
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/cars')} className={styles.backBtn}>Browse Other Cars</button>
        </div>
    );

    if (!car) return null;

    const specs = [
        { label: 'Year/Model', value: car.model, icon: 'fa-calendar-alt' },
        { label: 'Fuel Type', value: car.fuelType, icon: 'fa-gas-pump' },
        { label: 'Transmission', value: car.transmissionType, icon: 'fa-cog' },
        { label: 'Engine', value: `${car.engineCapacity} cc`, icon: 'fa-microchip' },
        { label: 'Kilometers', value: `${car.kmDriven?.toLocaleString()} km`, icon: 'fa-road' },
        { label: 'Mileage', value: `${car.mileage} km/l`, icon: 'fa-tachometer-alt' },
        { label: 'Owners', value: car.ownerType, icon: 'fa-user-friends' },
        { label: 'Category', value: car.category?.name || 'Standard', icon: 'fa-tag' },
    ];

    return (
        <div className={styles.pageContainer}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroGlow}></div>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <span className={styles.badge}>{car.category?.name || 'Premium Selection'}</span>
                        <h1 className={styles.heroTitle}>
                            {car.brand} <br />
                            <span className={styles.gradientText}>{car.name}</span>
                        </h1>
                        <p className={styles.heroDesc}>
                            Own this masterpiece today. Verified quality and transparent history at Drive Deal.
                        </p>
                        <div className={styles.breadcrumb}>
                            <Link to="/">Home</Link>
                            <i className="fas fa-chevron-right"></i>
                            <Link to="/cars">Inventory</Link>
                            <i className="fas fa-chevron-right"></i>
                            <span>{car.name}</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className={styles.mainContent}>
                <div className={styles.topSection}>
                    {/* Visual Area */}
                    <div className={styles.visualColumn}>
                        <div className={styles.imageCard}>
                            <img src={getImageUrl(car.photo)} alt={car.name} className={styles.mainImage} />
                            <div className={styles.statusBadge}>{car.status}</div>
                            <div className={styles.priceFloating}>
                                <span>Selling Price</span>
                                <h3>₹{car.price?.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats & CTA */}
                    <div className={styles.ctaColumn}>
                        <div className={styles.ctaGlassCard}>
                            <div className={styles.ctaHeader}>
                                <span className={styles.miniLabel}>Exclusive Deal</span>
                                <h2>Interested in this car?</h2>
                                <p>Send a purchase request to the seller to express your interest. They will contact you shortly.</p>
                            </div>

                            <div className={styles.ctaActions}>
                                <button 
                                    className={`${styles.mainBookBtn} ${isRequested ? styles.requestedBtn : ''}`} 
                                    onClick={handleOpenRequest}
                                    disabled={car.status === 'Sold' || isRequested}
                                >
                                    <i className={isRequested ? "fas fa-check-double" : "fas fa-hand-holding-usd"}></i>
                                    {car.status === 'Sold' ? 'Vehicle Sold' : isRequested ? 'Request Sent' : 'Send Purchase Request'}
                                </button>
                                <div className={styles.secureBadge}>
                                    <i className="fas fa-shield-check"></i>
                                    Verified Listing
                                </div>
                            </div>

                            <div className={styles.quickFeatures}>
                                <div className={styles.qfItem}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>Direct Seller Contact</span>
                                </div>
                                <div className={styles.qfItem}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>Full Inspection Report</span>
                                </div>
                                <div className={styles.qfItem}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>Paperwork Assistance</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Specifications */}
                <section className={styles.detailsSection}>
                    <div className={styles.sectionHeading}>
                        <i className="fas fa-list-ul"></i>
                        <h2>Vehicle Specifications</h2>
                    </div>
                    <div className={styles.specsGrid}>
                        {specs.map((spec, index) => (
                            <div key={index} className={styles.specTile}>
                                <div className={styles.tileIcon}>
                                    <i className={`fas ${spec.icon}`}></i>
                                </div>
                                <div className={styles.tileContent}>
                                    <span className={styles.tileLabel}>{spec.label}</span>
                                    <span className={styles.tileValue}>{spec.value || 'N/A'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Seller Info */}
                <section className={styles.dealerSection}>
                    <div className={styles.dealerGlass}>
                        <div className={styles.dealerInfo}>
                            <span className={styles.verifiedBadge}>
                                <i className="fas fa-check-circle"></i> Verified Seller
                            </span>
                            <h2 className={styles.dealerName}>{car.seller?.name}</h2>
                            <p className={styles.dealerBio}>
                                Trusted Drive Deal partner offering verified vehicles with detailed maintenance history.
                            </p>
                        </div>
                        <div className={styles.dealerContact}>
                            <div className={styles.contactChip}>
                                <i className="fas fa-envelope"></i>
                                {car.seller?.email}
                            </div>
                            <div className={styles.contactChip}>
                                <i className="fas fa-phone"></i>
                                {car.seller?.mobile}
                            </div>
                            <div className={styles.contactChip}>
                                <i className="fas fa-map-marker-alt"></i>
                                {car.seller?.address}, {car.seller?.city}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Purchase Request Modal */}
            {showRequestModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitleArea}>
                                <h3>Purchase Request</h3>
                                <p>{car.brand} {car.name}</p>
                            </div>
                            <button className={styles.closeModal} onClick={() => setShowRequestModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={submitPurchaseRequest} className={styles.bookingForm}>
                            <div className={styles.modalBody}>
                                <p className="text-muted mb-4">
                                    By clicking below, you are sending a formal purchase interest to the seller. 
                                    They will be notified of your contact details and will reach out to you.
                                </p>
                                <div className={styles.invoiceSummary}>
                                    <div className={styles.invoiceRow}>
                                        <span>Listed Price</span>
                                        <span>₹{car.price?.toLocaleString()}</span>
                                    </div>
                                    <div className={styles.invoiceTotal}>
                                        <span>Total</span>
                                        <span>₹{car.price?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="submit" className={styles.finalizeBtn} disabled={submitting}>
                                    {submitting ? 'Sending...' : 'Confirm Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleCar;
