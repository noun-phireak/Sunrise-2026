<template>
  <v-navigation-drawer
    permanent
    theme="dark"
    class="sidebar-glass"
    width="260"
  >
    <div class="pa-4 d-flex align-center">
      <v-avatar color="primary" class="mr-3" size="40">
        <span class="text-h6 font-weight-bold">POS</span>
      </v-avatar>
      <div>
        <div class="text-subtitle-1 font-weight-bold">POS Stack</div>
        <div class="text-caption text-grey">{{ authStore.user?.name || 'User' }}</div>
      </div>
    </div>

    <v-divider class="mb-2"></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        to="/"
        rounded="lg"
        class="mb-1"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-point-of-sale"
        title="Point of Sale"
        to="/pos"
        rounded="lg"
        class="mb-1"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-format-list-bulleted"
        title="Products"
        to="/products"
        rounded="lg"
        class="mb-1"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-shape"
        title="Categories"
        to="/categories"
        rounded="lg"
        class="mb-1"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-truck"
        title="Suppliers"
        to="/suppliers"
        rounded="lg"
        class="mb-1"
      ></v-list-item>

      <v-list-item 
        prepend-icon="mdi-history" 
        title="Orders" 
        to="/orders"
        v-if="authStore.isCashier || authStore.isAdmin"
        rounded="lg"
        class="mb-1"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-clipboard-list"
        title="Stock History"
        to="/stocks"
        v-if="authStore.isAdmin"
        rounded="lg"
        class="mb-1"
      ></v-list-item>
      
      <v-list-item 
        prepend-icon="mdi-account" 
        title="Users" 
        to="/users"
        v-if="authStore.isAdmin"
        rounded="lg"
        class="mb-1"
      ></v-list-item>
      
       <v-list-item
        prepend-icon="mdi-account-group"
        title="Customers"
        to="/customers"
        rounded="lg"
        class="mb-1"
      ></v-list-item>
      
       <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
        to="/settings"
        rounded="lg"
        class="mb-1"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-4">
        <v-btn
          block
          color="error"
          variant="tonal"
          prepend-icon="mdi-logout"
          @click="handleLogout"
        >
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.sidebar-glass {
  background: rgba(30, 30, 35, 0.95) !important;
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
