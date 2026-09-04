<template>
  <div class="add-recipe">
    <h1 class="section-header">Add a Recipe</h1>
    <hr class="section-divider" />

    <div v-if="success" class="success">
      Recipe added! <router-link to="/">View all recipes</router-link>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div class="form">
      <!-- Basic info -->
      <div class="form-section">
        <h2>Basic Information</h2>

        <div class="field">
          <label>Recipe Title *</label>
          <input v-model="form.title" placeholder="e.g. Grandma's Chocolate Chip Cookies" />
        </div>

        <div class="field-row">
          <div class="field">
            <label>Category *</label>
            <select v-model="form.category">
              <option value="">Select category</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="field">
            <label>Prep Time (minutes) *</label>
            <input v-model.number="form.prep_time" type="number" placeholder="15" />
          </div>
          <div class="field">
            <label>Cook Time (minutes) *</label>
            <input v-model.number="form.cook_time" type="number" placeholder="30" />
          </div>
          <div class="field">
            <label>Servings *</label>
            <input v-model.number="form.servings" type="number" placeholder="4" />
          </div>
        </div>

        <div class="field">
          <label>Description</label>
          <textarea v-model="form.description" rows="3" placeholder="A brief description of the recipe..." />
        </div>

        <div class="field">
          <label>Photo</label>
          <input type="file" accept="image/*" @change="handleImageChange" />
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="Preview" />
          </div>
        </div>
      </div>

      <!-- Ingredients -->
      <div class="form-section">
        <h2>Ingredients</h2>
        <div class="ingredients-header">
          <span>Amount</span>
          <span>Unit</span>
          <span>Ingredient</span>
          <span></span>
        </div>
        <div
          v-for="(ing, index) in form.ingredients"
          :key="index"
          class="ingredient-row"
        >
          <input v-model="ing.amount" placeholder="2" />
          <input v-model="ing.unit" placeholder="cups" />
          <input v-model="ing.item" placeholder="all-purpose flour" />
          <button @click="removeIngredient(index)" class="remove-btn">✕</button>
        </div>
        <button @click="addIngredient" class="add-row-btn">+ Add Ingredient</button>
      </div>

      <!-- Instructions -->
      <div class="form-section">
        <h2>Instructions</h2>
        <div
          v-for="(step, index) in form.instructions"
          :key="index"
          class="instruction-row"
        >
          <span class="step-num">{{ index + 1 }}</span>
          <textarea
            v-model="form.instructions[index]"
            rows="2"
            :placeholder="`Step ${index + 1}...`"
          />
          <button @click="removeInstruction(index)" class="remove-btn">✕</button>
        </div>
        <button @click="addInstruction" class="add-row-btn">+ Add Step</button>
      </div>

      <!-- Notes -->
      <div class="form-section">
        <h2>Notes <span class="optional">(optional)</span></h2>
        <div class="field">
          <textarea v-model="form.notes" rows="3" placeholder="Tips, substitutions, storage instructions..." />
        </div>
      </div>

      <button @click="handleSubmit" :disabled="saving" class="submit-btn">
        {{ saving ? 'Saving...' : 'Save Recipe' }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import API_BASE from '../api';
import { isLoggedIn, getToken } from '../auth';

export default {
  name: 'AddRecipe',
  data() {
    return {
      form: {
        title: '',
        category: '',
        prep_time: '',
        cook_time: '',
        servings: '',
        description: '',
        notes: '',
        ingredients: [
          { amount: '', unit: '', item: '' }
        ],
        instructions: [''],
      },
      imageFile: null,
      imagePreview: null,
      saving: false,
      success: false,
      error: null,
      categories: ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks', 'Sides', 'Drinks'],
    }
  },
  mounted() {
    if (!isLoggedIn()) {
      this.$router.push('/login');
    }
  },
  methods: {
    handleImageChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.imageFile = file;
      this.imagePreview = URL.createObjectURL(file);
    },
    addIngredient() {
      this.form.ingredients.push({ amount: '', unit: '', item: '' });
    },
    removeIngredient(index) {
      this.form.ingredients.splice(index, 1);
    },
    addInstruction() {
      this.form.instructions.push('');
    },
    removeInstruction(index) {
      this.form.instructions.splice(index, 1);
    },
    async handleSubmit() {
      this.error = null;

      if (!this.form.title || !this.form.category || !this.form.prep_time || !this.form.cook_time || !this.form.servings) {
        this.error = 'Please fill in all required fields.';
        return;
      }

      if (this.form.ingredients.some(i => !i.item)) {
        this.error = 'All ingredients must have a name.';
        return;
      }

      if (this.form.instructions.some(s => !s.trim())) {
        this.error = 'All instruction steps must have content.';
        return;
      }

      this.saving = true;

      try {
        // Use FormData since we're sending a file + JSON
        const formData = new FormData();
        formData.append('title', this.form.title);
        formData.append('category', this.form.category);
        formData.append('prep_time', this.form.prep_time);
        formData.append('cook_time', this.form.cook_time);
        formData.append('servings', this.form.servings);
        formData.append('description', this.form.description);
        formData.append('notes', this.form.notes);
        formData.append('ingredients', JSON.stringify(this.form.ingredients));
        formData.append('instructions', JSON.stringify(this.form.instructions));

        if (this.imageFile) {
          formData.append('image', this.imageFile);
        }

        await axios.post(`${API_BASE}/api/recipes`, formData, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data',
          }
        });

        this.success = true;
        this.form = {
          title: '', category: '', prep_time: '', cook_time: '',
          servings: '', description: '', notes: '',
          ingredients: [{ amount: '', unit: '', item: '' }],
          instructions: [''],
        };
        this.imageFile = null;
        this.imagePreview = null;
      } catch (err) {
        this.error = err.response?.data?.error || 'Something went wrong saving the recipe.';
      } finally {
        this.saving = false;
      }
    }
  }
}
</script>

