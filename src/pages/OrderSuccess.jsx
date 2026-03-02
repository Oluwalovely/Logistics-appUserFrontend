import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Copy, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state?.order;
    const [copied, setCopied] = useState(false);
    const [countdown, setCountdown] = useState(10);

    // Redirect to order details after 10 seconds
    useEffect(() => {
        if (!order) {
            navigate('/dashboard');
            return;
        }
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate(`/orders/${order._id}`);
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [order]);

    const handleCopy = () => {
        navigator.clipboard.writeText(order.trackingNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!order) return null;

    return (
        <>
            <Navbar />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">

                        {/* Success card */}
                        <div className="card border-0 shadow-sm text-center" style={{ borderRadius: 20, overflow: 'hidden' }}>

                            {/* Green top strip */}
                            <div style={{ background: '#198754', padding: '2rem 1rem 3rem' }}>
                                <div style={{
                                    width: 72, height: 72,
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                }}>
                                    <CheckCircle size={40} color="#fff" />
                                </div>
                                <h4 className="fw-bold text-white mb-1">Order Placed!</h4>
                                <p className="text-white mb-0" style={{ opacity: 0.85, fontSize: '0.9rem' }}>
                                    Your delivery request has been received.
                                </p>
                            </div>

                            <div className="card-body p-4">

                                {/* Tracking number */}
                                <p className="text-muted small mb-2">Your Tracking Number</p>
                                <div
                                    className="d-flex align-items-center justify-content-center gap-2 mb-4 p-3"
                                    style={{ background: '#f4f6fb', borderRadius: 12 }}
                                >
                                    <Package size={18} color="#0d1f4f" />
                                    <span className="fw-bold fs-5" style={{ color: '#0d1f4f', letterSpacing: 1 }}>
                                        #{order.trackingNumber}
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className="btn btn-sm d-flex align-items-center gap-1"
                                        style={{
                                            background: copied ? '#198754' : '#e8edf7',
                                            color: copied ? '#fff' : '#0d1f4f',
                                            borderRadius: 8,
                                            fontSize: '0.75rem',
                                            padding: '4px 10px',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <Copy size={12} />
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>

                                {/* Order summary */}
                                <div className="text-start mb-4">
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <span className="text-muted small">Pickup</span>
                                        <span className="small fw-semibold">{order.pickupAddress?.street}, {order.pickupAddress?.city}</span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <span className="text-muted small">Delivery</span>
                                        <span className="small fw-semibold">{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <span className="text-muted small">Weight</span>
                                        <span className="small fw-semibold">{order.weight} kg</span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2">
                                        <span className="text-muted small">Total Fee</span>
                                        <span className="fw-bold" style={{ color: '#e8610a' }}>
                                            &#8358;{order.price?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Auto redirect notice */}
                                <p className="text-muted small mb-3">
                                    Redirecting to order details in <strong>{countdown}</strong> seconds...
                                </p>

                                {/* Action buttons */}
                                <div className="d-flex flex-column gap-2">
                                    <button
                                        className="btn fw-bold d-flex align-items-center justify-content-center gap-2"
                                        style={{ background: '#0d1f4f', color: '#fff', borderRadius: 10 }}
                                        onClick={() => navigate(`/orders/${order._id}`)}
                                    >
                                        View Order Details <ArrowRight size={16} />
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        style={{ borderRadius: 10 }}
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        Back to Dashboard
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderSuccess;