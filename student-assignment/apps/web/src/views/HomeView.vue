<template>
  <div class="dashboard">
    <header>
      <h1>Dashboard</h1>
      <div class="user-info">
        <span>{{ authStore.user?.name }} ({{ authStore.user?.role }})</span>
        <button @click="handleLogout">Logout</button>
      </div>
    </header>
    
    <main>
      <div v-if="authStore.isAdmin" class="admin-panel">
        <h2>Admin Controls</h2>
        <p>Manage Products, Users, and Stock.</p>
        <!-- Links to admin features will go here -->
      </div>
      
      <div v-if="authStore.isCashier" class="pos-panel">
        <h2>POS Interface</h2>
        <p>Start a new sale.</p>
        <!-- POS Interface will go here -->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f5f5f5;
}

header {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

button {
  padding: 0.5rem 1rem;
  background-color: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-panel, .pos-panel {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>
