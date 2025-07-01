import React, { useState } from 'react';
import './post.css';

const CreatePost = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = [
        'Technology',
        'Travel',
        'Food',
        'Lifestyle',
        'Health',
        'Education',
        'Entertainment',
        'Sports',
        'Business',
        'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }

            setFormData(prev => ({
                ...prev,
                image: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }));
        setImagePreview(null);
        document.getElementById('image-input').value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.category || !formData.content.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Get token with better error handling
            const token = localStorage.getItem('BlogNest_token');
            console.log('Token from localStorage:', token); // Debug log
            
            if (!token) {
                throw new Error('No authentication token found. Please login again.');
            }

            const submitData = new FormData();
            submitData.append('title', formData.title.trim());
            submitData.append('category', formData.category);
            submitData.append('content', formData.content.trim());
            
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            console.log('Making request with token:', token); // Debug log

            const response = await fetch('http://localhost:5000/api/post/createpost', {
                method: 'POST',
                body: submitData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Error response:', errorData); // Debug log
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setSuccess('Post created successfully!');
            
            // Reset form
            setFormData({
                title: '',
                category: '',
                content: '',
                image: null
            });
            setImagePreview(null);
            document.getElementById('image-input').value = '';

            console.log('Post created:', result);

        } catch (err) {
            console.error('Submit error:', err); // Debug log
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-container">
            <div className="create-post-wrapper">
                <h1 className="create-post-title">Create New Post</h1>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="create-post-form">
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            Title <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter your post title"
                            maxLength={100}
                            required
                        />
                        <small className="char-count">{formData.title.length}/100</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category" className="form-label">
                            Category <span className="required">*</span>
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="form-select"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="content" className="form-label">
                            Content <span className="required">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            className="form-textarea"
                            placeholder="Write your post content here..."
                            rows={8}
                            maxLength={5000}
                            required
                        />
                        <small className="char-count">{formData.content.length}/5000</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image-input" className="form-label">
                            Image (Optional)
                        </label>
                        <input
                            type="file"
                            id="image-input"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-file-input"
                        />
                        <small className="file-info">Supported formats: JPG, PNG, GIF. Max size: 5MB</small>
                        
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" className="preview-image" />
                                <button 
                                    type="button" 
                                    onClick={removeImage}
                                    className="remove-image-btn"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => {
                                setFormData({
                                    title: '',
                                    category: '',
                                    content: '',
                                    image: null
                                });
                                setImagePreview(null);
                                document.getElementById('image-input').value = '';
                            }}
                        >
                            Reset
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;