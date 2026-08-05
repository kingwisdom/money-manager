import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

const api = axios.create({
    baseURL: apiUrl ? `${apiUrl}/api` : '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            if (
                window.location.pathname !== '/login' &&
                window.location.pathname !== '/register' &&
                !window.location.pathname.startsWith('/verify-email')
            ) {
                window.location.assign('/login');
            }
        }

        return Promise.reject(error);
    },
);

export default api;
