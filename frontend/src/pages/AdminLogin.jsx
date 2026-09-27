import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
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
            const result = await login(authService.adminLogin(data, { 
                headers: { 'x-skip-toast': true } 
            }), 'admin');
            if (result.success) {
                navigate('/admin/dashboard');
            } else {
                setServerError(result.error?.response?.data?.message || 'Authentication failed. Please check your credentials.');
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
                    <Link to="/">
                        <img src="/assets/img/new_drive_deal_logo.png" alt="Drive Deal" className={styles.logo} />
                    </Link>
                    <p className={styles.tagline}>Secure Admin Portal</p>
                </div>

                {serverError && (
                    <div className={styles.errorAlert}>
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Admin Email</label>
                        <input
                            type="email"
                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                            placeholder="e.g. admin@drivedeal.com"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            disabled={loading}
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                            placeholder="••••••••"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
                            })}
                            disabled={loading}
                        />
                        {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
                    </div>

                    <button type="submit" className={styles.loginButton} disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Authenticating...
                            </>
                        ) : (
                            <>
                                Secure Login
                                <i className="fa-solid fa-arrow-right"></i>
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.footerLinks}>
                    <p>Not an Admin? <Link to="/">Return to Homepage</Link></p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
