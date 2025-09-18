import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => onSearch(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search Recipes..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
