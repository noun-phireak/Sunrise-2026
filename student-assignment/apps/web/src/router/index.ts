import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/HomeView.vue'), // Placeholder for Admin Dashboard
      meta: { requiresAuth: true, role: 'Admin' },
    },
    {
      path: '/pos',
      name: 'pos',
      component: () => import('../views/PosView.vue'),
      meta: { requiresAuth: true, role: 'Cashier' },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrderHistoryView.vue'),
      meta: { requiresAuth: true, role: 'Cashier' } // Or 'Admin' too, but logic handles 'Admin' access
    },
    {
      path: '/stocks',
      name: 'stocks',
      component: () => import('../views/StockHistoryView.vue'),
      meta: { requiresAuth: true, role: 'Admin' }
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductView.vue'),
      meta: { requiresAuth: true }, // Add role: 'Admin' if needed, but for now just requiresAuth
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/suppliers',
      name: 'suppliers',
      component: () => import('../views/SupplierView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.role && authStore.user?.role !== to.meta.role && authStore.user?.role !== 'Admin') {
    // Admin can access everything, otherwise strict role check
    next('/');
  } else {
    next();
  }
});

export default router;
