import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Box, Stack } from '@mui/material';
import { addRecipe, updateRecipe, fetchRecipeById } from '../slices/recipesSlice';

export default function RecipeForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const selectedRecipe = useSelector((state) => state.recipes.selectedRecipe);

  const stateRecipe = location.state?.recipeToEdit;

  const [recipe, setRecipe] = useState({
    name: '',
    category: '',
    image: '',
    ingredients: '',
    instructions: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stateRecipe) {
      setRecipe(stateRecipe);
      setLoading(false);
    } else if (id) {
      dispatch(fetchRecipeById(parseInt(id))).then(() => setLoading(false));
    } else {
      setLoading(false); 
    }
  }, [dispatch, id, stateRecipe]);

  useEffect(() => {
    if (!stateRecipe && selectedRecipe) {
      setRecipe({
        id: selectedRecipe.id,
        name: selectedRecipe.name || selectedRecipe.strMeal,
        category: selectedRecipe.category || selectedRecipe.strCategory,
        image: selectedRecipe.image || selectedRecipe.strMealThumb,
        ingredients: selectedRecipe.ingredients ||
          Array.from({ length: 20 }, (_, i) => selectedRecipe[`strIngredient${i + 1}`])
               .filter(Boolean)
               .join(', '),
        instructions: selectedRecipe.instructions || selectedRecipe.strInstructions,
      });
    }
  }, [selectedRecipe, stateRecipe]);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (recipe.id) {
      dispatch(updateRecipe(recipe));
    } else {
      dispatch(addRecipe(recipe));
    }
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Stack spacing={2}>
        <TextField label="Recipe Name" name="name" value={recipe.name} onChange={handleChange} required fullWidth />
        <TextField label="Category" name="category" value={recipe.category} onChange={handleChange} fullWidth />
        <TextField label="Image URL" name="image" value={recipe.image} onChange={handleChange} fullWidth />
        <TextField
          label="Ingredients (comma separated)"
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          label="Instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained">
          {recipe.id ? 'Update Recipe' : 'Add Recipe'}
        </Button>
      </Stack>
    </Box>
  );
}
