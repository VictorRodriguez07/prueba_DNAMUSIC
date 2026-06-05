import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: BASE_URL,
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
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email: string, password: string) => {
        const res = await api.post('/api/auth/login', { email, password });
        return res.data;
    },
    me: async () => {
        const res = await api.get('/api/auth/me');
        return res.data;
    },
};

export const estudianteService = {
    getAll: async (params?: Record<string, any>) => {
        const res = await api.get('/api/estudiantes', { params });
        return res.data;
    },
    getById: async (id: string) => {
        const res = await api.get(`/api/estudiantes/${id}`);
        return res.data;
    },
    create: async (data: any) => {
        const res = await api.post('/api/estudiantes', data);
        return res.data;
    },
    update: async (id: string, data: any) => {
        const res = await api.put(`/api/estudiantes/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        await api.delete(`/api/estudiantes/${id}`);
    },
};

export const sedeService = {
    getAll: async (params?: Record<string, any>) => {
        const res = await api.get('/api/sedes', { params });
        return res.data;
    },
    getById: async (id: string) => {
        const res = await api.get(`/api/sedes/${id}`);
        return res.data;
    },
    create: async (data: any) => {
        const res = await api.post('/api/sedes', data);
        return res.data;
    },
    update: async (id: string, data: any) => {
        const res = await api.put(`/api/sedes/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        await api.delete(`/api/sedes/${id}`);
    },
};