import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/api';
import Navbar from '../components/Navbar';
import {
    Package, Clock, Zap, CheckCircle,
    MapPin, Flag, Car, PlusCircle
} from 'lucide-react';

const THEME = {
    primary: '#0d1f4f',
    secondary: '#e8610a',
    accent: '#f5a623',
    success: '#198754',
};

const statusStyles = {
    'pending':    { bg: '#fff8e1', text: '#856404', border: '#ffeeba' },
    'assigned':   { bg: '#e7f1ff', text: '#0d1f4f', border: '#b6d4fe' },
    'picked-up':  { bg: '#e7f1ff', text: '#0d1f4f', border: '#b6d4fe' },
    'in-transit': { bg: '#fff0e0', text: '#e8610a', border: '#ffcca0' },
    'delivered':  { bg: '#d1e7dd', text: '#0f5132', border: '#badbcc' },
    'confirmed':  { bg: '#d1e7dd', text: '#0f5132', border: '#badbcc' },
    'cancelled':  { bg: '#f8d7da', text: '#842029', border: '#f5c2c7' },
};

const CardStyle = {
    background: '#fff',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    overflow: 'hidden',
};

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({ title, count, icon, color }) => (
    <div className="card h-100" style={{ ...CardStyle, borderLeft: `5px solid ${color}` }}>
        <div className="card-body d-flex align-items-center justify-content-between p-4">
            <div>
                <p className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                    {title}
                </p>
                <h2 className="fw-bold mb-0" style={{ color: THEME.primary }}>{count}</h2>
            </div>
            <div style={{
                width: 50, height: 50,
                background: `${color}20`,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
            }}>
                {icon}
            </div>
        </div>
    </div>
);

// ─── Order Card ───────────────────────────────────────────────
const OrderCard = ({ order }) => {
    const status = statusStyles[order.status] || { bg: '#f8f9fa', text: '#333', border: '#dee2e6' };

    return (
        <div className="card h-100" style={CardStyle}>
            {/* Header */}
            <div className="card-header border-0 bg-white pt-3 pb-0 px-3 d-flex justify-content-between align-items-center">
                <span className="badge rounded-pill fw-normal"
                    style={{ background: '#f0f2f5', color: THEME.primary, padding: '6px 12px', fontSize: '0.8rem' }}>
                    #{order.trackingNumber}
                </span>
                <span className="badge rounded-pill"
                    style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}`, padding: '6px 12px', fontSize: '0.75rem' }}>
                    {order.status.toUpperCase()}
                </span>
            </div>

            <div className="card-body px-3 pt-3 pb-3">
                {/* Route Visualization */}
                <div className="d-flex align-items-start gap-3 mb-3">
                    <div className="d-flex flex-column align-items-center" style={{ marginTop: 4 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: THEME.secondary }} />
                        <div style={{ width: 2, height: 30, background: '#dee2e6' }} />
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: THEME.success }} />
                    </div>
                    <div className="w-100">
                        <div className="mb-3">
                            <p className="mb-0 text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                <MapPin size={11} /> Pickup
                            </p>
                            <p className="fw-semibold mb-0 text-truncate" style={{ color: THEME.primary, maxWidth: 200, fontSize: '0.875rem' }}>
                                {order.pickupAddress?.street}, {order.pickupAddress?.city}
                            </p>
                        </div>
                        <div>
                            <p className="mb-0 text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                <Flag size={11} /> Delivery
                            </p>
                            <p className="fw-semibold mb-0 text-truncate" style={{ color: THEME.primary, maxWidth: 200, fontSize: '0.875rem' }}>
                                {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Driver */}
                {order.driver && (
                    <div className="d-flex align-items-center gap-2 p-2 rounded mb-3" style={{ background: '#f8f9fa' }}>
                        <div style={{ width: 30, height: 30, background: '#e9ecef', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: THEME.primary }}>
                            <Car size={15} />
                        </div>
                        <div className="lh-1">
                            <p className="mb-0 fw-semibold" style={{ fontSize: '0.85rem' }}>{order.driver.fullName}</p>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>Driver</small>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="card-footer bg-white border-0 px-3 pb-3 pt-0 d-flex justify-content-between align-items-center">
                <p className="mb-0 fw-bold" style={{ color: THEME.secondary, fontSize: '1.1rem' }}>
                    ₦{order.price?.toLocaleString()}
                </p>
                <Link to={`/orders/${order._id}`} className="btn btn-sm fw-semibold"
                    style={{ background: THEME.primary, color: '#fff', borderRadius: 8, padding: '6px 16px' }}>
                    Details
                </Link>
            </div>
        </div>
    );
};

// ─── Dashboard ────────────────────────────────────────────────
const Dashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getMyOrders(user._id);
                setOrders(res.data.data);
            } catch (err) {
                setError('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        if (user?._id) fetchOrders();
    }, [user]);

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        active: orders.filter(o => ['assigned', 'picked-up', 'in-transit'].includes(o.status)).length,
        delivered: orders.filter(o => ['delivered', 'confirmed'].includes(o.status)).length,
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6f9' }}>
            <Navbar />
            <div className="container py-5">

                {/* Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: THEME.primary }}>Dashboard</h2>
                        <p className="text-muted mb-0">
                            Welcome back, <span className="fw-semibold text-dark">{user?.fullName}</span>! Here's your delivery overview.
                        </p>
                    </div>
                    <Link to="/create-order" className="btn d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
                        style={{ background: THEME.secondary, color: '#fff', borderRadius: 10, fontWeight: 600 }}>
                        <PlusCircle size={18} /> New Order
                    </Link>
                </div>

                {/* Stats */}
                <div className="row g-4 mb-5">
                    <div className="col-12 col-sm-6 col-lg-3">
                        <StatCard title="Total Orders" count={stats.total} color={THEME.primary} icon={<Package size={24} />} />
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <StatCard title="Pending" count={stats.pending} color={THEME.accent} icon={<Clock size={24} />} />
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <StatCard title="Active" count={stats.active} color={THEME.secondary} icon={<Zap size={24} />} />
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <StatCard title="Delivered" count={stats.delivered} color={THEME.success} icon={<CheckCircle size={24} />} />
                    </div>
                </div>

                {/* Orders */}
                <h4 className="fw-bold mb-4" style={{ color: THEME.primary }}>Recent Orders</h4>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: THEME.primary }} />
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-5 card shadow-sm border-0" style={{ borderRadius: 16 }}>
                        <Package size={48} color="#dde2ef" className="mx-auto mt-4" />
                        <h5 className="fw-bold text-muted mt-3">No orders yet</h5>
                        <p className="text-muted mb-4">Start by placing your first delivery order.</p>
                        <Link to="/create-order" className="btn px-4 py-2 mb-4 mx-auto"
                            style={{ background: THEME.primary, color: '#fff', borderRadius: 10 }}>
                            Create Order
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {orders.map(order => (
                            <div key={order._id} className="col-12 col-md-6 col-lg-4">
                                <OrderCard order={order} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;