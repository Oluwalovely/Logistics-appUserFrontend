import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import Navbar from '../components/Navbar';
import { MapPin, Flag, Package, Camera, X } from 'lucide-react';

const CreateOrder = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        pickupStreet: '',
        pickupCity: '',
        deliveryStreet: '',
        deliveryCity: '',
        packageDescription: '',
        weight: '',
    });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const combined = [...images, ...files].slice(0, 2);
        setImages(combined);
        const newPreviews = combined.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = new FormData();
            data.append('pickupAddress', JSON.stringify({
                street: formData.pickupStreet,
                city: formData.pickupCity,
            }));
            data.append('deliveryAddress', JSON.stringify({
                street: formData.deliveryStreet,
                city: formData.deliveryCity,
            }));
            data.append('packageDescription', formData.packageDescription);
            data.append('weight', formData.weight);
            images.forEach(img => data.append('images', img));

            const res = await createOrder(data);

            // Go to success page, passing the created order as route state
            navigate('/order-success', { state: { order: res.data.data } });
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating order');
        } finally {
            setLoading(false);
        }
    };

    const SectionHeader = ({ icon, title }) => (
        <div className="d-flex align-items-center gap-2 mb-3">
            <div style={{ width: 32, height: 32, background: 'rgba(13,31,79,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d1f4f' }}>
                {icon}
            </div>
            <h6 className="fw-bold mb-0" style={{ color: '#0d1f4f' }}>{title}</h6>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-7">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-1" style={{ color: '#0d1f4f' }}>Create New Order</h5>
                                <p className="text-muted mb-4 small">Fill in the details below to place a delivery order.</p>

                                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                                <form onSubmit={handleSubmit}>

                                    {/* Pickup Address */}
                                    <div className="mb-3">
                                        <SectionHeader icon={<MapPin size={16} />} title="Pickup Address" />
                                        <div className="row g-2">
                                            <div className="col-8">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pickupStreet"
                                                    placeholder="Street address"
                                                    value={formData.pickupStreet}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderRadius: 10 }}
                                                />
                                            </div>
                                            <div className="col-4">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pickupCity"
                                                    placeholder="City"
                                                    value={formData.pickupCity}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderRadius: 10 }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    <div className="mb-3">
                                        <SectionHeader icon={<Flag size={16} />} title="Delivery Address" />
                                        <div className="row g-2">
                                            <div className="col-8">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="deliveryStreet"
                                                    placeholder="Street address"
                                                    value={formData.deliveryStreet}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderRadius: 10 }}
                                                />
                                            </div>
                                            <div className="col-4">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="deliveryCity"
                                                    placeholder="City"
                                                    value={formData.deliveryCity}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderRadius: 10 }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Package Details */}
                                    <div className="mb-3">
                                        <SectionHeader icon={<Package size={16} />} title="Package Details" />
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            name="packageDescription"
                                            placeholder="Describe the package (e.g. Fragile electronics)"
                                            value={formData.packageDescription}
                                            onChange={handleChange}
                                            style={{ borderRadius: 10 }}
                                        />
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="weight"
                                            placeholder="Weight in kg"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            min="0.1"
                                            step="0.1"
                                            required
                                            style={{ borderRadius: 10 }}
                                        />
                                        <div className="form-text">Price is calculated based on weight.</div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="mb-4">
                                        <SectionHeader icon={<Camera size={16} />} title="Package Photos (optional, max 2)" />

                                        {images.length < 2 && (
                                            <label
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    border: '2px dashed #dde2ef',
                                                    borderRadius: 12,
                                                    padding: '1.5rem',
                                                    cursor: 'pointer',
                                                    background: '#f8faff',
                                                    marginBottom: '0.75rem',
                                                    transition: 'border-color 0.2s',
                                                }}
                                                onMouseOver={e => e.currentTarget.style.borderColor = '#0d1f4f'}
                                                onMouseOut={e => e.currentTarget.style.borderColor = '#dde2ef'}
                                            >
                                                <Camera size={32} color="#aab0c0" />
                                                <span style={{ fontSize: '0.85rem', color: '#6b7a99' }}>
                                                    Click to upload {images.length === 1 ? '1 more photo' : 'up to 2 photos'}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: '#aab0c0' }}>
                                                    JPG, PNG or WEBP — max 5MB each
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    multiple
                                                    onChange={handleImageChange}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                        )}

                                        {previews.length > 0 && (
                                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                {previews.map((src, i) => (
                                                    <div key={i} style={{ position: 'relative' }}>
                                                        <img
                                                            src={src}
                                                            alt={`Preview ${i + 1}`}
                                                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, border: '2px solid #dde2ef' }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(i)}
                                                            style={{
                                                                position: 'absolute', top: -6, right: -6,
                                                                background: '#e8610a', color: '#fff',
                                                                border: 'none', borderRadius: '50%',
                                                                width: 22, height: 22,
                                                                cursor: 'pointer',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            }}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <div className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate('/dashboard')}
                                            style={{ borderRadius: 10 }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn flex-grow-1 fw-bold"
                                            disabled={loading}
                                            style={{ background: '#0d1f4f', color: '#fff', borderRadius: 10 }}
                                        >
                                            {loading && <span className="spinner-border spinner-border-sm me-2" />}
                                            {loading ? 'Placing Order...' : 'Place Order'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateOrder;