import api from './api';
import { AxiosError } from 'axios';

export interface AuthResponse {
    success: boolean;
    data: {
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
        };
        token: string;
    };
}

export interface ErrorResponse {
    success: boolean;
    message: string;
    errors: Array<{ msg: string }>;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    businessName: string;
}

export const authService = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        try {
            console.log('Login attempt with email:', data.email);
            const response = await api.post<AuthResponse>('/auth/login', data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            console.error('Login error details:', {
                status: axiosError.response?.status,
                statusText: axiosError.response?.statusText,
                data: axiosError.response?.data,
                headers: axiosError.response?.headers
            });
            
            if (axiosError.response?.data?.errors?.[0]?.msg) {
                throw new Error(axiosError.response.data.errors[0].msg);
            }
            throw new Error('Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
        }
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        try {
            console.log('Register attempt with data:', { ...data, password: '***' });
            const response = await api.post<AuthResponse>('/auth/register', data);
            console.log('Register response:', response.data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            console.error('Register error details:', {
                status: axiosError.response?.status,
                statusText: axiosError.response?.statusText,
                data: axiosError.response?.data,
                headers: axiosError.response?.headers
            });
            
            if (axiosError.response?.data?.errors?.[0]?.msg) {
                console.error('Validation error:', axiosError.response.data.errors[0].msg);
                throw new Error(axiosError.response.data.errors[0].msg);
            }
            throw error;
        }
    },

    getCurrentUser: async (): Promise<AuthResponse['data']['user']> => {
        try {
            const response = await api.get<AuthResponse['data']['user']>('/auth/me');
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Get current user error:', axiosError.response?.data || axiosError.message);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
}; 