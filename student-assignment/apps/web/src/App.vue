<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import Sidebar from '@/components/Sidebar.vue';

const authStore = useAuthStore();
</script>

<template>
  <v-app>
    <Sidebar v-if="authStore.isAuthenticated" />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
/* Global styles */
html {
  overflow-y: auto; /* FixVuetify scrollbar issue */
}
body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #121212; /* Match dark theme base */
}
</style>
