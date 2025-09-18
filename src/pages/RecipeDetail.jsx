import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipeById } from '../slices/recipesSlice';
import { Box, Typography, CardMedia, Button, List, ListItem } from '@mui/material';

export default function RecipeDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedRecipe: recipe } = useSelector(state => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipeById(Number(id)));
  }, [dispatch, id]);

  if (!recipe) return <Typography p={2}>Loading...</Typography>;

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      <CardMedia
        component="img"
        height="300"
        image={recipe.strMealThumb || recipe.image}
        alt={recipe.strMeal || recipe.name}
        sx={{ borderRadius: 2 }}
      />
      <Typography variant="h4" mt={2} fontWeight={700}>
        {recipe.strMeal || recipe.name}
      </Typography>
      <Typography color="text.secondary">
        {recipe.strCategory || recipe.category}
      </Typography>
      <Typography variant="h6" mt={2}>Ingredients:</Typography>
      <List dense>
        {(recipe.strIngredient1
          ? Array.from({ length: 20 }, (_, i) => recipe[`strIngredient${i + 1}`]).filter(Boolean)
          : (recipe.ingredients || '').split(',')
        ).map((ing, i) => (
          <ListItem key={i} sx={{ py: 0 }}>• {ing}</ListItem>
        ))}
      </List>
      <Typography variant="h6" mt={2}>Instructions:</Typography>
      <Typography>{recipe.strInstructions || recipe.instructions}</Typography>
      <Button component={Link} to="/" sx={{ mt: 2 }}>
        Back to List
      </Button>
    </Box>
  );
}
