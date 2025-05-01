import axios from 'axios';
import { message } from 'antd';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 401:
                    // Unauthorized - token expired or invalid
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden - user doesn't have permission
                    message.error('Bu işlem için yetkiniz bulunmamaktadır');
                    break;
                case 404:
                    // Not found
                    message.error('İstenen kaynak bulunamadı');
                    break;
                case 500:
                    // Server error
                    message.error('Sunucu hatası oluştu');
                    break;
                default:
                    // Other errors
                    message.error(data.message || 'Bir hata oluştu');
            }
        } else {
            message.error('Bağlantı hatası oluştu');
        }
        return Promise.reject(error);
    }
);

export default api; 