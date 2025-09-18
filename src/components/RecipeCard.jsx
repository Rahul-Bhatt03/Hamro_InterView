import { Card, CardContent, CardMedia, Typography, Button, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteRecipe } from '../slices/recipesSlice';

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteRecipe(recipe.id));
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
      }}
      onClick={() => navigate(`/recipe/${recipe.idMeal || recipe.id}`)}
    >
      <Box
        sx={{
          overflow: 'hidden',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          width: '100%',
          height: 200,
        }}
      >
        <CardMedia
          component="img"
          image={recipe.strMealThumb || recipe.image}
          alt={recipe.strMeal || recipe.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {recipe.strMeal || recipe.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {recipe.strCategory || recipe.category}
        </Typography>

        <Stack direction="row" spacing={1} mt={1}>
          {/* Edit Button */}
          <Button
            variant="outlined"
            size="small"
            sx={{
              textTransform: 'none',
              borderColor: 'warning.main',
              color: 'warning.main',
              '&:hover': { backgroundColor: 'warning.main', color: 'white' },
            }}
            onClick={(e) => {
              e.stopPropagation(); // prevent navigating to detail page
              navigate(`/add`, { state: { recipeToEdit: recipe } });
            }}
          >
            Edit
          </Button>

          {/* Delete Button */}
          <Button
            color="error"
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation(); // prevent navigating to detail page
              handleDelete();
            }}
            sx={{
              textTransform: 'none',
              borderColor: 'error.main',
              '&:hover': { backgroundColor: 'error.main', color: 'white' },
            }}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
