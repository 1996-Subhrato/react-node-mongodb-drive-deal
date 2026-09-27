import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';
import styles from './UserSignup.module.css';
import signupHero from '../assets/user_signup_hero.png';

const UserSignup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            mobile: '',
            gender: '',
            address: '',
            city: ''
        }
    });

    const password = watch('password');

    const nextStep = async () => {
        let fieldsToValidate = [];
        if (currentStep === 1) fieldsToValidate = ['first_name', 'last_name', 'email', 'password', 'confirm_password'];
        if (currentStep === 2) fieldsToValidate = ['mobile', 'gender', 'city', 'address'];

        const result = await trigger(fieldsToValidate);
        if (result) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');

        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });

            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput && fileInput.files[0]) {
                formData.append('photo', fileInput.files[0]);
            } else {
                toast.error("Please upload a profile photo");
                setLoading(false);
                return;
            }

            const response = await authService.userSignup(formData);
            if (response.data.success) {
                toast.success("Registration successful! Welcome to Drive Deal.");
                navigate('/user/login');
            }
        } catch (err) {
            setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.signupPage}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
                <div className={styles.meshGradient}></div>
                <img src={signupHero} alt="Join Drive Deal" className={styles.heroImage} />
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <h1>Join <span>Drive Deal</span></h1>
                    <p>Unlock access to the most exclusive premium car marketplace. Sign up today and start discovering exceptional vehicle deals.</p>

                    <div className={styles.featuresList}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><i className="fas fa-key"></i></div>
                            <div className={styles.featureText}>
                                <h3>Market Access</h3>
                                <p>Browse and acquire from a curated selection of premium vehicles.</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><i className="fas fa-shield-alt"></i></div>
                            <div className={styles.featureText}>
                                <h3>Verified Listings</h3>
                                <p>Every vehicle undergoes a rigorous inspection for your peace of mind.</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><i className="fas fa-star"></i></div>
                            <div className={styles.featureText}>
                                <h3>Secure Trading</h3>
                                <p>Benefit from our secure transaction framework and expert valuation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className={styles.formSection}>
                <div className={styles.signupCard}>
                    <div className={styles.formHeader}>
                        <h2>Create Account</h2>
                        <p>
                            {currentStep === 1 && "Security & Credentials"}
                            {currentStep === 2 && "Personal Information"}
                            {currentStep === 3 && "Profile Verification"}
                        </p>
                    </div>

                    <div className={styles.stepIndicator}>
                        <div className={`${styles.step} ${currentStep >= 1 ? styles.activeStep : ''}`}>1</div>
                        <div className={`${styles.step} ${currentStep >= 2 ? styles.activeStep : ''}`}>2</div>
                        <div className={`${styles.step} ${currentStep >= 3 ? styles.activeStep : ''}`}>3</div>
                    </div>

                    {serverError && (
                        <div className={styles.errorAlert} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <i className="fa-solid fa-circle-exclamation me-2"></i> {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {currentStep === 1 && (
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>First Name</label>
                                    <input type="text" className={`${styles.input} ${errors.first_name ? styles.inputError : ''}`} {...register('first_name', { required: 'Required' })} disabled={loading} />
                                    {errors.first_name && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.first_name.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Last Name</label>
                                    <input type="text" className={`${styles.input} ${errors.last_name ? styles.inputError : ''}`} {...register('last_name', { required: 'Required' })} disabled={loading} />
                                    {errors.last_name && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.last_name.message}</span>}
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Email</label>
                                    <input type="email" className={`${styles.input} ${errors.email ? styles.inputError : ''}`} {...register('email', { required: 'Required' })} disabled={loading} />
                                    {errors.email && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.email.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Password</label>
                                    <input type="password" className={`${styles.input} ${errors.password ? styles.inputError : ''}`} {...register('password', { required: 'Required' })} disabled={loading} />
                                    {errors.password && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.password.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Confirm</label>
                                    <input type="password" className={`${styles.input} ${errors.confirm_password ? styles.inputError : ''}`} {...register('confirm_password', { required: 'Required', validate: v => v === password || 'No match' })} disabled={loading} />
                                    {errors.confirm_password && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.confirm_password.message}</span>}
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Mobile</label>
                                    <input type="text" className={`${styles.input} ${errors.mobile ? styles.inputError : ''}`} {...register('mobile', { required: 'Required' })} disabled={loading} />
                                    {errors.mobile && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.mobile.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Gender</label>
                                    <select className={`${styles.select} ${errors.gender ? styles.inputError : ''}`} {...register('gender', { required: 'Required' })} disabled={loading}>
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.gender && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.gender.message}</span>}
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>City</label>
                                    <input type="text" className={`${styles.input} ${errors.city ? styles.inputError : ''}`} {...register('city', { required: 'Required' })} disabled={loading} />
                                    {errors.city && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.city.message}</span>}
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Address</label>
                                    <input type="text" className={`${styles.input} ${errors.address ? styles.inputError : ''}`} {...register('address', { required: 'Required' })} disabled={loading} />
                                    {errors.address && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.address.message}</span>}
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className={styles.formGrid}>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Profile Photo</label>
                                    <div className={styles.fileUploadArea}>
                                        <i className="fa-solid fa-cloud-arrow-up"></i>
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const name = e.target.files[0]?.name;
                                            e.target.parentElement.querySelector('p').textContent = name || 'Choose Photo';
                                        }} />
                                        <p>Choose clear profile picture</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.navigationButtons}>
                            {currentStep > 1 && <button type="button" onClick={prevStep} className={styles.backButton}>Back</button>}
                            {currentStep < 3 ? (
                                <button type="button" onClick={nextStep} className={styles.submitButton}>Next</button>
                            ) : (
                                <button type="submit" className={styles.submitButton} disabled={loading}>{loading ? 'Signing up...' : 'Join Now'}</button>
                            )}
                        </div>
                    </form>

                    <div className={styles.loginLink}>
                        Member already? <Link to="/user/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSignup;
