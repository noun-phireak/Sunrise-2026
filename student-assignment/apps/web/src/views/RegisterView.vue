<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Create Account</h2>
      <v-form ref="form" @submit.prevent="handleRegister" v-model="valid">
        <v-text-field
          v-model="name"
          label="Name"
          placeholder="John Doe"
          :rules="[v => !!v || 'Name is required']"
          required
          variant="outlined"
          class="mb-2"
        ></v-text-field>

        <v-text-field
          v-model="email"
          label="Email"
          placeholder="user@example.com"
          :rules="emailRules"
          required
          variant="outlined"
          class="mb-2"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          placeholder="password123"
          type="password"
          :rules="passwordRules"
          required
          variant="outlined"
          class="mb-2"
        ></v-text-field>

        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          placeholder="password123"
          type="password"
          :rules="confirmPasswordRules"
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
          Register
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

        <div class="login-link">
          Already have an account? <router-link to="/login">Login here</router-link>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const form = ref(null);
const valid = ref(false);
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');

const router = useRouter();
const authStore = useAuthStore();

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
];

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
];

const confirmPasswordRules = [
  (v: string) => !!v || 'Confirm Password is required',
  (v: string) => v === password.value || 'Passwords do not match',
];

const handleRegister = async () => {
  // @ts-ignore
  const { valid } = await form.value?.validate();
  if (!valid) return;

  loading.value = true;
  error.value = '';

  const result = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value,
  });

  if (result.success) {
    router.push('/login?registered=true');
  } else {
    // If backend returns specific field errors, we could map them
    // For now, display strict backend validation errors (like "domain invalid") generally
    error.value = Array.isArray(result.message) ? result.message.join(', ') : result.message;
  }

  loading.value = false;
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1a1c20 0%, #0f1012 100%);
  color: #fff;
}

.register-box {
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

.login-link {
  text-align: center;
  font-size: 0.875rem;
  color: #a5a5a5;
}

.login-link a {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
