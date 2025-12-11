import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

interface SelectedFilterToggleProps {
  showSelectedOnly: boolean;
  onToggle: (showSelectedOnly: boolean) => void;
  selectedCount: number;
}

export const SelectedFilterToggle: React.FC<SelectedFilterToggleProps> = ({
  showSelectedOnly,
  onToggle,
  selectedCount
}) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="body2" sx={{ fontSize: { xs: '11px', sm: '12px' } }}>
        Фильтр:
      </Typography>
      <Button
        variant={showSelectedOnly ? 'contained' : 'outlined'}
        size="small"
        startIcon={<FilterListIcon />}
        onClick={() => onToggle(!showSelectedOnly)}
        sx={{
          fontSize: { xs: '10px', sm: '11px' },
          minWidth: { xs: 100, sm: 120 },
          fontWeight: 600
        }}
      >
        {showSelectedOnly ? `Выбранные (${selectedCount})` : 'Все накладные'}
      </Button>
    </Box>
  );
};
