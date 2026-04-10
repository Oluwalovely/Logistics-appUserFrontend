import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import Navbar from '../components/Navbar';
import { MapPin, Flag, Package, Camera, X, User, Phone, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = [
    { label: 'Sender', icon: <MapPin size={14} /> },
    { label: 'Receiver', icon: <Flag size={14} /> },
    { label: 'Package', icon: <Package size={14} /> },
];

const CreateOrder = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        senderName: '', senderPhone: '',
        pickupStreet: '', pickupCity: '',
        receiverName: '', receiverPhone: '',
        deliveryStreet: '', deliveryCity: '',
        packageDescription: '', weight: '',
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
        setPreviews(combined.map(f => URL.createObjectURL(f)));
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    // Per-step validation
    const validateStep = () => {
        if (step === 0) {
            if (!formData.senderName.trim()) return 'Sender name is required.';
            if (!formData.senderPhone.trim()) return 'Sender phone is required.';
            if (!formData.pickupStreet.trim()) return 'Pickup street is required.';
            if (!formData.pickupCity.trim()) return 'Pickup city is required.';
        }
        if (step === 1) {
            if (!formData.receiverName.trim()) return 'Receiver name is required.';
            if (!formData.receiverPhone.trim()) return 'Receiver phone is required.';
            if (!formData.deliveryStreet.trim()) return 'Delivery street is required.';
            if (!formData.deliveryCity.trim()) return 'Delivery city is required.';
        }
        if (step === 2) {
            if (!formData.weight) return 'Package weight is required.';
        }
        return '';
    };

    const handleNext = () => {
        const err = validateStep();
        if (err) { setError(err); return; }
        setError('');
        setStep(s => s + 1);
    };

    const handleBack = () => {
        setError('');
        setStep(s => s - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validateStep();
        if (err) { setError(err); return; }
        setLoading(true);
        setError('');
        try {
            const data = new FormData();
            data.append('pickupAddress', JSON.stringify({
                street: formData.pickupStreet, city: formData.pickupCity,
                senderName: formData.senderName, senderPhone: formData.senderPhone,
            }));
            data.append('deliveryAddress', JSON.stringify({
                street: formData.deliveryStreet, city: formData.deliveryCity,
                receiverName: formData.receiverName, receiverPhone: formData.receiverPhone,
            }));
            data.append('packageDescription', formData.packageDescription);
            data.append('weight', formData.weight);
            images.forEach(img => data.append('images', img));
            const res = await createOrder(data);
            navigate('/order-success', { state: { order: res.data.data } });
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating order');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { borderRadius: 10 };

    const HelperText = ({ text }) => (
        <div className="form-text" style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem' }}>{text}</div>
    );

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

                                {/* Step Indicator */}
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                                    {STEPS.map((s, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: '50%',
                                                    background: i < step ? '#16a34a' : i === step ? '#0d1f4f' : '#e5e7eb',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: i <= step ? '#fff' : '#94a3b8',
                                                    transition: 'background 0.2s',
                                                    flexShrink: 0,
                                                }}>
                                                    {i < step
                                                        ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                        : s.icon
                                                    }
                                                </div>
                                                <span style={{ fontSize: '0.7rem', fontWeight: i === step ? 700 : 500, color: i === step ? '#0d1f4f' : '#94a3b8', whiteSpace: 'nowrap' }}>
                                                    {s.label}
                                                </span>
                                            </div>
                                            {i < STEPS.length - 1 && (
                                                <div style={{ flex: 1, height: 2, background: i < step ? '#16a34a' : '#e5e7eb', margin: '0 6px', marginBottom: '1.2rem', transition: 'background 0.2s' }} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                                <form onSubmit={handleSubmit}>

                                    {/* Step 0 — Sender & Pickup */}
                                    {step === 0 && (
                                        <div>
                                            <SectionHeader icon={<MapPin size={16} />} title="Sender & Pickup" />
                                            <div className="row g-2 mb-2 flex-wrap">
                                                <div className="col-7">
                                                    <div className="input-group">
                                                        <span className="input-group-text" style={{ borderRadius: '10px 0 0 10px', background: '#f4f6fb', border: '1px solid #dee2e6' }}>
                                                            <User size={14} color="#94a3b8" />
                                                        </span>
                                                        <input type="text" className="form-control" name="senderName"
                                                            placeholder="e.g. Chidi Okeke"
                                                            value={formData.senderName} onChange={handleChange}
                                                            style={{ borderRadius: '0 10px 10px 0' }} />
                                                    </div>
                                                    <HelperText text="Full name of the person sending the package" />
                                                </div>
                                                <div className="col-5">
                                                    <div className="input-group">
                                                        <span className="input-group-text" style={{ borderRadius: '10px 0 0 10px', background: '#f4f6fb', border: '1px solid #dee2e6' }}>
                                                            <Phone size={14} color="#94a3b8" />
                                                        </span>
                                                        <input type="tel" className="form-control" name="senderPhone"
                                                            placeholder="e.g. 08012345678"
                                                            value={formData.senderPhone} onChange={handleChange}
                                                            style={{ borderRadius: '0 10px 10px 0' }} />
                                                    </div>
                                                    <HelperText text="Active Nigerian number" />
                                                </div>
                                            </div>
                                            <div className="row g-2 mb-1 flex-wrap">
                                                <div className="col-8">
                                                    <input type="text" className="form-control" name="pickupStreet"
                                                        placeholder="e.g. 12 Awolowo Road"
                                                        value={formData.pickupStreet} onChange={handleChange}
                                                        style={inputStyle} />
                                                    <HelperText text="Street address where driver will pick up" />
                                                </div>
                                                <div className="col-4">
                                                    <input type="text" className="form-control" name="pickupCity"
                                                        placeholder="e.g. Osogbo"
                                                        value={formData.pickupCity} onChange={handleChange}
                                                        style={inputStyle} />
                                                    <HelperText text="City" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 1 — Receiver & Delivery */}
                                    {step === 1 && (
                                        <div>
                                            <SectionHeader icon={<Flag size={16} />} title="Receiver & Delivery" />
                                            <div className="row g-2 mb-2 flex-wrap">
                                                <div className="col-7">
                                                    <div className="input-group">
                                                        <span className="input-group-text" style={{ borderRadius: '10px 0 0 10px', background: '#f4f6fb', border: '1px solid #dee2e6' }}>
                                                            <User size={14} color="#94a3b8" />
                                                        </span>
                                                        <input type="text" className="form-control" name="receiverName"
                                                            placeholder="e.g. Amaka Nwosu"
                                                            value={formData.receiverName} onChange={handleChange}
                                                            style={{ borderRadius: '0 10px 10px 0' }} />
                                                    </div>
                                                    <HelperText text="Full name of the person receiving the package" />
                                                </div>
                                                <div className="col-5">
                                                    <div className="input-group">
                                                        <span className="input-group-text" style={{ borderRadius: '10px 0 0 10px', background: '#f4f6fb', border: '1px solid #dee2e6' }}>
                                                            <Phone size={14} color="#94a3b8" />
                                                        </span>
                                                        <input type="tel" className="form-control" name="receiverPhone"
                                                            placeholder="e.g. 08087654321"
                                                            value={formData.receiverPhone} onChange={handleChange}
                                                            style={{ borderRadius: '0 10px 10px 0' }} />
                                                    </div>
                                                    <HelperText text="Driver will contact on arrival" />
                                                </div>
                                            </div>
                                            <div className="row g-2 mb-1 flex-wrap">
                                                <div className="col-8">
                                                    <input type="text" className="form-control" name="deliveryStreet"
                                                        placeholder="e.g. 7 Gbongan Road"
                                                        value={formData.deliveryStreet} onChange={handleChange}
                                                        style={inputStyle} />
                                                    <HelperText text="Street address where driver will deliver" />
                                                </div>
                                                <div className="col-4">
                                                    <input type="text" className="form-control" name="deliveryCity"
                                                        placeholder="e.g. Ibadan"
                                                        value={formData.deliveryCity} onChange={handleChange}
                                                        style={inputStyle} />
                                                    <HelperText text="City" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2 — Package Details */}
                                    {step === 2 && (
                                        <div>
                                            <SectionHeader icon={<Package size={16} />} title="Package Details" />
                                            <input type="text" className="form-control mb-1" name="packageDescription"
                                                placeholder="e.g. Fragile electronics, sealed envelope, clothing"
                                                value={formData.packageDescription} onChange={handleChange}
                                                style={inputStyle} />
                                            <HelperText text="Brief description helps the driver handle it correctly (optional)" />

                                            <div className="mt-3">
                                                <input type="number" className="form-control mb-1" name="weight"
                                                    placeholder="e.g. 1.5"
                                                    value={formData.weight} onChange={handleChange}
                                                    min="0.1" step="0.1"
                                                    style={inputStyle} />
                                                <HelperText text="Weight in kg — used to calculate your delivery fee" />
                                            </div>

                                            {/* Image Upload */}
                                            <div className="mt-4">
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <div style={{ width: 32, height: 32, background: 'rgba(13,31,79,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d1f4f' }}>
                                                        <Camera size={16} />
                                                    </div>
                                                    <h6 className="fw-bold mb-0" style={{ color: '#0d1f4f' }}>Package Photos <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.8rem' }}>(optional, max 2)</span></h6>
                                                </div>
                                                <HelperText text="Add photos to help the driver identify the package at pickup" />

                                                {images.length < 2 && (
                                                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: '2px dashed #dde2ef', borderRadius: 12, padding: '1.5rem', cursor: 'pointer', background: '#f8faff', marginTop: '0.75rem', marginBottom: '0.75rem', transition: 'border-color 0.2s' }}
                                                        onMouseOver={e => e.currentTarget.style.borderColor = '#0d1f4f'}
                                                        onMouseOut={e => e.currentTarget.style.borderColor = '#dde2ef'}>
                                                        <Camera size={32} color="#aab0c0" />
                                                        <span style={{ fontSize: '0.85rem', color: '#6b7a99' }}>
                                                            Click to upload {images.length === 1 ? '1 more photo' : 'up to 2 photos'}
                                                        </span>
                                                        <span style={{ fontSize: '0.75rem', color: '#aab0c0' }}>JPG, PNG or WEBP — max 5MB each</span>
                                                        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                                                    </label>
                                                )}

                                                {previews.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                        {previews.map((src, i) => (
                                                            <div key={i} style={{ position: 'relative' }}>
                                                                <img src={src} alt={`Preview ${i + 1}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, border: '2px solid #dde2ef' }} />
                                                                <button type="button" onClick={() => removeImage(i)}
                                                                    style={{ position: 'absolute', top: -6, right: -6, background: '#e8610a', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <X size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Buttons */}
                                    <div className="d-flex gap-2 mt-4">
                                        {step === 0 ? (
                                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')} style={{ borderRadius: 10 }}>
                                                Cancel
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-outline-secondary d-flex align-items-center gap-1" onClick={handleBack} style={{ borderRadius: 10 }}>
                                                <ChevronLeft size={15} /> Back
                                            </button>
                                        )}

                                        {step < STEPS.length - 1 ? (
                                            <button type="button" className="btn flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-1" onClick={handleNext} style={{ background: '#0d1f4f', color: '#fff', borderRadius: 10 }}>
                                                Next <ChevronRight size={15} />
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn flex-grow-1 fw-bold" disabled={loading} style={{ background: '#0d1f4f', color: '#fff', borderRadius: 10 }}>
                                                {loading && <span className="spinner-border spinner-border-sm me-2" />}
                                                {loading ? 'Placing Order...' : 'Place Order'}
                                            </button>
                                        )}
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