<style scoped>
.add-recipe h1 {
  color: #5C3317;
}

.form-section {
  background: #FFFDF7;
  border: 1px solid #E8DCC8;
  border-radius: 8px;
  padding: 28px;
  margin-bottom: 24px;
}

.form-section h2 {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  color: #5C3317;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #E8DCC8;
}

.optional {
  font-size: 14px;
  color: #8B6E4E;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
}

.field {
  margin-bottom: 16px;
}

.field-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
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

input, select, textarea {
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

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #C8860A;
}

.image-preview {
  margin-top: 12px;
}

.image-preview img {
  max-width: 300px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #E8DCC8;
}

.ingredients-header {
  display: grid;
  grid-template-columns: 100px 100px 1fr 36px;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8B6E4E;
  margin-bottom: 8px;
  padding: 0 4px;
}

.ingredient-row {
  display: grid;
  grid-template-columns: 100px 100px 1fr 36px;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.instruction-row {
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  gap: 12px;
  margin-bottom: 12px;
  align-items: start;
}

.step-num {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 700;
  color: #C8860A;
  line-height: 1;
  padding-top: 8px;
  text-align: center;
}

.remove-btn {
  background: #FDEAEA;
  color: #C0392B;
  border: none;
  border-radius: 4px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 12px;
  font-family: 'Lato', sans-serif;
  margin-top: 2px;
}

.remove-btn:hover {
  background: #C0392B;
  color: white;
}

.add-row-btn {
  background: #F5E6C8;
  color: #8B4513;
  border: 1px dashed #C8860A;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  margin-top: 4px;
}

.add-row-btn:hover {
  background: #F5DBA8;
}

.submit-btn {
  background: #8B4513;
  color: #F5E6C8;
  border: none;
  padding: 14px 40px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.submit-btn:hover {
  background: #5C3317;
}

.submit-btn:disabled {
  background: #C4A882;
  cursor: not-allowed;
}

.success {
  background: #E8F5E9;
  color: #2E7D32;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}

.success a {
  color: #2E7D32;
  font-weight: 600;
}

.error {
  background: #FDEAEA;
  color: #C0392B;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}
</style>