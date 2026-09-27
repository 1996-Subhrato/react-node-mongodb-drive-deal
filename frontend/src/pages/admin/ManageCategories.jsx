import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import adminService from '../../services/adminService';
import styles from './AdminShared.module.css';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { toast } from 'react-hot-toast';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm();
    const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit }, setValue: setValueEdit, watch: watchEdit } = useForm();

    const addPhoto = watch('photo');
    const editPhoto = watchEdit('photo');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await adminService.getCategories();
            if (response.data.success) {
                setCategories(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const onAddSubmit = async (data) => {
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            if (data.photo && data.photo[0]) {
                formData.append('photo', data.photo[0]);
            }

            const response = await adminService.addCategory(formData);
            if (response.data.success) {
                toast.success("Category added successfully!");
                reset();
                setShowAddForm(false);
                fetchCategories();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add category");
        } finally {
            setSubmitting(false);
        }
    };

    const onEditSubmit = async (data) => {
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            if (data.photo && data.photo[0]) {
                formData.append('photo', data.photo[0]);
            }

            const response = await adminService.updateCategory(currentCategory._id, formData);
            if (response.data.success) {
                toast.success("Category updated successfully!");
                setIsEditModalOpen(false);
                resetEdit();
                fetchCategories();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update category");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (category) => {
        setCurrentCategory(category);
        setValueEdit('name', category.name);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (category) => {
        setCurrentCategory(category);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await adminService.deleteCategory(currentCategory._id);
            if (response.data.success) {
                setCategories(categories.filter(c => c._id !== currentCategory._id));
                toast.success("Category deleted");
            }
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (!loading && categories.length === 0) {
        return (
            <div className={styles.container} style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center py-5 px-4 animate__animated animate__zoomIn" style={{ 
                    background: '#ffffff', 
                    borderRadius: '32px', 
                    border: '2px dashed #e2e8f0',
                    maxWidth: '600px',
                    width: '100%',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
                }}>
                    <div style={{ 
                        width: '100px', 
                        height: '100px', 
                        background: '#fffbeb', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 1.5rem',
                        color: '#f59e0b',
                        fontSize: '2.5rem',
                        boxShadow: '0 8px 16px rgba(245, 158, 11, 0.1)'
                    }}>
                        <i className="fas fa-folder-open"></i>
                    </div>
                    <h3 style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.8rem', marginBottom: '0.8rem' }}>
                        No Categories Found
                    </h3>
                    <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto 2.5rem', fontWeight: '500', lineHeight: '1.6' }}>
                        Your marketplace categories will appear here. Start by creating your first category to organize your vehicle inventory.
                    </p>
                    <button 
                        className={styles.btnPrimary} 
                        style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}
                        onClick={() => setShowAddForm(true)}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Create First Category
                    </button>

                    {/* Temporary Add Form inside the same view when requested from empty state */}
                    {showAddForm && (
                        <div className="mt-5 text-start animate__animated animate__fadeInUp">
                            <hr style={{ borderStyle: 'dashed', color: '#e2e8f0', margin: '2rem 0' }} />
                            <h4 className={styles.title} style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Add First Category</h4>
                            <form onSubmit={handleSubmit(onAddSubmit)}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.label}>Category Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                        placeholder="e.g. SUV, Sedan, Luxury"
                                        {...register('name', { required: 'Category name is required' })}
                                        disabled={submitting}
                                    />
                                    {errors.name && <div className={styles.errorText}>{errors.name.message}</div>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Category Photo</label>
                                    <div className={styles.fileInputWrapper}>
                                        <input
                                            type="file"
                                            id="photo"
                                            className={styles.fileInput}
                                            {...register('photo', { required: 'Photo is required' })}
                                            disabled={submitting}
                                            accept="image/*"
                                        />
                                        <div className={`${styles.fileInputCustom} ${errors.photo ? styles.inputError : ''}`}>
                                            <i className={`fas ${addPhoto?.[0] ? 'fa-check-circle' : 'fa-cloud-upload-alt'} ${styles.fileInputIcon}`}></i>
                                            <span className={styles.fileInputText}>
                                                {addPhoto?.[0] ? addPhoto[0].name : 'Choose category image...'}
                                            </span>
                                        </div>
                                    </div>
                                    {errors.photo && <div className={styles.errorText}>{errors.photo.message}</div>}
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="button" className={styles.btnDanger} style={{ flex: 1 }} onClick={() => setShowAddForm(false)}>Cancel</button>
                                    <button type="submit" className={styles.btnPrimary} style={{ flex: 2 }} disabled={submitting}>
                                        <i className="fas fa-plus"></i>
                                        {submitting ? 'Creating...' : 'Create Category'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {showAddForm && (
                <div className="row justify-content-center mb-5 animate__animated animate__fadeInDown">
                    <div className="col-md-6 col-lg-5">
                        <div className={styles.card}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className={styles.title} style={{ margin: 0 }}>Add New Category</h2>
                                <button 
                                    className="btn-close" 
                                    onClick={() => setShowAddForm(false)}
                                    style={{ filter: 'grayscale(1) brightness(0.5)' }}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit(onAddSubmit)}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.label}>Category Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                        placeholder="e.g. SUV, Sedan, Luxury"
                                        {...register('name', { required: 'Category name is required' })}
                                        disabled={submitting}
                                    />
                                    {errors.name && <div className={styles.errorText}>{errors.name.message}</div>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Category Photo</label>
                                    <div className={styles.fileInputWrapper}>
                                        <input
                                            type="file"
                                            id="photo"
                                            className={styles.fileInput}
                                            {...register('photo', { required: 'Photo is required' })}
                                            disabled={submitting}
                                            accept="image/*"
                                        />
                                        <div className={`${styles.fileInputCustom} ${errors.photo ? styles.inputError : ''}`}>
                                            <i className={`fas ${addPhoto?.[0] ? 'fa-check-circle' : 'fa-cloud-upload-alt'} ${styles.fileInputIcon}`}></i>
                                            <span className={styles.fileInputText}>
                                                {addPhoto?.[0] ? addPhoto[0].name : 'Choose category image...'}
                                            </span>
                                        </div>
                                    </div>
                                    {errors.photo && <div className={styles.errorText}>{errors.photo.message}</div>}
                                </div>
                                <button type="submit" className={styles.btnPrimary} style={{ width: '100%' }} disabled={submitting}>
                                    <i className="fas fa-plus"></i>
                                    {submitting ? 'Processing...' : 'Add Category'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                    <h3 className={styles.title} style={{ margin: 0 }}>Available Categories</h3>
                    <button 
                        className={styles.btnPrimary} 
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        <i className={`fas ${showAddForm ? 'fa-minus' : 'fa-plus'}`}></i>
                        {showAddForm ? 'Hide Form' : 'Add Category'}
                    </button>
                </div>
                <div className={styles.statsBadge}>
                    <i className="fas fa-tags"></i>
                    <span className='text-white'>Total Categories: <strong>{categories.length}</strong></span>
                </div>
            </div>

            <div className={styles.grid}>
                {categories.map((category) => (
                    <div key={category._id} className={styles.gridCard}>
                        <div className={styles.gridCardImgWrapper}>
                            <img
                                src={category.photo?.startsWith('http') ? category.photo : `http://localhost:5000${category.photo}`}
                                alt={category.name}
                                className={styles.gridCardImg}
                                onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
                            />
                        </div>
                        <div className={styles.gridCardBody}>
                            <h4 className={styles.gridCardTitle}>{category.name}</h4>
                            <div className="d-flex gap-2">
                                <button
                                    className={styles.btnPrimary}
                                    style={{ flex: 1, padding: '0.5rem' }}
                                    onClick={() => handleEditClick(category)}
                                >
                                    <i className="fas fa-edit"></i> Edit
                                </button>
                                <button
                                    className={styles.btnDanger}
                                    style={{ flex: 1 }}
                                    onClick={() => handleDeleteClick(category)}
                                >
                                    <i className="fas fa-trash-alt"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Category"
            >
                <form onSubmit={handleSubmitEdit(onEditSubmit)}>
                    <div className={styles.formGroup}>
                        <label htmlFor="edit_name" className={styles.label}>Category Name</label>
                        <input
                            type="text"
                            id="edit_name"
                            className={`${styles.input} ${errorsEdit.name ? styles.inputError : ''}`}
                            placeholder="Enter category name"
                            {...registerEdit('name', { required: 'Category name is required' })}
                            disabled={submitting}
                        />
                        {errorsEdit.name && <div className={styles.errorText}>{errorsEdit.name.message}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Category Photo (Optional)</label>

                        {/* Existing Image Preview */}
                        {currentCategory?.photo && (
                            <div className="mb-3 text-center">
                                <p className={styles.label} style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Current Image</p>
                                <img
                                    src={currentCategory.photo.startsWith('http') ? currentCategory.photo : `http://localhost:5000${currentCategory.photo}`}
                                    alt="Current"
                                    style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e2e8f0' }}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}

                        <div className={styles.fileInputWrapper}>
                            <input
                                type="file"
                                id="edit_photo"
                                className={styles.fileInput}
                                {...registerEdit('photo')}
                                disabled={submitting}
                                accept="image/*"
                            />
                            <div className={styles.fileInputCustom}>
                                <i className={`fas ${editPhoto?.[0] ? 'fa-check-circle' : 'fa-image'} ${styles.fileInputIcon}`}></i>
                                <span className={styles.fileInputText}>
                                    {editPhoto?.[0] ? editPhoto[0].name : 'Update category image...'}
                                </span>
                            </div>
                        </div>
                        <p className="mt-2" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Leave blank to keep the current photo.</p>
                    </div>
                    <div className="d-flex gap-3 mt-4">
                        <button type="button" className={styles.btnDanger} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.btnPrimary} style={{ flex: 1 }} disabled={submitting}>
                            {submitting ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${currentCategory?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                icon="fas fa-exclamation-triangle"
            />
        </div>
    );
};

export default ManageCategories;
