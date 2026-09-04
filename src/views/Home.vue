<template>
  <div class="home">
    <!-- Category filter tabs -->
    <div class="filter-bar">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['filter-btn', { active: selectedCategory === cat }]"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <p>Loading recipes...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredRecipes.length === 0" class="empty">
      <p>No recipes yet in this category.</p>
      <p v-if="isLoggedIn"><router-link to="/add">Add the first one →</router-link></p>
    </div>

    <!-- Recipe grid -->
    <div v-else class="recipe-grid">
      <div
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        class="recipe-card"
        @click="$router.push(`/recipe/${recipe.id}`)"
      >
        <img
          v-if="recipe.image_url"
          :src="recipe.image_url"
          :alt="recipe.title"
        />
        <div v-else class="recipe-card-no-image">
          <span>🍽️</span>
        </div>
        <div class="recipe-card-body">
          <span class="recipe-category-badge">{{ recipe.category }}</span>
          <h2 class="recipe-card-title">{{ recipe.title }}</h2>
          <div class="recipe-card-meta">
            <span>⏱ Prep: {{ recipe.prep_time }} min</span>
            <span>🔥 Cook: {{ recipe.cook_time }} min</span>
            <span>👤 Serves: {{ recipe.servings }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import API_BASE from '../api';
import { isLoggedIn } from '../auth';

export default {
  name: 'Home',
  data() {
    return {
      recipes: [],
      loading: true,
      selectedCategory: 'All',
      isLoggedIn: false,
      categories: ['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks', 'Sides', 'Drinks'],
    }
  },
  computed: {
    filteredRecipes() {
      if (this.selectedCategory === 'All') return this.recipes;
      return this.recipes.filter(r => r.category === this.selectedCategory);
    }
  },
  async mounted() {
    this.isLoggedIn = isLoggedIn();
    try {
      const response = await axios.get(`${API_BASE}/api/recipes`);
      this.recipes = response.data;
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E8DCC8;
}

.filter-btn {
  background: #FFFDF7;
  border: 1px solid #E8DCC8;
  color: #8B6E4E;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.15s ease;
}

.filter-btn:hover {
  background: #F5E6C8;
  border-color: #C8860A;
  color: #5C3317;
}

.filter-btn.active {
  background: #8B4513;
  border-color: #8B4513;
  color: #F5E6C8;
}

.loading, .empty {
  text-align: center;
  padding: 80px 0;
  color: #8B6E4E;
  font-style: italic;
  font-size: 16px;
}

.empty a {
  color: #8B4513;
  font-weight: 600;
  text-decoration: none;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.recipe-card-no-image {
  width: 100%;
  height: 200px;
  background: #F5E6C8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}
</style>