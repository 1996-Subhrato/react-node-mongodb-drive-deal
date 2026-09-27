import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import styles from '../admin/AdminShared.module.css';

const ChangePassword = () => {
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        mode: 'onChange'
    });

    const newPassword = watch('new_password');

    const onSubmit = async (data) => {
        const toastId = toast.loading("Updating password...");
        try {
            setSubmitting(true);
            
            // Derive role from URL if user.role is missing (e.g. /dealer/change_password -> dealer)
            const pathParts = window.location.pathname.split('/');
            const rolePath = user?.role || pathParts[1] || 'user';
            
            // Match backend field names: 'password' instead of 'old_password'
            const payload = {
                password: data.old_password,
                new_password: data.new_password
            };

            const response = await authService.updatePassword(rolePath, payload, { 
                headers: { 'x-skip-toast': 'true' } 
            });
            
            if (response.data.success) {
                toast.success("Password updated successfully!", { id: toastId });
                reset();
            }
        } catch (err) {
            // Error toast is handled here manually to replace the loading toast (toastId)
            const errorMsg = err.response?.data?.message || "Failed to update password";
            toast.error(errorMsg, { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className={styles.card}>
                        <h2 className={styles.title}>Account Security</h2>
                        <p className="mb-4" style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Update your password to keep your account secure.</p>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Current Password</label>
                                <input
                                    type="password"
                                    className={`${styles.input} ${errors.old_password ? styles.inputError : ''}`}
                                    placeholder="Enter current password"
                                    disabled={submitting}
                                    {...register('old_password', { required: 'Current password is required' })}
                                />
                                {errors.old_password && <span className={styles.errorText} style={{ color: 'red' }}><i className="fas fa-exclamation-circle me-1"></i> {errors.old_password.message}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>New Password</label>
                                <input
                                    type="password"
                                    className={`${styles.input} ${errors.new_password ? styles.inputError : ''}`}
                                    placeholder="Min. 6 characters"
                                    disabled={submitting}
                                    {...register('new_password', {
                                        required: 'New password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    })}
                                />
                                {errors.new_password && <span className={styles.errorText} style={{ color: 'red' }}><i className="fas fa-exclamation-circle me-1"></i> {errors.new_password.message}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Confirm New Password</label>
                                <input
                                    type="password"
                                    className={`${styles.input} ${errors.confirm_password ? styles.inputError : ''}`}
                                    placeholder="Re-type new password"
                                    disabled={submitting}
                                    {...register('confirm_password', {
                                        required: 'Please confirm your new password',
                                        validate: value => value === newPassword || 'Passwords do not match'
                                    })}
                                />
                                {errors.confirm_password && <span className={styles.errorText} style={{ color: 'red' }}><i className="fas fa-exclamation-circle me-1"></i> {errors.confirm_password.message}</span>}
                            </div>

                            <button
                                type="submit"
                                className={styles.btnPrimary}
                                style={{ width: '100%', marginTop: '1.5rem', padding: '0.875rem' }}
                                disabled={submitting}
                            >
                                <i className="fas fa-shield-alt"></i>
                                {submitting ? 'Updating Security...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
