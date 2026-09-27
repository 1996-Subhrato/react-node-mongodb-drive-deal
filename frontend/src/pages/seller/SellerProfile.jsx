import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import { toast } from 'react-hot-toast';
import styles from './SellerProfile.module.css';

const SellerProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [profile, setProfile] = useState({
        id: '',
        name: '',
        adhar_card: '',
        pan_card: '',
        email: '',
        mobile: '',
        gender: 'male',
        city: '',
        address: '',
        photo: '',
        banner: '',
        status: 'Active'
    });
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    const fileInputRef = React.useRef(null);
    const bannerInputRef = React.useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await authService.getProfile('seller');
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

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedBanner(file);
            setBannerPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Updating profile...");
        try {
            const formData = new FormData();
            formData.append('name', profile.name);
            formData.append('gender', profile.gender);
            formData.append('mobile', profile.mobile);
            formData.append('adhar_card', profile.adhar_card);
            formData.append('pan_card', profile.pan_card);
            formData.append('city', profile.city);
            formData.append('address', profile.address);
            
            if (selectedFile) {
                formData.append('photo', selectedFile);
            }

            if (selectedBanner) {
                formData.append('banner', selectedBanner);
            }

            const response = await authService.updateProfile('seller', '', formData);
            if (response.data.success) {
                toast.success(response.data.message, { id: toastId });
                setIsEditing(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                setSelectedBanner(null);
                setBannerPreviewUrl(null);
                fetchProfile();
            }
        } catch (error) {
            toast.error("Failed to update profile", { id: toastId });
        }
    };

    if (loading) return (
        <div className={styles.container}>
            <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="mt-3 text-muted">Fetching profile details...</p>
            </div>
        </div>
    );

    const photoUrl = previewUrl || (profile.photo ? (profile.photo.startsWith('http') ? profile.photo : `http://localhost:5000${profile.photo.startsWith('/') ? '' : '/'}${profile.photo}`) : null);
    
    const bannerUrl = bannerPreviewUrl || (profile.banner ? (profile.banner.startsWith('http') ? profile.banner : `http://localhost:5000${profile.banner.startsWith('/') ? '' : '/'}${profile.banner}`) : null);

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <div 
                    className={styles.profileBanner}
                    style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}}
                >
                    <input 
                        type="file" 
                        ref={bannerInputRef} 
                        style={{ display: 'none' }} 
                        accept="image/*"
                        onChange={handleBannerChange}
                    />
                    {isEditing && (
                        <button className={styles.editBannerBtn} onClick={() => bannerInputRef.current.click()}>
                            <i className="fas fa-camera"></i> Change Banner
                        </button>
                    )}
                </div>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarWrapper}>
                        <img 
                            src={photoUrl} 
                            alt="Profile" 
                            className={styles.avatar}
                            onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + profile.name}
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
                        <h1>{profile.name}</h1>
                        <p>{profile.email}</p>
                    </div>
                    <div className={styles.actions} style={{ marginLeft: 'auto', marginBottom: '1rem' }}>
                        {!isEditing ? (
                            <button className={styles.btnEdit} onClick={() => setIsEditing(true)}>
                                <i className="fas fa-edit"></i> Edit Profile
                            </button>
                        ) : (
                            <>
                                <button className={styles.btnCancel} onClick={() => setIsEditing(false)}>Cancel</button>
                                <button className={styles.btnSave} onClick={handleSave}>
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
                            <i className="fas fa-user"></i> Seller Information
                        </h3>
                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Full Name</label>
                                <input 
                                    name="name" 
                                    type="text" 
                                    className={styles.input} 
                                    value={profile.name} 
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
                                    value={profile.gender} 
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
                                    value={profile.mobile} 
                                    readOnly={!isEditing} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email Address</label>
                                <input 
                                    name="email" 
                                    type="email" 
                                    className={styles.input} 
                                    value={profile.email} 
                                    readOnly 
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.card} mt-4`}>
                        <h3 className={styles.cardTitle}>
                            <i className="fas fa-id-card"></i> Identity & Verification
                        </h3>
                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Aadhaar Number</label>
                                <input 
                                    name="adhar_card" 
                                    type="text" 
                                    className={styles.input} 
                                    value={profile.adhar_card} 
                                    readOnly={!isEditing} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>PAN Number</label>
                                <input 
                                    name="pan_card" 
                                    type="text" 
                                    className={styles.input} 
                                    value={profile.pan_card} 
                                    readOnly={!isEditing} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.sidebarInfo}>
                    <div className={styles.statusCard}>
                        <span className={styles.statusLabel}>Seller Status</span>
                        <div className={styles.statusValue}>
                            <i className="fas fa-check-circle text-success me-2"></i>
                            {profile.status}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <i className="fas fa-map-marker-alt"></i> Business Location
                        </h3>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>City</label>
                            <input 
                                name="city" 
                                type="text" 
                                className={styles.input} 
                                value={profile.city} 
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
                                value={profile.address} 
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

export default SellerProfile;
