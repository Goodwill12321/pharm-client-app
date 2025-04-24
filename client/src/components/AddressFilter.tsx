import React, { useEffect, useState } from 'react';
import { Checkbox, List, ListItem, ListItemText, ListItemIcon, Typography, Box, Button, Autocomplete, TextField } from '@mui/material';
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
  const [localSelected, setLocalSelected] = useState<string[]>(selectedAddresses);

  useEffect(() => {
    setLocalSelected(selectedAddresses);
  }, [selectedAddresses]);

  // Если адресов много — используем Autocomplete с мультивыбором
  if (addresses.length > 10) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          multiple
          size="small"
          options={addresses}
          getOptionLabel={option => option.name}
          value={addresses.filter(a => localSelected.includes(a.id))}
          onChange={(_, value) => setLocalSelected(value.map(a => a.id))}
          renderInput={params => <TextField {...params} label="Адреса" variant="outlined" sx={{ minWidth: 200, maxWidth: 300 }} />}
          disableCloseOnSelect
          sx={{ minWidth: 200, maxWidth: 300, bgcolor: 'background.paper', borderRadius: 1, mx: 1 }}
        />
        <Button variant="contained" size="small" sx={{ ml: 1 }} onClick={() => setSelectedAddresses(localSelected)}>
          Применить
        </Button>
        {localSelected.length > 0 && (
          <Button variant="outlined" size="small" color="secondary" sx={{ ml: 1 }} onClick={() => setSelectedAddresses([])}>
            Сбросить
          </Button>
        )}
      </Box>
    );
  }

  // Если адресов мало — обычный список чекбоксов
  const handleToggle = (id: string) => {
    const currentIndex = localSelected.indexOf(id);
    const newSelected = [...localSelected];
    if (currentIndex === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setLocalSelected(newSelected);
  };

  const handleApply = () => {
    setSelectedAddresses(localSelected);
  };

  return (
    <Box>
      <List dense sx={{ display: 'flex', flexDirection: 'row', gap: 1, p: 0, m: 0 }}>
        {addresses.map(addr => (
          <ListItem key={addr.id} disablePadding sx={{ width: 'auto' }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Checkbox
                edge="start"
                checked={localSelected.includes(addr.id)}
                tabIndex={-1}
                disableRipple
                size="small"
                onChange={() => handleToggle(addr.id)}
              />
            </ListItemIcon>
            <ListItemText primary={addr.name} primaryTypographyProps={{ fontSize: '0.85rem' }} />
          </ListItem>
        ))}
        <Button variant="contained" size="small" sx={{ ml: 1 }} onClick={handleApply}>
          Применить
        </Button>
        {localSelected.length > 0 && (
          <Button variant="outlined" size="small" color="secondary" sx={{ ml: 1 }} onClick={() => setSelectedAddresses([])}>
            Сбросить
          </Button>
        )}
      </List>
    </Box>
  );
};
