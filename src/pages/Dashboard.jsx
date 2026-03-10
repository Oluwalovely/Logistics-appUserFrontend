import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, getMyNotifications } from '../services/api';
import {
    Package, PlusCircle, Bell, CheckCircle, XCircle,
    Zap, MapPin, Flag, Search,
    LogOut, User, Menu, ArrowRight, AlertCircle, Truck,
    ExternalLink, Navigation, ChevronRight
} from 'lucide-react';
import logo from '../assets/logo.png';

const T = {
    navy:   '#0d1f4f',
    navyL:  '#162660',
    orange: '#e8610a',
    white:  '#ffffff',
    light:  '#f5f6f8',
    dark:   '#111827',
    muted:  '#6b7280',
    border: '#e5e7eb',
    sidebar:'#0d1f4f',
};

const statusMap = {
    'pending':    { label: 'Pending',    bg: '#fffbeb', text: '#92400e', dot: '#f59e0b',  border: '#fde68a' },
    'assigned':   { label: 'Assigned',   bg: '#eff6ff', text: '#1e40af', dot: '#3b82f6',  border: '#bfdbfe' },
    'picked-up':  { label: 'Picked Up',  bg: '#f5f3ff', text: '#5b21b6', dot: '#8b5cf6',  border: '#ddd6fe' },
    'in-transit': { label: 'In Transit', bg: '#fff7ed', text: '#9a3412', dot: '#e8610a',  border: '#fed7aa' },
    'delivered':  { label: 'Delivered',  bg: '#f0fdf4', text: '#14532d', dot: '#16a34a',  border: '#bbf7d0' },
    'confirmed':  { label: 'Confirmed',  bg: '#eff6ff', text: '#1e40af', dot: '#3b82f6',  border: '#bfdbfe' },
    'cancelled':  { label: 'Cancelled',  bg: '#fef2f2', text: '#991b1b', dot: '#ef4444',  border: '#fecaca' },
};

/* progress steps order */
const progressSteps = ['assigned', 'picked-up', 'in-transit', 'delivered'];
const progressLabels = ['Assigned', 'Picked Up', 'In Transit', 'Delivered'];

const getProgressIndex = status => {
    if (['confirmed', 'delivered'].includes(status)) return 3;
    return progressSteps.indexOf(status);
};

/* ── Avatar ──────────────────────────────────────── */
const Avatar = ({ user, size = 32, fontSize = '0.82rem' }) => (
    user?.avatar
        ? <img src={user.avatar} alt="avatar"
            style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,0.2)' }} />
        : <div style={{ width: size, height: size, borderRadius: '50%', background: T.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize, color: '#fff', flexShrink: 0 }}>
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
);

/* ── Logout Modal ────────────────────────────────── */
const LogoutModal = ({ onConfirm, onCancel }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="logout-modal" style={{ background: T.white, borderRadius: 16, padding: '1.5rem', maxWidth: 340, width: '100%', textAlign: 'center', boxShadow: '0 16px 48px rgba(0,0,0,0.18)', animation: 'modalIn 0.2s ease' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <LogOut size={22} color="#162660" />
            </div>
            <h3 style={{ fontWeight: 800, color: T.navy, margin: '0 0 0.4rem', fontSize: '1.05rem' }}>Log Out?</h3>
            <p style={{ color: T.muted, fontSize: '0.83rem', margin: '0 0 1.5rem', lineHeight: 1.6 }}>Are you sure you want to log out?</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={onCancel} style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.white, color: T.muted, fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'inherit' }}>Stay</button>
                <button onClick={onConfirm} style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: 'none', background: '#162660', color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'inherit' }}>Yes, Log Out</button>
            </div>
        </div>
    </div>
);

