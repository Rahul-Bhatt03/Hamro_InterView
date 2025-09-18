import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, filterRecipes } from '../slices/recipesSlice';
import { Box, Grid, Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';

export default function RecipeList() {
  const dispatch = useDispatch();
  const { filteredList, categories } = useSelector(state => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  const handleSearch = (query) => {
    dispatch(fetchRecipes(query));
  };

  const handleFilter = (category) => {
    dispatch(filterRecipes(category));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <SearchBar onSearch={handleSearch} />
        <Button component={Link} to="/add" variant="contained" color="success">
          Add Recipe
        </Button>
      </Stack>
      <Filters categories={categories} onFilter={handleFilter} />
      <Grid container spacing={2}>
        {filteredList.map(recipe => (
          <Grid item xs={12} sm={6} md={4} key={recipe.idMeal || recipe.id}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
