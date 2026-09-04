<template>
  <div id="app">
    <header class="cookbook-header">
      <div class="header-inner">
        <div class="header-brand">
          <span class="book-icon">📖</span>
          <div>
            <h1>Stephanie's Kitchen</h1>
            <p class="tagline">A collection of family favorites</p>
          </div>
        </div>
        <nav class="header-nav">
          <router-link to="/">All Recipes</router-link>
          <router-link v-if="loggedIn" to="/add">+ Add Recipe</router-link>
          <router-link v-if="!loggedIn" to="/login" class="nav-login">Admin</router-link>
          <button v-if="loggedIn" @click="handleLogout" class="nav-logout">Logout</button>
        </nav>
      </div>
    </header>

    <main class="cookbook-main">
      <router-view />
    </main>

    <footer class="cookbook-footer">
      <p>Made with ❤️ by Stephanie Wolfe</p>
    </footer>
  </div>
</template>

<script>
import { isLoggedIn, logout } from './auth';

export default {
  name: 'App',
  data() {
    return { loggedIn: false }
  },
  mounted() {
    this.loggedIn = isLoggedIn();
  },
  watch: {
    $route() {
      this.loggedIn = isLoggedIn();
    }
  },
  methods: {
    handleLogout() {
      logout();
      this.loggedIn = false;
      this.$router.push('/');
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Lato', sans-serif;
  background-color: #F5F0E8;
  color: #3C2A1E;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.cookbook-header {
  background: linear-gradient(135deg, #5C3317 0%, #8B4513 100%);
  padding: 24px 32px;
  border-bottom: 4px solid #C8860A;
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.book-icon {
  font-size: 40px;
}

.header-brand h1 {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  color: #F5E6C8;
  font-weight: 700;
}

.tagline {
  font-size: 13px;
  color: #C8A96E;
  font-style: italic;
  margin-top: 2px;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-nav a {
  color: #F5E6C8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 0.15s ease;
}

.header-nav a:hover,
.header-nav a.router-link-active {
  color: #C8860A;
}

.nav-login {
  color: rgba(245, 230, 200, 0.5) !important;
  font-size: 12px !important;
}

.nav-logout {
  background: transparent;
  border: 1px solid rgba(245, 230, 200, 0.4);
  color: #F5E6C8;
  padding: 5px 14px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
}

.nav-logout:hover {
  background: rgba(245, 230, 200, 0.1);
}

.cookbook-main {
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
  width: 100%;
}

.cookbook-footer {
  background: #3C2A1E;
  color: #C8A96E;
  text-align: center;
  padding: 20px;
  font-size: 13px;
  font-style: italic;
}

/* Shared recipe card styles used across pages */
.recipe-card {
  background: #FFFDF7;
  border: 1px solid #E8DCC8;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(60, 42, 30, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.recipe-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(60, 42, 30, 0.15);
}

.recipe-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recipe-card-body {
  padding: 16px;
}

.recipe-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 600;
  color: #3C2A1E;
  margin-bottom: 6px;
}

.recipe-card-meta {
  font-size: 12px;
  color: #8B6E4E;
  display: flex;
  gap: 12px;
}

.recipe-category-badge {
  display: inline-block;
  background: #F5E6C8;
  color: #8B4513;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

/* Section headers with decorative lines */
.section-header {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  color: #5C3317;
  margin-bottom: 8px;
}

.section-divider {
  border: none;
  border-top: 2px solid #C8860A;
  margin: 12px 0 32px 0;
  width: 60px;
}
</style>