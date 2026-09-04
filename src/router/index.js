import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Recipe from '../views/Recipe.vue';
import AddRecipe from '../views/AddRecipe.vue';
import Login from '../views/Login.vue';
import EditRecipe from '../views/EditRecipe.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/recipe/:id', component: Recipe },
  { path: '/add', component: AddRecipe },
  { path: '/login', component: Login },
  { path: '/edit/:id', component: EditRecipe },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;