import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch recipes from API by name
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async (query = '') => {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    return response.data.meals || [];
  }
);

// Fetch recipe by ID
export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (id) => {
    const localRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const found = localRecipes.find(r => r.id === id);
    if (found) return found;

    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    return response.data.meals[0];
  }
);

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    list: [],
    filteredList: [],
    categories: [],
    selectedRecipe: null,
    status: 'idle',
  },
  reducers: {
    addRecipe: (state, action) => {
      const newRecipe = { id: Date.now(), ...action.payload };
      const localRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
      localRecipes.push(newRecipe);
      localStorage.setItem('recipes', JSON.stringify(localRecipes));

      state.list.unshift(newRecipe);
      state.filteredList.unshift(newRecipe);
    },
    updateRecipe: (state, action) => {
      const updated = action.payload;
      const localRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
      const index = localRecipes.findIndex(r => r.id === updated.id);
      if (index > -1) localRecipes[index] = updated;
      localStorage.setItem('recipes', JSON.stringify(localRecipes));

      state.list = state.list.map(r => (r.id === updated.id ? updated : r));
      state.filteredList = state.filteredList.map(r => (r.id === updated.id ? updated : r));
    },
    deleteRecipe: (state, action) => {
      const id = action.payload;
      const localRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
      localStorage.setItem('recipes', JSON.stringify(localRecipes.filter(r => r.id !== id)));

      state.list = state.list.filter(r => r.id !== id);
      state.filteredList = state.filteredList.filter(r => r.id !== id);
    },
    filterRecipes: (state, action) => {
      const category = action.payload;
      state.filteredList = category
        ? state.list.filter(r => (r.strCategory || r.category) === category)
        : state.list;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        const localRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
        state.list = [...localRecipes, ...action.payload];
        state.filteredList = state.list;
        state.categories = [...new Set(state.list.map(r => r.strCategory || r.category))];
        state.status = 'succeeded';
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.selectedRecipe = action.payload;
      });
  }
});

export const { addRecipe, updateRecipe, deleteRecipe, filterRecipes } = recipesSlice.actions;
export default recipesSlice.reducer;
