<template>
  <div class="recipe-page">
    <div v-if="loading" class="loading">Loading recipe...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="recipe" class="recipe">
      <!-- Back link -->
      <router-link to="/" class="back-link">← Back to Recipes</router-link>

      <!-- Recipe header -->
      <div class="recipe-header">
        <div class="recipe-header-text">
          <span class="recipe-category-badge">{{ recipe.category }}</span>
          <h1 class="recipe-title">{{ recipe.title }}</h1>
          <p v-if="recipe.description" class="recipe-description">{{ recipe.description }}</p>

          <div class="recipe-stats">
            <div class="stat">
              <span class="stat-label">Prep Time</span>
              <span class="stat-value">{{ recipe.prep_time }} min</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-label">Cook Time</span>
              <span class="stat-value">{{ recipe.cook_time }} min</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-label">Total Time</span>
              <span class="stat-value">{{ recipe.prep_time + recipe.cook_time }} min</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-label">Servings</span>
              <span class="stat-value">{{ recipe.servings }}</span>
            </div>
          </div>

          <div v-if="isLoggedIn" class="admin-actions">
            <router-link :to="`/edit/${recipe.id}`" class="edit-btn">Edit Recipe</router-link>
            <button @click="deleteRecipe" class="delete-btn">Delete Recipe</button>
          </div>

          <div class="recipe-header-image">
            <img v-if="recipe.image_url" :src="recipe.image_url" :alt="recipe.title" />
            <div v-else class="no-image">🍽️</div>
          </div>
        </div>
      </div>

      <hr class="recipe-divider" />

      <!-- Two column layout — ingredients + instructions -->
      <div class="recipe-body">
        <div class="ingredients-column">
          <h2 class="column-title">Ingredients</h2>
          <ul class="ingredients-list">
            <li v-for="ing in recipe.ingredients" :key="ing.id" class="ingredient-item">
              <span class="ingredient-amount">{{ ing.amount }} {{ ing.unit }}</span>
              <span class="ingredient-name">{{ ing.item }}</span>
            </li>
          </ul>

          <div v-if="recipe.notes" class="notes-box">
            <h3>Notes</h3>
            <p>{{ recipe.notes }}</p>
          </div>
        </div>

        <div class="instructions-column">
          <h2 class="column-title">Instructions</h2>
          <ol class="instructions-list">
            <li
              v-for="step in recipe.instructions"
              :key="step.id"
              class="instruction-step"
            >
              <span class="step-number">{{ step.step_number }}</span>
              <p>{{ step.instruction }}</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import API_BASE from '../api';
import { isLoggedIn, getToken } from '../auth';

export default {
  name: 'Recipe',
  data() {
    return {
      recipe: null,
      loading: true,
      error: null,
      isLoggedIn: false,
    }
  },
  async mounted() {
    this.isLoggedIn = isLoggedIn();
    try {
      const id = this.$route.params.id;
      const response = await axios.get(`${API_BASE}/api/recipes/${id}`);
      this.recipe = response.data;
    } catch (err) {
      this.error = err.response?.status === 404
        ? 'Recipe not found.'
        : 'Something went wrong loading this recipe.';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async deleteRecipe() {
      if (!confirm(`Delete "${this.recipe.title}"?`)) return;
      try {
        await axios.delete(`${API_BASE}/api/recipes/${this.recipe.id}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        this.$router.push('/');
      } catch (err) {
        alert('Failed to delete recipe');
      }
    }
  }
}
</script>

<style scoped>
.back-link {
  display: inline-block;
  color: #8B4513;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
}

.back-link:hover {
  text-decoration: underline;
}

.recipe-header {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
  align-items: start;
  margin-bottom: 32px;
}

.recipe-title {
  font-family: 'Playfair Display', serif;
  font-size: 42px;
  font-weight: 700;
  color: #3C2A1E;
  line-height: 1.2;
  margin: 10px 0 12px;
}

.recipe-description {
  font-size: 16px;
  color: #6B4F3A;
  line-height: 1.7;
  font-style: italic;
  margin-bottom: 24px;
}

.recipe-stats {
  display: flex;
  align-items: center;
  gap: 0;
  background: #F5E6C8;
  border: 1px solid #E8DCC8;
  border-radius: 8px;
  padding: 16px 24px;
  margin-bottom: 20px;
}

.stat {
  text-align: center;
  flex: 1;
}

.stat-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8B6E4E;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 600;
  color: #5C3317;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #E8DCC8;
  margin: 0 8px;
}

.recipe-header-image img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(60, 42, 30, 0.15);
}

.no-image {
  width: 100%;
  height: 320px;
  background: #F5E6C8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
}

.recipe-divider {
  border: none;
  border-top: 2px solid #C8860A;
  margin: 0 0 40px 0;
}

.recipe-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;
  align-items: start;
}

.column-title {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  color: #5C3317;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #E8DCC8;
}

.ingredients-list {
  list-style: none;
  margin-bottom: 32px;
}

.ingredient-item {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dotted #E8DCC8;
  font-size: 15px;
}

.ingredient-amount {
  font-weight: 700;
  color: #8B4513;
  min-width: 80px;
  font-size: 14px;
}

.ingredient-name {
  color: #3C2A1E;
}

.notes-box {
  background: #FFF8E7;
  border-left: 3px solid #C8860A;
  padding: 16px;
  border-radius: 0 6px 6px 0;
}

.notes-box h3 {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  color: #5C3317;
  margin-bottom: 8px;
}

.notes-box p {
  font-size: 14px;
  color: #6B4F3A;
  line-height: 1.6;
}

.instructions-list {
  list-style: none;
}

.instruction-step {
  display: flex;
  gap: 20px;
  margin-bottom: 28px;
  align-items: start;
}

.step-number {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 700;
  color: #C8860A;
  line-height: 1;
  min-width: 36px;
}

.instruction-step p {
  font-size: 15px;
  line-height: 1.8;
  color: #3C2A1E;
  padding-top: 4px;
}

.admin-actions {
  margin-top: 8px;
}

.delete-btn {
  background: #FDEAEA;
  color: #C0392B;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
}

.delete-btn:hover {
  background: #C0392B;
  color: white;
}

.loading, .error {
  text-align: center;
  padding: 80px 0;
  color: #8B6E4E;
  font-style: italic;
}

.edit-btn {
  display: inline-block;
  background: #F5E6C8;
  color: #8B4513;
  border: 1px solid #C8860A;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  font-family: 'Lato', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-right: 8px;
}

.edit-btn:hover {
  background: #C8860A;
  color: white;
}
</style>