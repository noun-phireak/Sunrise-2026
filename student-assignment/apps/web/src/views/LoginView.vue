<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Welcome Back</h2>
      <v-form ref="form" @submit.prevent="handleLogin" v-model="valid">
        <v-text-field
          v-model="email"
          label="Email"
          placeholder="admin@example.com"
          :rules="emailRules"
          required
          variant="outlined"
          class="mb-2"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          placeholder="admin123"
          type="password"
          :rules="passwordRules"
          required
          variant="outlined"
          class="mb-4"
        ></v-text-field>

        <v-btn
          type="submit"
          block
          color="primary"
          size="large"
          :loading="loading"
          :disabled="!valid"
          class="mb-4"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </v-btn>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          closable
          class="mb-4"
          @click:close="error = ''"
        >
          {{ error }}
        </v-alert>

        <v-alert
          v-if="showSuccess"
          type="success"
          variant="tonal"
          closable
          class="mb-4"
          @click:close="showSuccess = false"
        >
          Registration successful! Please login.
        </v-alert>

        <div class="register-link">
          Don't have an account? <router-link to="/register">Register here</router-link>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const form = ref(null);
const valid = ref(false);
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const showSuccess = ref(false);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
];

const passwordRules = [
  (v: string) => !!v || 'Password is required',
];

if (route.query.registered) {
  showSuccess.value = true;
  router.replace('/login');
}

const handleLogin = async () => {
  // @ts-ignore
  const { valid } = await form.value?.validate();
  if (!valid) return;

  loading.value = true;
  error.value = '';
  
  const success = await authStore.login(email.value, password.value);
  if (success) {
    if (authStore.isAdmin) {
      router.push('/admin');
    } else if (authStore.isCashier) {
      router.push('/pos');
    } else {
      router.push('/');
    }
  } else {
    error.value = 'Invalid credentials';
    password.value = '';
  }
  
  loading.value = false;
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1a1c20 0%, #0f1012 100%);
  color: #fff;
}

.login-box {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  width: 100%;
  max-width: 450px;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 600;
  font-size: 2rem;
  background: linear-gradient(to right, #fff, #a5a5a5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.register-link {
  text-align: center;
  font-size: 0.875rem;
  color: #a5a5a5;
}

.register-link a {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
