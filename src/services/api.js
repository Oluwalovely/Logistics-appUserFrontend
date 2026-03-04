import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


const API = axios.create({
    baseURL: 'http://localhost:7001/api/v1',
});

// Attach token automatically to every request if it exists in cookies
API.interceptors.request.use((config) => {
    const token = cookies.get('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle token expiry globally
// If the server returns 401, the token has expired or is invalid.
// Clear cookies and redirect to login.
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            cookies.remove('token', { path: '/' });
            cookies.remove('user', { path: '/' });
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

//Authentication
export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);

//Orders
export const createOrder = (formData) => API.post('/orders', formData);
export const getMyOrders = (customerId) => API.get(`/customers/${customerId}/orders`);
export const getOrderById = (orderId) => API.get(`/orders/${orderId}`);
export const confirmDelivery = (orderId) => API.patch(`/orders/${orderId}/confirm`);
export const cancelOrder = (orderId) => API.patch(`/orders/${orderId}/cancel`);
export const deleteOrder = (orderId) => API.delete(`/orders/${orderId}`);

//Tracking
export const getLatestLocation = (orderId) => API.get(`/orders/${orderId}/tracking/latest`);

//Notifications
export const getMyNotifications = () => API.get('/notifications');
export const markAllAsRead = () => API.patch('/notifications/read-all');
export const markOneAsRead = (notificationId) => API.patch(`/notifications/${notificationId}/read`);


export const forgotPassword = (data) => API.post('/forgot-password', data);
export const verifyOTP = (data) => API.post('/verify-otp', data);
export const resetPassword = (data) => API.post('/reset-password', data);