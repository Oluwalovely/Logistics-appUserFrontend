import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Package, Camera, Radio, Car, XCircle, CheckCircle, Trash2 } from 'lucide-react';
import { getOrderById, confirmDelivery, cancelOrder, getLatestLocation, deleteOrder } from '../services/api';
import Navbar from '../components/Navbar';

const statusColor = {
    'pending':    '#f5a623',
    'assigned':   '#0d6efd',
    'picked-up':  '#0d6efd',
    'in-transit': '#e8610a',
    'delivered':  '#198754',
    'confirmed':  '#198754',
    'cancelled':  '#dc3545',
};

const statusSteps = ['pending', 'assigned', 'picked-up', 'in-transit', 'delivered', 'confirmed'];

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [lightboxImg, setLightboxImg] = useState(null);

    const fetchOrder = async () => {
        try {
            const res = await getOrderById(orderId);
            setOrder(res.data.data);
        } catch (err) {
            setError('Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    const fetchLocation = async () => {
        try {
            const res = await getLatestLocation(orderId);
            setLocation(res.data.data);
        } catch (err) {
            // No location yet — fine
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    useEffect(() => {
        if (!order) return;
        if (!['picked-up', 'in-transit'].includes(order.status)) return;
        fetchLocation();
        const interval = setInterval(fetchLocation, 5000);
        return () => clearInterval(interval);
    }, [order?.status]);

    const handleConfirm = async () => {
        setConfirming(true);
        setError('');
        try {
            await confirmDelivery(orderId);
            setMessage('Delivery confirmed! Thank you.');
            fetchOrder();
        } catch (err) {
            setError(err.response?.data?.message || 'Error confirming delivery');
        } finally {
            setConfirming(false);
        }
    };

    const handleCancel = async () => {
        setCancelling(true);
        setError('');
        try {
            await cancelOrder(orderId);
            setMessage('Order cancelled successfully.');
            fetchOrder();
        } catch (err) {
            setError(err.response?.data?.message || 'Error cancelling order');
        } finally {
            setCancelling(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteOrder(orderId);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting order');
            setDeleting(false);
        }
    };

    const currentStep = statusSteps.indexOf(order?.status);

    if (loading) return (
        <>
            <Navbar />
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <div className="spinner-border" style={{ color: '#0d1f4f' }} />
            </div>
        </>
    );

    if (error && !order) return (
        <>
            <Navbar />
            <div className="container py-4">
                <div className="alert alert-danger">{error}</div>
            </div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">

                        <button className="btn btn-link p-0 mb-3 text-muted" onClick={() => navigate('/dashboard')}>
                            ← Back to Orders
                        </button>

                        {message && <div className="alert alert-success py-2 small">{message}</div>}
                        {error && <div className="alert alert-danger py-2 small">{error}</div>}

                        {/* Header */}
                        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold mb-0" style={{ color: '#0d1f4f' }}>
                                        #{order.trackingNumber}
                                    </h5>
                                    <small className="text-muted">
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-GB')}
                                    </small>
                                </div>
                                <span className="badge fs-6" style={{ background: statusColor[order.status], color: '#fff' }}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Progress steps */}
                        {order.status !== 'cancelled' && (
                            <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
                                <div className="card-body">
                                    <h6 className="fw-bold mb-3" style={{ color: '#0d1f4f' }}>Order Progress</h6>
                                    <div className="d-flex justify-content-between align-items-center">
                                        {statusSteps.map((step, index) => (
                                            <div key={step} className="text-center flex-fill">
                                                <div
                                                    className="rounded-circle mx-auto mb-1 d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: 30, height: 30,
                                                        background: index <= currentStep ? '#0d1f4f' : '#e8edf7',
                                                        color: index <= currentStep ? '#fff' : '#aab0c0',
                                                        fontSize: 11,
                                                        fontWeight: 'bold',
                                                        border: index === currentStep ? '2px solid #e8610a' : 'none',
                                                    }}
                                                >
                                                    {index < currentStep ? '✓' : index + 1}
                                                </div>
                                                <small
                                                    className="d-none d-md-block"
                                                    style={{
                                                        fontSize: 9,
                                                        color: index <= currentStep ? '#0d1f4f' : '#aab0c0',
                                                        textTransform: 'uppercase',
                                                    }}
                                                >
                                                    {step}
                                                </small>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Live location */}
                        {location && ['picked-up', 'in-transit'].includes(order.status) && (
                            <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14, borderLeft: '4px solid #e8610a' }}>
                                <div className="card-body">
                                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0d1f4f' }}>
                                        <Radio size={16} /> Driver Live Location
                                    </h6>
                                    <p className="mb-1 text-muted small">Lat: {location.location.lat}, Lng: {location.location.lng}</p>
                                    {location.speed && <p className="mb-1 text-muted small">Speed: {location.speed} km/h</p>}
                                    <p className="mb-2 text-muted small">
                                        Updated: {new Date(location.recordedAt).toLocaleTimeString()}
                                    </p>
                                    <a
                                        href={`https://www.google.com/maps?q=${location.location.lat},${location.location.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
                                        style={{ background: '#0d1f4f', color: '#fff', borderRadius: 8, width: 'fit-content' }}
                                    >
                                        <MapPin size={14} /> View on Google Maps
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Route */}
                        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
                            <div className="card-body">
                                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0d1f4f' }}>
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

                        {/* Package + Driver */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14 }}>
                                    <div className="card-body">
                                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0d1f4f' }}>
                                            <Package size={16} /> Package Details
                                        </h6>
                                        <p className="mb-1 text-muted small">Description</p>
                                        <p className="mb-2 small">{order.packageDescription || 'N/A'}</p>
                                        <p className="mb-1 text-muted small">Weight</p>
                                        <p className="mb-2 small">{order.weight} kg</p>
                                        <p className="mb-1 text-muted small">Price</p>
                                        <p className="mb-0 fw-bold" style={{ color: '#e8610a' }}>
                                            ₦{order.price?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14 }}>
                                    <div className="card-body">
                                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0d1f4f' }}>
                                            <Car size={16} /> Driver
                                        </h6>
                                        {order.driver ? (
                                            <>
                                                <p className="mb-1 text-muted small">Name</p>
                                                <p className="mb-2 small">{order.driver.fullName}</p>
                                                <p className="mb-1 text-muted small">Phone</p>
                                                <p className="mb-0 small">{order.driver.phone}</p>
                                            </>
                                        ) : (
                                            <p className="text-muted small">No driver assigned yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Package Images */}
                        {order.images && order.images.length > 0 && (
                            <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
                                <div className="card-body">
                                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0d1f4f' }}>
                                        <Camera size={16} /> Package Photos
                                    </h6>
                                    <div className="d-flex gap-3 flex-wrap">
                                        {order.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img.url}
                                                alt={`Package ${i + 1}`}
                                                onClick={() => setLightboxImg(img.url)}
                                                style={{
                                                    width: 120, height: 120,
                                                    objectFit: 'cover',
                                                    borderRadius: 10,
                                                    border: '2px solid #e8edf7',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.2s',
                                                }}
                                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="d-flex flex-column gap-2">
                            {order.status === 'delivered' && (
                                <button
                                    className="btn fw-bold d-flex align-items-center justify-content-center gap-2"
                                    style={{ background: '#198754', color: '#fff', borderRadius: 10 }}
                                    onClick={handleConfirm}
                                    disabled={confirming}
                                >
                                    {confirming
                                        ? <><span className="spinner-border spinner-border-sm" /> Confirming...</>
                                        : <><CheckCircle size={18} /> Confirm Delivery</>
                                    }
                                </button>
                            )}
                            {!['delivered', 'confirmed', 'cancelled'].includes(order.status) && (
                                <button
                                    className="btn btn-outline-danger"
                                    style={{ borderRadius: 10 }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#cancelModal"
                                >
                                    Cancel Order
                                </button>
                            )}
                            {['cancelled', 'confirmed'].includes(order.status) && (
                                <button
                                    className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2"
                                    style={{ borderRadius: 10 }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteModal"
                                >
                                    <Trash2 size={16} /> Delete Order
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Cancel Confirmation Modal ─────────────────────── */}
            <div className="modal fade" id="cancelModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0" style={{ borderRadius: 16 }}>
                        <div className="modal-body text-center p-4">
                            <div style={{
                                width: 60, height: 60,
                                background: '#fff0f0',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                            }}>
                                <XCircle size={30} color="#dc3545" />
                            </div>
                            <h5 className="fw-bold mb-2" style={{ color: '#0d1f4f' }}>Cancel Order?</h5>
                            <p className="text-muted small mb-4">
                                This action cannot be undone. The order will be permanently cancelled.
                            </p>
                            <div className="d-flex gap-2 justify-content-center">
                                <button
                                    className="btn btn-outline-secondary px-4"
                                    style={{ borderRadius: 10 }}
                                    data-bs-dismiss="modal"
                                >
                                    Go Back
                                </button>
                                <button
                                    className="btn btn-danger px-4 fw-bold"
                                    style={{ borderRadius: 10 }}
                                    data-bs-dismiss="modal"
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                >
                                    {cancelling && <span className="spinner-border spinner-border-sm me-2" />}
                                    {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Delete Confirmation Modal ─────────────────────── */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0" style={{ borderRadius: 16 }}>
                        <div className="modal-body text-center p-4">
                            <div style={{
                                width: 60, height: 60,
                                background: '#fff0f0',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                            }}>
                                <Trash2 size={30} color="#dc3545" />
                            </div>
                            <h5 className="fw-bold mb-2" style={{ color: '#0d1f4f' }}>Delete Order?</h5>
                            <p className="text-muted small mb-4">
                                This will permanently remove the order from your history. This cannot be undone.
                            </p>
                            <div className="d-flex gap-2 justify-content-center">
                                <button
                                    className="btn btn-outline-secondary px-4"
                                    style={{ borderRadius: 10 }}
                                    data-bs-dismiss="modal"
                                >
                                    Go Back
                                </button>
                                <button
                                    className="btn btn-danger px-4 fw-bold"
                                    style={{ borderRadius: 10 }}
                                    data-bs-dismiss="modal"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting && <span className="spinner-border spinner-border-sm me-2" />}
                                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Lightbox ───────────────────────────────────────── */}
            {lightboxImg && (
                <div
                    onClick={() => setLightboxImg(null)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        cursor: 'zoom-out',
                    }}
                >
                    <img
                        src={lightboxImg}
                        alt="Full size"
                        style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
                    />
                </div>
            )}
        </>
    );
};

export default OrderDetails;