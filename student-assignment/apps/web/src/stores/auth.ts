import { defineStore } from 'pinia';
import api from '@/utils/axios';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        token: localStorage.getItem('token') || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'Admin',
        isCashier: (state) => state.user?.role === 'Cashier',
    },
    actions: {
        async login(email: string, pass: string) {
            try {
                const response = await api.post('/auth/login', { email, password: pass });
                this.token = response.data.access_token;
                this.user = response.data.user;

                localStorage.setItem('token', this.token || '');
                localStorage.setItem('user', JSON.stringify(this.user));

                return true;
            } catch (error) {
                console.error('Login failed', error);
                return false;
            }
        },
        async register(user: any) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const response = await api.post('/auth/register', user);
                return { success: true };
            } catch (error: any) {
                console.error('Registration failed', error);
                return {
                    success: false,
                    message: error.response?.data?.message || 'Registration failed. Please try again.'
                };
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
});
