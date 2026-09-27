import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './CarCard.module.css';

const CarCard = memo(({ car }) => {
    // Normalize image path from API
    const imageUrl = car.photo 
        ? (car.photo.startsWith('http') 
            ? car.photo 
            : (car.photo.startsWith('/') ? `http://localhost:5000${car.photo}` : `http://localhost:5000/uploads/${car.photo}`)) 
        : '/assets/img/cars/car_placeholder.png';

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <div className={styles.badgeOverlay}>
                    <span className={styles.yearBadge}>{car.model}</span>
                    {car.category?.name && <span className={styles.categoryBadge}>{car.category.name}</span>}
                </div>
                <img 
                    src={imageUrl} 
                    alt={car.name} 
                    className={styles.image}
                    loading="lazy"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=600'}
                />
                <div className={styles.priceTag}>
                    Rs. {car.price?.toLocaleString()}
                </div>
            </div>

            <div className={styles.content}>
                <span className={styles.brand}>{car.brand}</span>
                <Link to={`/single_car/${car._id}`} className={styles.name}>
                    {car.name}
                </Link>

                <div className={styles.specs}>
                    <div className={styles.specItem}>
                        <i className="fas fa-user-friends"></i>
                        <span>{car.ownerType || '1st Owner'}</span>
                    </div>
                    <div className={styles.specItem}>
                        <i className="fas fa-cog"></i>
                        <span>{car.transmissionType || 'Manual'}</span>
                    </div>
                    <div className={styles.specItem}>
                        <i className="fas fa-gas-pump"></i>
                        <span>{car.fuelType || 'Petrol'}</span>
                    </div>
                </div>

                <Link to={`/single_car/${car._id}`} className={styles.viewBtn}>
                    View Details
                    <i className="fas fa-arrow-right"></i>
                </Link>
            </div>
        </div>
    );
});

export default CarCard;
