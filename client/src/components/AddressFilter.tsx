import React, { useEffect, useState } from 'react';
import { Checkbox, List, ListItem, ListItemText, ListItemIcon, Typography, Box, Button, Autocomplete, TextField, Chip } from '@mui/material';
import { useAddressFilter } from '../context/AddressFilterContext';

// Тип адреса (можно заменить на ваш реальный тип)
type Address = {
  id: string;
  name: string;
};

interface AddressFilterProps {
  addresses: Address[];
}

export const AddressFilter: React.FC<AddressFilterProps> = ({ addresses }) => {
  const { selectedAddresses, setSelectedAddresses } = useAddressFilter();

  // Найти выбранные объекты адресов по id
  const selectedObjs = addresses.filter(a => selectedAddresses.includes(a.id));

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'nowrap', flexDirection: { xs: 'column', sm: 'row' }, m: 0, mb: 0, mr: 0, ml: 0, px: 0, py: 0, width: 'auto' }}>
      <Autocomplete
        multiple
        size="small"
        options={addresses}
        getOptionLabel={option => option.name}
        sx={{ p: 0, m: 0, minWidth: 150, width: 'auto', maxWidth: 'none' }}
        value={selectedObjs}
        onChange={(_, value) => setSelectedAddresses(value.map(a => a.id))}
        renderInput={(params) => (
          <TextField {...params} label="Отбор по адресам" placeholder="Адрес" size="small" sx={{ p: 0, m: 0, minWidth: 150, width: 'auto', maxWidth: 'none' }} />
        )}
      />
    </Box>
  );
};
