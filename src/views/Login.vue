<template>
  <div class="login">
    <div class="login-card">
      <h1>Kitchen Admin</h1>
      <p class="login-subtitle">Sign in to add and manage recipes</p>

      <div v-if="error" class="error">{{ error }}</div>

      <div class="field">
        <label>Username</label>
        <input v-model="form.username" type="text" placeholder="Username" @keyup.enter="handleLogin" />
      </div>

      <div class="field">
        <label>Password</label>
        <input v-model="form.password" type="password" placeholder="Password" @keyup.enter="handleLogin" />
      </div>

      <button @click="handleLogin" :disabled="loading" class="login-btn">
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import API_BASE from '../api';

export default {
  name: 'Login',
  data() {
    return {
      form: { username: '', password: '' },
      loading: false,
      error: null,
    }
  },
  methods: {
    async handleLogin() {
      this.error = null;
      this.loading = true;
      try {
        const response = await axios.post(`${API_BASE}/api/auth/login`, this.form);
        localStorage.setItem('recipe_token', response.data.token);
        this.$router.push('/');
      } catch (err) {
        this.error = err.response?.data?.error || 'Login failed';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  padding: 48px 20px;
}

.login-card {
  background: #FFFDF7;
  border: 1px solid #E8DCC8;
  border-radius: 8px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(60, 42, 30, 0.08);
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  color: #5C3317;
  text-align: center;
  margin-bottom: 6px;
}

.login-subtitle {
  text-align: center;
  color: #8B6E4E;
  font-size: 14px;
  font-style: italic;
  margin-bottom: 28px;
}

.field {
  margin-bottom: 16px;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #5C3317;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

input {
  display: block;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #E8DCC8;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Lato', sans-serif;
  background: white;
  color: #3C2A1E;
}

input:focus {
  outline: none;
  border-color: #C8860A;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #8B4513;
  color: #F5E6C8;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 8px;
}

.login-btn:hover {
  background: #5C3317;
}

.login-btn:disabled {
  background: #C4A882;
  cursor: not-allowed;
}

.error {
  background: #FDEAEA;
  color: #C0392B;
  padding: 10px 14px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>