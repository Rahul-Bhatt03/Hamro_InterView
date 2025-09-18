import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function Filters({ categories, onFilter }) {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Category</InputLabel>
      <Select defaultValue="" onChange={(e) => onFilter(e.target.value)} label="Category">
        <MenuItem value="">All Categories</MenuItem>
        {categories.map(cat => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
