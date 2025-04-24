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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' }, mb: 1 }}>
      <Box sx={{ fontSize: '0.95em', fontWeight: 500, color: 'text.secondary', minWidth: 110, whiteSpace: 'nowrap' }}>
        Отбор по адресам
      </Box>
      <Autocomplete
        multiple
        size="small"
        options={addresses}
        getOptionLabel={option => option.name}
        value={selectedObjs}
        onChange={(_, value) => setSelectedAddresses(value.map(a => a.id))}
        renderInput={params => <TextField {...params} label="Адреса" variant="outlined" sx={{ minWidth: 140, maxWidth: 320, m: 0, my: 0.5 }} />}
        disableCloseOnSelect
        sx={{ minWidth: 140, maxWidth: 320, bgcolor: 'background.paper', borderRadius: 1, m: 0, my: 0.5,
          '.MuiChip-root': { height: 24, fontSize: '0.85em', m: '1px' }
        }}
      />
    </Box>
  );
};
