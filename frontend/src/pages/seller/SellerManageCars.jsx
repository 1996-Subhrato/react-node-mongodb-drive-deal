import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import carService from '../../services/carService';
import styles from './SellerManageCars.module.css';

const SellerManageCars = () => {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const {
        register,
        handleSubmit,
        trigger,
        reset,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        shouldUnregister: false,
        defaultValues: {
            fuelType: 'Petrol',
            transmissionType: 'Manual',
            ownerType: 'First Owner',
            accidentalHistory: 'No'
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const getImageUrl = (photo) => {
        if (!photo) return '/assets/img/cars/car_placeholder.png';
        if (photo.startsWith('http')) return photo;
        if (photo.startsWith('/')) return `http://localhost:5000${photo}`;
        return `http://localhost:5000/uploads/${photo}`;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [catRes, carRes] = await Promise.all([
                carService.getCategories(),
                carService.getSellerCars()
            ]);
            setCategories(catRes.data.data || []);
            setCars(carRes.data.data || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = async () => {
        let fieldsToValidate = [];
        if (currentStep === 1) fieldsToValidate = ['category', 'brand', 'name', 'model', 'manufacturingYear'];
        if (currentStep === 2) fieldsToValidate = ['fuelType', 'transmissionType', 'mileage', 'kmDriven', 'engineCapacity', 'color', 'chassisNumber'];

        const result = await trigger(fieldsToValidate);
        if (result) {
            setCurrentStep(prev => prev + 1);
        }
    };


    const prevStep = () => setCurrentStep(prev => prev - 1);

    const onSubmit = async (data) => {
        const loadingToast = toast.loading('Listing your vehicle for sale...');
        setSubmitting(true);
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'photo') {
                    formData.append(key, data[key][0]);
                } else {
                    formData.append(key, data[key]);
                }
            });

            const response = await carService.addCar(formData);
            if (response.data.success) {
                toast.success("Vehicle listed successfully!", { id: loadingToast });
                reset();
                setCurrentStep(1);
                setIsFormVisible(false);
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add vehicle", { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    const [selectedCar, setSelectedCar] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const openInfo = (car) => {
        setSelectedCar(car);
        setShowOffcanvas(true);
    };

    const closeInfo = () => {
        setShowOffcanvas(false);
        setTimeout(() => setSelectedCar(null), 300);
    };

    const deleteCar = async (id) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                const response = await carService.deleteCar(id);
                if (response.data.success) {
                    toast.success("Listing deleted successfully");
                    setCars(cars.filter(c => c._id !== id));
                    if (selectedCar?._id === id) closeInfo();
                }
            } catch (error) {
                toast.error("Failed to delete listing");
            }
        }
    };

    const toggleStatus = async (carId, currentStatus) => {
        const newStatus = currentStatus === 'Available' ? 'Sold' : 'Available';
        const loadingToast = toast.loading(`Updating status to ${newStatus}...`);
        try {
            const response = await carService.updateCarStatus(carId, newStatus);
            if (response.data.success) {
                toast.success(`Vehicle marked as ${newStatus}`, { id: loadingToast });
                setCars(cars.map(c => c._id === carId ? { ...c, status: newStatus } : c));
                setSelectedCar({ ...selectedCar, status: newStatus });
            }
        } catch (error) {
            toast.error("Failed to update status", { id: loadingToast });
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredCars = cars.filter(car => {
        const name = car.name || '';
        const brand = car.brand || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || car.status === filterStatus;
        return matchesSearch && matchesStatus;
    });


    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.mainTitle}>My Showroom</h1>
                    <p className={styles.mainSubtitle}>Monitor your performance and manage your digital car lot</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.statsMini}>
                        <div className={`${styles.statItem} ${styles.statBlue}`}>
                            <div className={styles.statIconWrap}>
                                <i className="fas fa-car-side"></i>
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statVal}>{cars.length}</span>
                                <span className={styles.statLbl}>Total</span>
                            </div>
                        </div>
                        <div className={`${styles.statItem} ${styles.statGreen}`}>
                            <div className={styles.statIconWrap}>
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statVal}>{cars.filter(c => c.status === 'Available').length}</span>
                                <span className={styles.statLbl}>Active</span>
                            </div>
                        </div>
                        <div className={`${styles.statItem} ${styles.statAmber}`}>
                            <div className={styles.statIconWrap}>
                                <i className="fas fa-handshake"></i>
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statVal}>{cars.filter(c => c.status === 'Sold').length}</span>
                                <span className={styles.statLbl}>Sold</span>
                            </div>
                        </div>
                    </div>
                    <button
                        className={styles.btnAddForm}
                        onClick={() => setIsFormVisible(!isFormVisible)}
                    >
                        {isFormVisible ? (
                            <><i className="fas fa-times me-2"></i> Close</>
                        ) : (
                            <><i className="fas fa-plus me-2"></i> New Listing</>
                        )}
                    </button>
                </div>
            </div>




            {isFormVisible && (
                <div className={styles.formCard}>
                    <div className={styles.formHeader}>
                        <h2>Vehicle Listing Form</h2>
                        <p>Provide accurate details to attract potential buyers</p>
                    </div>
                    <div className={styles.stepIndicator}>
                        <div className={`${styles.step} ${currentStep >= 1 ? styles.completedStep : ''} ${currentStep === 1 ? styles.activeStep : ''}`}>
                            <div className={styles.stepNumber}>{currentStep > 1 ? <i className="fas fa-check"></i> : '1'}</div>
                            <span className={styles.stepLabel}>Basic Info</span>
                        </div>
                        <div className={`${styles.step} ${currentStep >= 2 ? styles.completedStep : ''} ${currentStep === 2 ? styles.activeStep : ''}`}>
                            <div className={styles.stepNumber}>{currentStep > 2 ? <i className="fas fa-check"></i> : '2'}</div>
                            <span className={styles.stepLabel}>Technical</span>
                        </div>
                        <div className={`${styles.step} ${currentStep >= 3 ? styles.completedStep : ''} ${currentStep === 3 ? styles.activeStep : ''}`}>
                            <div className={styles.stepNumber}>3</div>
                            <span className={styles.stepLabel}>Pricing & Media</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Category</label>
                                    <select
                                        className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
                                        {...register('category', { required: 'Category is required' })}
                                    >
                                        <option value="">Choose Category</option>
                                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                    {errors.category && <span className={styles.errorText}>{errors.category.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Brand</label>
                                    <select
                                        className={`${styles.select} ${errors.brand ? styles.inputError : ''}`}
                                        {...register('brand', { required: 'Brand is required' })}
                                    >
                                        <option value="">Choose Brand</option>
                                        <option value="Toyota">Toyota</option>
                                        <option value="Honda">Honda</option>
                                        <option value="Ford">Ford</option>
                                        <option value="BMW">BMW</option>
                                        <option value="Mercedes-Benz">Mercedes-Benz</option>
                                        <option value="Audi">Audi</option>
                                        <option value="Volkswagen">Volkswagen</option>
                                        <option value="Hyundai">Hyundai</option>
                                        <option value="Kia">Kia</option>
                                        <option value="Nissan">Nissan</option>
                                        <option value="Maruti Suzuki">Maruti Suzuki</option>
                                        <option value="Tata">Tata</option>
                                        <option value="Mahindra">Mahindra</option>
                                    </select>
                                    {errors.brand && <span className={styles.errorText}>{errors.brand.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Vehicle Name</label>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                        placeholder="e.g. Camry, X5"
                                        {...register('name', { required: 'Vehicle name is required' })}
                                    />
                                    {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Registration Year (Model)</label>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.model ? styles.inputError : ''}`}
                                        placeholder="e.g. 2023"
                                        {...register('model', {
                                            required: 'Registration year is required',
                                            pattern: { value: /^[0-9]{4}$/, message: 'Enter a valid 4-digit year' }
                                        })}
                                    />
                                    {errors.model && <span className={styles.errorText}>{errors.model.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Manufacturing Year</label>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.manufacturingYear ? styles.inputError : ''}`}
                                        placeholder="e.g. 2022"
                                        {...register('manufacturingYear', {
                                            required: 'Manufacturing year is required',
                                            pattern: { value: /^[0-9]{4}$/, message: 'Enter a valid 4-digit year' }
                                        })}
                                    />
                                    {errors.manufacturingYear && <span className={styles.errorText}>{errors.manufacturingYear.message}</span>}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Fuel Type</label>
                                    <select className={styles.select} {...register('fuelType')}>
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="CNG">CNG</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Transmission</label>
                                    <select className={styles.select} {...register('transmissionType')}>
                                        <option value="Manual">Manual</option>
                                        <option value="Automatic">Automatic</option>
                                        <option value="CVT">CVT</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Mileage (km/l)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className={`${styles.input} ${errors.mileage ? styles.inputError : ''}`}
                                        {...register('mileage', { required: 'Mileage is required' })}
                                    />
                                    {errors.mileage && <span className={styles.errorText}>{errors.mileage.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>KM Driven</label>
                                    <input
                                        type="number"
                                        className={`${styles.input} ${errors.kmDriven ? styles.inputError : ''}`}
                                        {...register('kmDriven', { required: 'KM driven is required' })}
                                    />
                                    {errors.kmDriven && <span className={styles.errorText}>{errors.kmDriven.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Engine Capacity (cc)</label>
                                    <input
                                        type="number"
                                        className={`${styles.input} ${errors.engineCapacity ? styles.inputError : ''}`}
                                        placeholder="e.g. 1498"
                                        {...register('engineCapacity', { required: 'Engine capacity is required' })}
                                    />
                                    {errors.engineCapacity && <span className={styles.errorText}>{errors.engineCapacity.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Exterior Color</label>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.color ? styles.inputError : ''}`}
                                        placeholder="e.g. White, Black Meta"
                                        {...register('color', { required: 'Color is required' })}
                                    />
                                    {errors.color && <span className={styles.errorText}>{errors.color.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Chassis Number</label>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.chassisNumber ? styles.inputError : ''}`}
                                        placeholder="Enter chassis #"
                                        {...register('chassisNumber', { required: 'Chassis number is required' })}
                                    />
                                    {errors.chassisNumber && <span className={styles.errorText}>{errors.chassisNumber.message}</span>}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Selling Price (Rs.)</label>
                                    <input
                                        type="number"
                                        className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                                        {...register('price', { required: 'Selling price is required' })}
                                        placeholder="Enter total price"
                                    />
                                    {errors.price && <span className={styles.errorText}>{errors.price.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Registration Number</label>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.registrationNumber ? styles.inputError : ''}`}
                                        placeholder="e.g. MH-12-AB-1234"
                                        {...register('registrationNumber', { required: 'Reg # is required' })}
                                    />
                                    {errors.registrationNumber && <span className={styles.errorText}>{errors.registrationNumber.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Insurance Validity</label>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.insuranceValidity ? styles.inputError : ''}`}
                                        placeholder="e.g. Dec 2025"
                                        {...register('insuranceValidity', { required: 'Insurance info is required' })}
                                    />
                                    {errors.insuranceValidity && <span className={styles.errorText}>{errors.insuranceValidity.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Location (City/Area)</label>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
                                        placeholder="e.g. Mumbai, Bandra"
                                        {...register('location', { required: 'Location is required' })}
                                    />
                                    {errors.location && <span className={styles.errorText}>{errors.location.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Owner Type</label>
                                    <select className={styles.select} {...register('ownerType')}>
                                        <option value="First Owner">First Owner</option>
                                        <option value="Second Owner">Second Owner</option>
                                        <option value="Third Owner">Third Owner</option>
                                        <option value="Fourth or More">Fourth or More</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Vehicle Photo</label>
                                    <input
                                        type="file"
                                        className={`${styles.input} ${errors.photo ? styles.inputError : ''}`}
                                        {...register('photo', { required: 'Photo is required' })}
                                    />
                                    {errors.photo && <span className={styles.errorText}>{errors.photo.message}</span>}
                                </div>
                            </div>
                        </div>



                        <div className={styles.actions}>
                            {currentStep > 1 && (
                                <button type="button" className={styles.btnBack} onClick={prevStep}>
                                    <i className="fas fa-arrow-left me-2"></i> Back
                                </button>
                            )}
                            <div style={{ marginLeft: 'auto' }}>
                                {currentStep < 3 ? (
                                    <button type="button" className={styles.btnNext} onClick={nextStep}>
                                        Continue <i className="fas fa-arrow-right ms-2"></i>
                                    </button>
                                ) : (
                                    <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                                        {submitting ? 'Posting...' : 'Post Vehicle Ad'}
                                        {!submitting && <i className="fas fa-check-circle ms-2"></i>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.inventorySection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Manage Listings</h2>
                    <div className={styles.inventoryFilters}>
                        <div className={styles.searchBox}>
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search by name or brand..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={styles.filterGroup}>
                            <button
                                className={`${styles.filterBtn} ${filterStatus === 'All' ? styles.filterActive : ''}`}
                                onClick={() => setFilterStatus('All')}
                            >
                                All
                            </button>
                            <button
                                className={`${styles.filterBtn} ${filterStatus === 'Available' ? styles.filterActive : ''}`}
                                onClick={() => setFilterStatus('Available')}
                            >
                                Available
                            </button>
                            <button
                                className={`${styles.filterBtn} ${filterStatus === 'Sold' ? styles.filterActive : ''}`}
                                onClick={() => setFilterStatus('Sold')}
                            >
                                Sold
                            </button>
                        </div>

                        <span className={styles.badgeCount}>{cars.length} Cars Listed</span>
                    </div>

                </div>

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading your showroom...</p>
                    </div>
                ) : (
                    <div className={styles.carsGrid}>
                        {cars.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <i className="fas fa-car-side"></i>
                                </div>
                                <h3>Welcome to Your Showroom</h3>
                                <p>You haven't listed any vehicles yet. Start your journey by adding your first car!</p>
                                <button className={styles.btnAddFirst} onClick={() => setIsFormVisible(true)}>
                                    <i className="fas fa-plus-circle me-2"></i> Add First Vehicle
                                </button>
                            </div>
                        ) : filteredCars.length > 0 ? (
                            filteredCars.map(car => (
                                <div key={car._id} className={styles.saasCarCard}>
                                    <div className={styles.cardImageArea}>
                                        <img src={getImageUrl(car.photo)} alt={car.name} />
                                        <div className={styles.priceTag}>₹{car.price?.toLocaleString()}</div>
                                        <div className={`${styles.statusBadge} ${styles[car.status?.toLowerCase()]}`}>
                                            {car.status}
                                        </div>
                                    </div>

                                    <div className={styles.cardInfo}>
                                        <div className={styles.cardMain}>
                                            <div className={styles.brandRow}>
                                                <span className={styles.brandTag}>{car.brand}</span>
                                                <span className={styles.yearTag}>{car.model}</span>
                                            </div>
                                            <h3 className={styles.carName}>{car.name}</h3>
                                            <div className={styles.cardMetrics}>
                                                <span><i className="fas fa-gas-pump"></i> {car.fuelType}</span>
                                                <span><i className="fas fa-cog"></i> {car.transmissionType}</span>
                                            </div>
                                        </div>

                                        <div className={styles.cardActions}>
                                            <button
                                                className={styles.btnInfo}
                                                onClick={() => openInfo(car)}
                                            >
                                                Details
                                            </button>
                                            <button
                                                className={`${styles.btnEdit} ${car.hasRequests ? styles.btnDisabled : ''}`}
                                                onClick={() => car.hasRequests ? toast.error("Cannot edit: This car has active purchase requests.") : navigate(`/seller/edit_car/${car._id}`)}
                                                title={car.hasRequests ? "Editing disabled (Inquiries present)" : "Edit Listing"}
                                            >
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                className={`${styles.btnTrash} ${car.hasRequests ? styles.btnDisabled : ''}`}
                                                onClick={() => car.hasRequests ? toast.error("Cannot delete: This car has active purchase requests.") : deleteCar(car._id)}
                                                title={car.hasRequests ? "Deletion disabled (Inquiries present)" : "Delete Listing"}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <i className="fas fa-search"></i>
                                </div>
                                <h3>No Matches Found</h3>
                                <p>We couldn't find any vehicles matching your current search or filter criteria.</p>
                                <button className={styles.btnReset} onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}>
                                    Clear All Filters
                                </button>
                            </div>
                        )}


                    </div>
                )}
            </div>

            {/* Offcanvas Detail View */}
            <div className={`${styles.offcanvasOverlay} ${showOffcanvas ? styles.overlayVisible : ''}`} onClick={closeInfo}></div>
            <div className={`${styles.offcanvas} ${showOffcanvas ? styles.offcanvasOpen : ''}`}>
                {selectedCar && (
                    <div className={styles.offcanvasContent}>
                        <div className={styles.offcanvasHeader}>
                            <h2>Vehicle Details</h2>
                            <button className={styles.btnClose} onClick={closeInfo}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className={styles.offcanvasBody}>
                            <div className={styles.detailImage}>
                                <img src={getImageUrl(selectedCar.photo)} alt={selectedCar.name} />
                            </div>
                            <div className={styles.detailTitle}>
                                <span className={styles.brandBadge}>{selectedCar.brand}</span>
                                <h3>{selectedCar.name} ({selectedCar.model})</h3>
                                <div className={styles.detailPrice}>₹{selectedCar.price?.toLocaleString()}</div>
                            </div>

                            <div className={styles.specGrid}>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Mfg. Year</span>
                                    <span className={styles.specVal}>{selectedCar.manufacturingYear}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Exterior Color</span>
                                    <span className={styles.specVal}>{selectedCar.color}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Reg. Number</span>
                                    <span className={styles.specVal}>{selectedCar.registrationNumber}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Insurance</span>
                                    <span className={styles.specVal}>{selectedCar.insuranceValidity}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Location</span>
                                    <span className={styles.specVal}>{selectedCar.location}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Transmission</span>
                                    <span className={styles.specVal}>{selectedCar.transmissionType}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Fuel Type</span>
                                    <span className={styles.specVal}>{selectedCar.fuelType}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Mileage</span>
                                    <span className={styles.specVal}>{selectedCar.mileage} km/l</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>KM Driven</span>
                                    <span className={styles.specVal}>{selectedCar.kmDriven} km</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Engine</span>
                                    <span className={styles.specVal}>{selectedCar.engineCapacity} cc</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Owners</span>
                                    <span className={styles.specVal}>{selectedCar.ownerType}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Status</span>
                                    <span className={styles.specVal}>{selectedCar.status}</span>
                                </div>
                            </div>


                            {/* <div className={styles.offcanvasFooter}>
                                {selectedCar.status !== 'Available' ? (
                                    <button
                                        className={`${styles.btnStatusToggle} ${styles.btnAvailable}`}
                                        onClick={() => toggleStatus(selectedCar._id, selectedCar.status)}
                                    >
                                        Mark as Available
                                    </button>
                                ) : (
                                    <button
                                        className={`${styles.btnStatusToggle} ${styles.btnSold}`}
                                        onClick={() => toggleStatus(selectedCar._id, selectedCar.status)}
                                    >
                                        Mark as Sold
                                    </button>
                                )}
                            </div> */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerManageCars;
