import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateOrder from './pages/CreateOrder';
import OrderDetails from './pages/OrderDetails';
import Notifications from './pages/Notifications';
import AboutUs from './pages/AboutPage';
import Services from './pages/Services';
import AuthGuard from './auth/AuthGuard';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';

// Public Route
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status" />
        </div>
    );
    return user ? <Navigate to="/dashboard" /> : children;
};

const AppRoutes = () => (
    <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/track/:trackingNumber" element={<TrackOrder />} />

        {/* Auth pages — redirect to dashboard if already logged in */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected routes — AuthGuard redirects to /login if not authenticated */}
        <Route element={<AuthGuard />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-order" element={<CreateOrder />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/order-success" element={<OrderSuccess />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
);

const App = () => (
    <BrowserRouter>
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    </BrowserRouter>
);

export default App;