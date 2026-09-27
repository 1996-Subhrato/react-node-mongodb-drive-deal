import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import styles from './SellerLogin.module.css';

const SellerLogin = () => {
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data) => {
        setServerError('');
        setLoading(true);

        try {
            const result = await login(authService.sellerLogin(data), 'seller');
            if (result.success) {
                navigate('/seller/dashboard');
            } else {
                setServerError(result.error?.response?.data?.message || 'Login failed');
            }
        } catch (err) {
            setServerError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.meshGradient}></div>
            <div className={styles.glassCircle1}></div>
            <div className={styles.glassCircle2}></div>

            <div className={styles.loginCard}>
                <div className={styles.logoArea}>
                    {/* <Link to="/">
                        <img src="/assets/img/new_drive_deal_logo.png" alt="Drive Deal" className={styles.logo} />
                    </Link> */}
                    <h2 className={styles.title}>Seller Login</h2>
                    <p className={styles.subtitle}>Sign in to manage your car showroom</p>
                </div>

                {serverError && (
                    <div className={styles.errorAlert}>
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Seller Email</label>
                        <input
                            type="email"
                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                            placeholder="seller@drivedeal.com"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            disabled={loading}
                        />
                        {errors.email && (
                            <span className={styles.errorText}>
                                <i className="fas fa-exclamation-circle"></i> {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                            placeholder="••••••••"
                            {...register('password', {
                                required: 'Password is required'
                            })}
                            disabled={loading}
                        />
                        {errors.password && (
                            <span className={styles.errorText}>
                                <i className="fas fa-exclamation-circle"></i> {errors.password.message}
                            </span>
                        )}
                    </div>

                    <button type="submit" className={styles.loginButton} disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Authenticating...
                            </>
                        ) : (
                            <>
                                Seller Login
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.footerLinks}>
                    <p>Want to sell with us? <Link to="/seller/signup">Become a partner</Link></p>
                    <p style={{ marginTop: '10px' }}><Link to="/">Return to Homepage</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SellerLogin;
