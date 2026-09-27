import React, { useState, useEffect, useRef } from 'react';
import authService from '../../services/authService';
import apiClient from '../../services/apiService';
import { toast } from 'react-hot-toast';
import styles from './UserProfile.module.css';

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [profile, setProfile] = useState({
        _id: '',
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        gender: 'male',
        city: '',
        address: '',
        photo: '',
        status: 'Active'
    });
    const [loading, setLoading] = useState(true);

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await authService.getProfile('user');
            if (response.data.success) {
                setProfile(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Updating profile...");
        try {
            const formData = new FormData();
            formData.append('first_name', profile.first_name);
            formData.append('last_name', profile.last_name);
            formData.append('gender', profile.gender);
            formData.append('mobile', profile.mobile);
            formData.append('city', profile.city);
            formData.append('address', profile.address);
            
            if (selectedFile) {
                formData.append('photo', selectedFile);
            }

            const response = await apiClient.put(`/user/updateProfile/${profile._id}`, formData);
            if (response.data.success) {
                toast.success(response.data.message || 'Profile updated successfully', { id: toastId });
                setIsEditing(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                fetchProfile();
            } else {
                toast.error(response.data.message || 'Failed to update profile', { id: toastId });
            }
        } catch (error) {
            toast.error("Failed to update profile", { id: toastId });
        }
    };

    if (loading) return (
        <div className={styles.container}>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '60vh' }}>
                <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                <p className="mt-4 text-muted fw-bold">Syncing your profile data...</p>
            </div>
        </div>
    );

    const photoUrl = previewUrl || (profile.photo ? (profile.photo.startsWith('http') ? profile.photo : `http://localhost:5000${profile.photo.startsWith('/') ? '' : '/'}${profile.photo}`) : null);

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <div className={styles.profileBanner}></div>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarWrapper}>
                        <img 
                            src={photoUrl} 
                            alt="Profile" 
                            className={styles.avatar}
                            onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + profile.first_name}
                        />
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {isEditing && (
                            <button className={styles.editAvatarBtn} onClick={() => fileInputRef.current.click()}>
                                <i className="fas fa-camera"></i>
                            </button>
                        )}
                    </div>
                    <div className={styles.headerInfo}>
                        <h1>{profile.first_name} {profile.last_name}</h1>
                        <p>{profile.email}</p>
                    </div>
                    <div className={styles.actions} style={{ marginLeft: 'auto', marginBottom: '1rem' }}>
                        {!isEditing ? (
                            <button className={styles.btnEdit} onClick={() => setIsEditing(true)}>
                                <i className="fas fa-edit"></i> Edit Profile
                            </button>
                        ) : (
                            <>
                                <button type="button" className={styles.btnCancel} onClick={() => setIsEditing(false)}>Cancel</button>
                                <button type="button" className={styles.btnSave} onClick={handleSave}>
                                    <i className="fas fa-check"></i> Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} className={styles.profileGrid}>
                <div className={styles.mainContent}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <i className="fas fa-user text-primary"></i> Personal Information
                        </h3>
                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>First Name</label>
                                <input 
                                    name="first_name" 
                                    type="text" 
                                    className={styles.input} 
                                    value={profile.first_name || ''} 
                                    readOnly={!isEditing} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Last Name</label>
                                <input 
                                    name="last_name" 
                                    type="text" 
                                    className={styles.input} 
                                    value={profile.last_name || ''} 
                                    readOnly={!isEditing} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Gender</label>
                                <select 
                                    name="gender" 
                                    className={styles.select} 
                                    disabled={!isEditing} 
                                    value={profile.gender || 'male'} 
                                    onChange={handleChange}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Phone Number</label>
                                <input 
                                    name="mobile" 
                                    type="tel" 
                                    className={styles.input} 
                                    value={profile.mobile || ''} 
                                    readOnly={!isEditing} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                                <label className={styles.label}>Email Address (Read-Only)</label>
                                <input 
                                    name="email" 
                                    type="email" 
                                    className={styles.input} 
                                    value={profile.email || ''} 
                                    readOnly 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.sidebarInfo}>
                    <div className={styles.statusCard}>
                        <span className={styles.statusLabel}>Account Status</span>
                        <div className={styles.statusValue}>
                            <i className="fas fa-check-circle text-success me-2"></i>
                            {profile.status || 'Active'}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <i className="fas fa-map-marker-alt text-danger"></i> Location
                        </h3>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>City</label>
                            <input 
                                name="city" 
                                type="text" 
                                className={styles.input} 
                                value={profile.city || ''} 
                                readOnly={!isEditing} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className={`${styles.inputGroup} mt-3`}>
                            <label className={styles.label}>Full Address</label>
                            <textarea 
                                name="address" 
                                className={styles.textarea} 
                                rows="4" 
                                value={profile.address || ''} 
                                readOnly={!isEditing} 
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;
