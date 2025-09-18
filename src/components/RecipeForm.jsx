import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { TextField, Button, Box, Stack } from '@mui/material';

export default function RecipeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); 
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
      const localRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
      const found = localRecipes.find(r => r.id === parseInt(id));
      if (found) {
        setRecipe(found);
        setLoading(false);
      } else {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
          .then(res => res.json())
          .then(data => {
            if (data.meals?.[0]) {
              const meal = data.meals[0];
              setRecipe({
                id: meal.idMeal,
                name: meal.strMeal,
                category: meal.strCategory,
                image: meal.strMealThumb,
                ingredients: Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`])
                  .filter(Boolean)
                  .join(', '),
                instructions: meal.strInstructions,
              });
            }
            setLoading(false);
          });
      }
    } else {
      // New recipe
      setLoading(false);
    }
  }, [stateRecipe, id]);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

    if (recipe.id) {
      // Update existing recipe
      savedRecipes = savedRecipes.map(r => r.id === recipe.id ? recipe : r);
    } else {
      // Add new recipe
      recipe.id = Date.now();
      savedRecipes.push(recipe);
    }

    localStorage.setItem('recipes', JSON.stringify(savedRecipes));
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
