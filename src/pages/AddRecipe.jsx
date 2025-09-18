import { Box, Typography } from '@mui/material';
import RecipeForm from '../components/RecipeForm';

export default function AddRecipe() {
  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Add New Recipe
      </Typography>
      <RecipeForm />
    </Box>
  );
}
