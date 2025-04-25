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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap', flexDirection: { xs: 'column', sm: 'row' }, mb: 1, width: 'auto' }}>


      <Autocomplete
        multiple
        size="small"
        options={addresses}
        getOptionLabel={option => option.name}
        value={selectedObjs}
        onChange={(_, value) => setSelectedAddresses(value.map(a => a.id))}
        renderInput={params => (
          <TextField
            {...params}
            label="Отбор по адресам"
            variant="outlined"
            sx={{
              minWidth: 150,
              width: '50%',
              maxWidth: 'none',
              m: 0,
              my: 0,
              p: 0,
              '.MuiInputBase-root': {
                minHeight: 36,
                fontSize: '0.95em',
                py: 0,
              },
              '.MuiInputLabel-root': {
                fontSize: '0.82em',
                top: '-2px',
              },
              '.MuiOutlinedInput-input': {
                py: '7px',
                fontSize: '0.95em',
              },
            }}
            InputProps={{ ...params.InputProps, style: { minHeight: 36, fontSize: '0.95em', padding: 0 } }}
          />
        )}
        disableCloseOnSelect
        sx={{
          minWidth: 480,
          width: '50%',
          maxWidth: 'none',
          bgcolor: 'background.paper',
          borderRadius: 1,
          m: 0,
          my: 0,
          fontSize: '1.08em',
          '.MuiChip-root': {
            height: 28,
            fontSize: '0.82em',
            m: '1px',
            px: 1,
            py: 0,
            borderRadius: '8px',
            maxWidth: 180,
            whiteSpace: 'nowrap',
          },
          '.MuiAutocomplete-tag': {
            display: 'inline-flex',
            flexWrap: 'nowrap',
            maxWidth: '100%',
            overflowX: 'auto',
            alignItems: 'center',
            m: '2px',
          },
          '.MuiAutocomplete-inputRoot': {
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            alignItems: 'center',
          },

          '.MuiAutocomplete-listbox': {
            fontSize: '0.85em',
          },
        }}
        ListboxProps={{
          style: {
            maxHeight: 220,
            fontSize: '0.85em',
          },
        }}
      />
    </Box>
  );
};