/* ── Mobile Bar ──────────────────────────────────── */
const MobileBar = ({ onMenuOpen, unreadCount }) => (
    <header className="mob-bar" style={{ background: T.white, borderBottom: `1px solid ${T.border}`, height: 56, display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.75rem', position: 'sticky', top: 0, zIndex: 200 }}>
        <button onClick={onMenuOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <Menu size={22} color={T.navy} />
        </button>
        <img src={logo} alt="logo" style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 6 }} />
        <span style={{ fontWeight: 900, fontSize: '0.9rem', color: T.navy, letterSpacing: '1.5px' }}>LOVELISTICS</span>
        <div style={{ flex: 1 }} />
        <Link to="/notifications" style={{ position: 'relative', color: T.navy, textDecoration: 'none', padding: '0.3rem' }}>
            <Bell size={20} />
            {unreadCount > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: T.orange, color: '#fff', fontSize: '0.6rem', fontWeight: 700, minWidth: 15, height: 15, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 2px' }}>{unreadCount}</span>}
        </Link>
    </header>
);

/* ── Sidebar ─────────────────────────────────────── */
const sidebarLinks = [
    { label: 'My Orders',     icon: <Package size={18} />,    to: '/dashboard',     key: 'orders' },
    { label: 'Create Order',   icon: <PlusCircle size={18} />, to: '/create-order',  key: 'new' },
    { label: 'Notifications', icon: <Bell size={18} />,       to: '/notifications', key: 'notif' },
    { label: 'My Profile',    icon: <User size={18} />,       to: '/profile',       key: 'profile' },
];

const Sidebar = ({ open, onClose, onLogoutRequest, user, unreadCount }) => {
    const location = useLocation();
    return (
        <>
            {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 150 }} />}
            <aside style={{ width: 255, flexShrink: 0, background: T.sidebar, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 160, display: 'flex', flexDirection: 'column' }}
                className={`gig-sidebar${open ? ' sidebar-open' : ''}`}>

                {/* Brand */}
                <div style={{ padding: '1.15rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                    <img src={logo} alt="logo" style={{ width: 34, height: 34, objectFit: 'contain', borderRadius: 8, flexShrink: 0 }} />
                    <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#fff', letterSpacing: '1.5px' }}>LOVELISTICS</span>
                </div>

                {/* Nav */}
                <nav style={{ padding: '0.85rem 0.65rem', flex: 1, overflowY: 'auto' }}>
                    {sidebarLinks.map(link => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Link key={link.key} to={link.to} onClick={onClose}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.9rem', borderRadius: 10, marginBottom: '0.1rem', textDecoration: 'none', fontSize: '0.88rem', fontWeight: isActive ? 700 : 500, background: isActive ? T.white : 'transparent', color: isActive ? T.dark : 'rgba(255,255,255,0.65)', transition: 'background 0.15s, color 0.15s' }}
                                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; } }}
                                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; } }}>
                                {link.icon} {link.label}
                                {link.key === 'notif' && unreadCount > 0 && (
                                    <span style={{ marginLeft: 'auto', background: T.orange, color: '#fff', fontSize: '0.62rem', fontWeight: 700, padding: '1px 7px', borderRadius: 999 }}>{unreadCount}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>

                    {/* User card — clickable, links to /profile */}
                    <Link to="/profile" onClick={onClose}
                        style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', transition: 'background 0.15s', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Avatar user={user} size={38} fontSize="1rem" />
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.fullName}</p>
                            <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                        </div>
                        <ChevronRight size={14} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
                    </Link>

                    {/* Logout */}
                    <div style={{ padding: '0.6rem 0.65rem' }}>
                        <button onClick={() => { onClose(); onLogoutRequest(); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.15s, color 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.12)'; e.currentTarget.style.color = '#fca5a5'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}>
                            <LogOut size={17} /> Log Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

/* ── Stat Card ───────────────────────────────────── */
const StatCard = ({ label, value, sub, icon, color }) => (
    <div style={{ background: T.white, borderRadius: 16, padding: '1.25rem 1.25rem', border: `1px solid ${T.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'box-shadow 0.2s, transform 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
                <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</p>
                <p style={{ margin: '0.3rem 0 0', fontWeight: 900, fontSize: '1.9rem', color: T.dark, lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</p>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                {icon}
            </div>
        </div>
        <p style={{ margin: 0, fontSize: '0.75rem', color: T.muted, lineHeight: 1.4 }}>{sub}</p>
    </div>
);

/* ── Progress Bar ────────────────────────────────── */
const ShipmentProgress = ({ status }) => {
    if (status === 'cancelled') return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
            <XCircle size={13} color="#ef4444" />
            <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>Shipment cancelled</span>
        </div>
    );
    if (status === 'pending') return null;

    const activeIdx = getProgressIndex(status);
    return (
        <div style={{ marginTop: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {progressLabels.map((label, i) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < progressLabels.length - 1 ? 1 : 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                            <div style={{ width: 18, height: 18, borderRadius: '50%', background: i <= activeIdx ? T.navy : T.border, border: `2px solid ${i <= activeIdx ? T.navy : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
                                {i <= activeIdx && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                            </div>
                            <span style={{ fontSize: '0.58rem', fontWeight: i === activeIdx ? 700 : 500, color: i <= activeIdx ? T.navy : '#9ca3af', whiteSpace: 'nowrap', letterSpacing: '0.1px' }}>{label}</span>
                        </div>
                        {i < progressLabels.length - 1 && (
                            <div style={{ flex: 1, height: 2, background: i < activeIdx ? T.navy : T.border, margin: '0 3px', marginBottom: '1rem', transition: 'background 0.2s' }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ── Status Badge ────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const st = statusMap[status] || statusMap['pending'];
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: st.bg, color: st.text, border: `1px solid ${st.border}`, padding: '3px 9px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
            {st.label}
        </span>
    );
};

/* ── Order Row (desktop) ─────────────────────────── */
const OrderRow = ({ order }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div style={{ borderBottom: `1px solid ${T.border}`, background: hovered ? '#fafbff' : T.white, transition: 'background 0.12s', cursor: 'pointer' }}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1.3fr 100px 110px 90px', gap: '0.5rem', alignItems: 'start', padding: '0.9rem 1.25rem' }}>
                <div>
                    <Link to={`/orders/${order._id}`}
                        style={{ fontWeight: 700, color: hovered ? T.orange : T.navy, fontSize: '0.82rem', textDecoration: hovered ? 'underline' : 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.15s' }}>
                        #{order.trackingNumber}
                        {hovered && <ExternalLink size={11} />}
                    </Link>
                    <ShipmentProgress status={order.status} />
                </div>
                <span style={{ fontSize: '0.79rem', color: T.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingTop: '0.1rem' }}>{order.pickupAddress?.street}, {order.pickupAddress?.city}</span>
                <span style={{ fontSize: '0.79rem', color: T.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingTop: '0.1rem' }}>{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: T.orange, paddingTop: '0.1rem' }}>₦{order.price?.toLocaleString()}</span>
                <div style={{ paddingTop: '0.1rem' }}><StatusBadge status={order.status} /></div>
                <span style={{ fontSize: '0.72rem', color: T.muted, paddingTop: '0.1rem' }}>{new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
            </div>
        </div>
    );
};

/* ── Order Card (mobile) ─────────────────────────── */
const OrderCard = ({ order }) => (
    <Link to={`/orders/${order._id}`} style={{ textDecoration: 'none' }}>
        <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, padding: '1rem', marginBottom: '0.65rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.15s, transform 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontWeight: 700, color: T.navy, fontSize: '0.85rem' }}>#{order.trackingNumber}</span>
                <StatusBadge status={order.status} />
            </div>
            <p style={{ margin: '0 0 0.2rem', fontSize: '0.76rem', color: T.muted, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{order.pickupAddress?.street}, {order.pickupAddress?.city}</p>
            <p style={{ margin: '0 0 0.65rem', fontSize: '0.76rem', color: T.muted, display: 'flex', alignItems: 'center', gap: 4 }}><Flag size={11} />{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</p>
            <ShipmentProgress status={order.status} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: `1px solid ${T.border}` }}>
                <span style={{ fontWeight: 800, color: T.orange, fontSize: '0.9rem' }}>₦{order.price?.toLocaleString()}</span>
                <span style={{ fontSize: '0.7rem', color: T.muted }}>{new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</span>
            </div>
        </div>
    </Link>
);

/* ── Dashboard ───────────────────────────────────── */
const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders]           = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState('');
    const [search, setSearch]           = useState('');
    const [filter, setFilter]           = useState('all');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogout, setShowLogout]   = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const [ordersRes, notifRes] = await Promise.all([
                    getMyOrders(user._id),
                    getMyNotifications(),
                ]);
                setOrders(ordersRes.data.data);
                setUnreadCount(notifRes.data.unreadCount);
            } catch { setError('Failed to load orders'); }
            finally { setLoading(false); }
        })();
    }, [user]);

    const handleLogout = () => { logout(); navigate('/login'); };

    const stats = {
        total:     orders.length,
        active:    orders.filter(o => ['assigned', 'picked-up', 'in-transit'].includes(o.status)).length,
        delivered: orders.filter(o => ['delivered', 'confirmed'].includes(o.status)).length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    const filtered = orders.filter(o => {
        const matchSearch = !search ||
            o.trackingNumber?.toLowerCase().includes(search.toLowerCase()) ||
            o.deliveryAddress?.city?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' ? true
            : filter === 'active'    ? ['assigned', 'picked-up', 'in-transit'].includes(o.status)
            : filter === 'delivered' ? ['delivered', 'confirmed'].includes(o.status)
            : o.status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div style={{ minHeight: '100vh', background: T.light, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                @keyframes ddIn    { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
                @keyframes modalIn { from{opacity:0;transform:scale(0.95)}     to{opacity:1;transform:scale(1)} }
                @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                .gig-sidebar  { display: flex !important; flex-direction: column; }
                .gig-main     { margin-left: 255px; padding-top: 2rem; }
                .mob-bar      { display: none !important; }
                .logout-modal h3 { font-size: 1.05rem; }
                @media (max-width: 768px) {
                    .gig-sidebar { transform: translateX(-100%) !important; top: 0 !important; }
                    .gig-sidebar.sidebar-open { transform: translateX(0) !important; }
                    .gig-main { margin-left: 0 !important; padding-top: 1.25rem !important; }
                    .desk-table { display: none !important; }
                    .mob-bar { display: flex !important; }
                }
                @media (min-width: 769px) { .mob-only { display: none !important; } }
                @media (max-width: 480px) {
                    .logout-modal { padding: 1.25rem !important; border-radius: 14px !important; }
                    .logout-modal p { font-size: 0.78rem !important; }
                }
            `}</style>

            {showLogout && <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogout(false)} />}
            <MobileBar onMenuOpen={() => setSidebarOpen(true)} unreadCount={unreadCount} />

            <div style={{ display: 'flex' }}>
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogoutRequest={() => setShowLogout(true)} user={user} unreadCount={unreadCount} />

                <main className="gig-main" style={{ flex: 1, padding: '2rem 1.75rem', minWidth: 0 }}>

                    {/* Page header */}
                    <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.3s ease both' }}>
                        <p style={{ fontWeight: 600, color: T.navy, fontSize: '1.45rem', margin: '0 0 0.2rem', letterSpacing: '-0.3px' }}>My Orders</p>
                        <h1 style={{ margin: 0, color: T.muted, fontSize: '0.83rem' }}>
                            Welcome back, <strong style={{ color: T.dark, fontWeight: 600 }}>{user?.fullName}</strong> — here's your order overview.
                        </h1>
                    </div>

                    {/* Stat cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.75rem', animation: 'fadeUp 0.35s ease both', animationDelay: '0.05s' }}>
                        <StatCard label="Total Orders"  value={stats.total}     sub={`${stats.total === 1 ? '1 order' : `${stats.total} orders`} created`}          icon={<Package size={20} />}     color={T.navy} />
                        <StatCard label="Active"        value={stats.active}    sub={stats.active === 0 ? 'None in transit' : `${stats.active} currently moving`}          icon={<Zap size={20} />}         color="#2563eb" />
                        <StatCard label="Delivered"     value={stats.delivered} sub={stats.delivered === 0 ? 'No deliveries yet' : `${stats.delivered} completed`}         icon={<CheckCircle size={20} />} color="#16a34a" />
                        <StatCard label="Cancelled"     value={stats.cancelled} sub={stats.cancelled === 0 ? 'None cancelled' : `${stats.cancelled} cancelled`}            icon={<XCircle size={20} />}     color="#dc2626" />
                    </div>

                    {/* Action banner */}
                    <div style={{ background: `linear-gradient(135deg, ${T.navy} 0%, #1e3a8a 100%)`, borderRadius: 16, padding: '1.35rem 1.75rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', boxShadow: '0 4px 24px rgba(13,31,79,0.18)', animation: 'fadeUp 0.4s ease both', animationDelay: '0.1s' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 800, color: '#fff', fontSize: '1rem', letterSpacing: '-0.1px' }}>Create an Order</p>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Place a new order in less than 2 minutes</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                            <Link to="/create-order"
                                style={{ background: T.orange, color: '#fff', padding: '0.6rem 1.3rem', borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, transition: 'background 0.15s, transform 0.15s', boxShadow: '0 2px 8px rgba(232,97,10,0.35)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#c9510a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = T.orange; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                <Truck size={14} /> Create Order <ArrowRight size={13} />
                            </Link>
                            
                        </div>
                    </div>

                    {/* Shipment table */}
                    <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', overflow: 'hidden', animation: 'fadeUp 0.45s ease both', animationDelay: '0.15s' }}>
                        {/* Toolbar */}
                        <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', background: T.white }}>
                            <h2 style={{ margin: 0, fontWeight: 700, color: T.dark, fontSize: '0.95rem', flex: 1 }}>Order History</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: T.light, border: `1px solid ${T.border}`, borderRadius: 9, padding: '0.4rem 0.8rem', transition: 'border-color 0.15s' }}
                                onFocus={e => e.currentTarget.style.borderColor = T.navy}
                                onBlur={e => e.currentTarget.style.borderColor = T.border}>
                                <Search size={13} color={T.muted} />
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..."
                                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', color: T.dark, fontFamily: 'inherit', width: 140 }} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                {['all', 'active', 'delivered', 'cancelled'].map(f => (
                                    <button key={f} onClick={() => setFilter(f)}
                                        style={{ borderRadius: 999, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.73rem', background: filter === f ? T.navy : T.white, color: filter === f ? '#fff' : T.muted, border: filter === f ? `1px solid ${T.navy}` : `1px solid ${T.border}`, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ padding: '3.5rem', textAlign: 'center' }}>
                                <div className="spinner-border" style={{ color: T.navy }} />
                            </div>
                        ) : error ? (
                            <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontSize: '0.85rem' }}>
                                <AlertCircle size={16} />{error}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
                                <div style={{ width: 64, height: 64, borderRadius: 16, background: T.light, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                    <Package size={28} color={T.border} />
                                </div>
                                <p style={{ fontWeight: 700, color: T.dark, margin: '0 0 0.3rem', fontSize: '0.95rem' }}>No orders found</p>
                                <p style={{ fontSize: '0.8rem', color: T.muted, margin: '0 0 1.5rem' }}>Try a different filter or create your first shipment</p>
                                <Link to="/create-order" style={{ background: T.navy, color: '#fff', padding: '0.65rem 1.6rem', borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <PlusCircle size={15} /> Place an Order
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Desktop table */}
                                <div className="desk-table">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1.3fr 100px 110px 90px', gap: '0.5rem', padding: '0.6rem 1.25rem', background: '#fafbff', borderBottom: `1px solid ${T.border}` }}>
                                        {['Tracking ID', 'From', 'To', 'Price', 'Status', 'Date'].map(h => (
                                            <span key={h} style={{ fontSize: '0.67rem', fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</span>
                                        ))}
                                    </div>
                                    {filtered.map(o => <OrderRow key={o._id} order={o} />)}
                                </div>
                                {/* Mobile cards */}
                                <div style={{ padding: '1rem' }} className="mob-only">
                                    {filtered.map(o => <OrderCard key={o._id} order={o} />)}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;