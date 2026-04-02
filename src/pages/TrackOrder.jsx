import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Package, MapPin, Search, CheckCircle, Truck, Clock, XCircle, Flag } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:7001/api/v1';

const statusConfig = {
    'pending': { color: '#f5a623', label: 'Pending', icon: <Clock size={18} />, step: 0 },
    'assigned': { color: '#0d6efd', label: 'Assigned', icon: <Truck size={18} />, step: 1 },
    'picked-up': { color: '#0d6efd', label: 'Picked Up', icon: <Package size={18} />, step: 2 },
    'in-transit': { color: '#e8610a', label: 'In Transit', icon: <Truck size={18} />, step: 3 },
    'delivered': { color: '#198754', label: 'Delivered', icon: <CheckCircle size={18} />, step: 4 },
    'confirmed': { color: '#198754', label: 'Confirmed', icon: <CheckCircle size={18} />, step: 4 },
    'cancelled': { color: '#dc3545', label: 'Cancelled', icon: <XCircle size={18} />, step: -1 },
};

const steps = ['Pending', 'Assigned', 'Picked Up', 'In Transit', 'Delivered'];

const TrackOrder = () => {
    const { trackingNumber: paramTracking } = useParams();
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState(paramTracking || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchOrder = async (tn) => {
        if (!tn?.trim()) return;
        setLoading(true);
        setError('');
        setOrder(null);
        try {
            const res = await axios.get(`${API_BASE}/track/${tn.trim()}`);
            setOrder(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'No order found with that tracking number.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch if tracking number is in the URL
    useEffect(() => {
        if (paramTracking) fetchOrder(paramTracking);
    }, [paramTracking]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed) return;
        navigate(`/track/${trimmed}`);
    };

    const status = order ? statusConfig[order.status] : null;
    const currentStep = status?.step ?? -1;

    return (
        <>
            {/* Simple navbar */}
            <nav style={{ backgroundColor: '#0a1a3f', padding: '0.75rem 0' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <Link to="/" className="d-flex align-items-center text-decoration-none gap-2">
                        <img src={logo} alt="Logo" width="36" height="36" />
                        <span className="fw-bold text-white">LOVELISTICS</span>
                    </Link>
                    <div className="d-flex gap-2">
                        <Link to="/login" className="btn btn-sm btn-outline-light" style={{ borderRadius: 8 }}>Login</Link>
                        <Link to="/register" className="btn btn-sm fw-semibold" style={{ background: '#fdb813', color: '#0a1a3f', borderRadius: 8, border: 'none' }}>Sign Up</Link>
                    </div>
                </div>
            </nav>

            <div style={{ background: '#f4f6fb', minHeight: 'calc(100vh - 56px)' }} className="py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-7">

                            {/* Search card */}
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-1" style={{ color: '#0a1a3f' }}>Track Your Package</h5>
                                    <p className="text-muted small mb-3">Enter your tracking number to see the latest status of your delivery.</p>

                                    <form onSubmit={handleSubmit}>
                                        <div className="d-flex gap-2">
                                            <div className="position-relative flex-grow-1">
                                                <Package size={16} style={{
                                                    position: 'absolute', left: '0.9rem',
                                                    top: '50%', transform: 'translateY(-50%)',
                                                    color: '#6b7a99', pointerEvents: 'none'
                                                }} />
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={inputValue}
                                                    onChange={e => setInputValue(e.target.value)}
                                                    placeholder="e.g. TRK-8842"
                                                    style={{ paddingLeft: '2.5rem', borderRadius: 10 }}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={loading}  // ← add this
                                                className="btn fw-bold d-flex align-items-center gap-2"
                                                style={{ background: '#0a1a3f', color: '#fff', borderRadius: 10, whiteSpace: 'nowrap', opacity: loading ? 0.7 : 1 }}
                                            >
                                                {loading ? <span className="spinner-border spinner-border-sm" /> : <Search size={15} />}
                                                {loading ? 'Searching...' : 'Track'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Loading */}
                            {loading && (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: '#0a1a3f' }} />
                                    <p className="text-muted mt-3 small">Looking up your order...</p>
                                </div>
                            )}

                            {/* Error */}
                            {error && !loading && (
                                <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
                                    <div className="card-body p-4 text-center">
                                        <div style={{
                                            width: 60, height: 60, background: '#fff0f0',
                                            borderRadius: '50%', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', margin: '0 auto 1rem'
                                        }}>
                                            <XCircle size={28} color="#dc3545" />
                                        </div>
                                        <h6 className="fw-bold" style={{ color: '#0a1a3f' }}>Order Not Found</h6>
                                        <p className="text-muted small mb-0">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Result */}
                            {order && !loading && (
                                <>
                                    {/* Header */}
                                    <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 16 }}>
                                        <div className="card-body p-4 d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="text-muted small mb-1">Tracking Number</p>
                                                <h5 className="fw-bold mb-0" style={{ color: '#0a1a3f' }}>#{order.trackingNumber}</h5>
                                                <small className="text-muted">Placed {new Date(order.createdAt).toLocaleDateString('en-GB')}</small>
                                            </div>
                                            <span
                                                className="badge d-flex align-items-center gap-1 px-3 py-2"
                                                style={{ background: status?.color, color: '#fff', borderRadius: 10, fontSize: '0.85rem' }}
                                            >
                                                {status?.icon} {status?.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress tracker */}
                                    {order.status !== 'cancelled' && (
                                        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 16 }}>
                                            <div className="card-body p-4">
                                                <h6 className="fw-bold mb-4" style={{ color: '#0a1a3f' }}>Delivery Progress</h6>
                                                <div className="d-flex align-items-center justify-content-between position-relative">
                                                    {/* Progress line */}
                                                    <div style={{
                                                        position: 'absolute', top: 16, left: '10%', right: '10%',
                                                        height: 3, background: '#e8edf7', zIndex: 0, borderRadius: 4
                                                    }} />
                                                    <div style={{
                                                        position: 'absolute', top: 16, left: '10%',
                                                        width: `${Math.max(0, (currentStep / (steps.length - 1)) * 80)}%`,
                                                        height: 3, background: '#198754', zIndex: 1, borderRadius: 4,
                                                        transition: 'width 0.4s ease'
                                                    }} />

                                                    {steps.map((step, i) => {
                                                        const done = i < currentStep;
                                                        const active = i === currentStep;
                                                        return (
                                                            <div key={i} className="d-flex flex-column align-items-center" style={{ zIndex: 2, flex: 1 }}>
                                                                <div style={{
                                                                    width: 32, height: 32, borderRadius: '50%',
                                                                    background: done || active ? '#198754' : '#e8edf7',
                                                                    border: active ? '3px solid #0a1a3f' : 'none',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    boxShadow: active ? '0 0 0 4px rgba(13,31,79,0.15)' : 'none',
                                                                }}>
                                                                    {done ? <CheckCircle size={16} color="#fff" /> :
                                                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: active ? '#fff' : '#c0c8d8' }} />
                                                                    }
                                                                </div>
                                                                <span className="mt-2 text-center" style={{
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: active ? '700' : '500',
                                                                    color: active ? '#0a1a3f' : done ? '#198754' : '#9aa5b8',
                                                                    maxWidth: 60,
                                                                }}>
                                                                    {step}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Cancelled banner */}
                                    {order.status === 'cancelled' && (
                                        <div className="alert border-0 mb-3 d-flex align-items-center gap-2" style={{ background: '#fff0f0', borderRadius: 12, color: '#dc3545' }}>
                                            <XCircle size={20} />
                                            <span className="fw-semibold small">This order has been cancelled.</span>
                                        </div>
                                    )}

                                    {/* Route */}
                                    <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 16 }}>
                                        <div className="card-body p-4">
                                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0a1a3f' }}>
                                                <MapPin size={16} /> Delivery Route
                                            </h6>
                                            <div className="d-flex gap-3">
                                                <div className="flex-fill p-3 rounded" style={{ background: '#f4f6fb' }}>
                                                    <small className="text-muted d-block mb-1" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Pickup</small>
                                                    <p className="mb-0 fw-semibold small">{order.pickupAddress?.street}</p>
                                                    <small className="text-muted">{order.pickupAddress?.city}</small>
                                                </div>
                                                <div className="d-flex align-items-center text-muted">→</div>
                                                <div className="flex-fill p-3 rounded" style={{ background: '#f4f6fb' }}>
                                                    <small className="text-muted d-block mb-1" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Delivery</small>
                                                    <p className="mb-0 fw-semibold small">{order.deliveryAddress?.street}</p>
                                                    <small className="text-muted">{order.deliveryAddress?.city}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Package & Driver */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                                                <div className="card-body p-4">
                                                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0a1a3f' }}>
                                                        <Package size={16} /> Package
                                                    </h6>
                                                    <p className="mb-1 small"><strong>Weight:</strong> {order.weight} kg</p>
                                                    <p className="mb-0 small fw-bold" style={{ color: '#e8610a' }}>
                                                        Fee: &#8358;{order.price?.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                                                <div className="card-body p-4">
                                                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0a1a3f' }}>
                                                        <Truck size={16} /> Driver
                                                    </h6>
                                                    {order.driver ? (
                                                        <p className="mb-0 small"><strong>{order.driver.fullName}</strong></p>
                                                    ) : (
                                                        <p className="text-muted small mb-0">No driver assigned yet</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Login prompt */}
                                    <div className="card border-0 shadow-sm" style={{ borderRadius: 16, borderLeft: '4px solid #fdb813' }}>
                                        <div className="card-body p-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
                                            <div>
                                                <p className="fw-bold mb-1 small" style={{ color: '#0a1a3f' }}>Want full tracking details?</p>
                                                <p className="text-muted small mb-0">Login to view live GPS location, photos, and manage your order.</p>
                                            </div>
                                            <Link to="/login" className="btn fw-bold" style={{ background: '#0a1a3f', color: '#fff', borderRadius: 10, whiteSpace: 'nowrap' }}>
                                                Login →
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TrackOrder;