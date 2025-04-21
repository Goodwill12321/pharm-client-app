import React from 'react';
import { Box, Button, Typography } from '@mui/material';

export type PdzFilterKey = 'today' | '3days' | '7days' | '14days' | '21days' | 'gt21days';

export const FILTERS: { key: PdzFilterKey; label: string; color: string }[] = [
  { key: 'today', label: 'Сегодня', color: '#1976d2' },
  { key: '3days', label: '1-3 дня', color: '#f57c00' },
  { key: '7days', label: '4-7 дней', color: '#ef5350' },
  { key: '14days', label: '8-14 дней', color: '#d32f2f' },
  { key: '21days', label: '15-21 день', color: '#8e24aa' },
  { key: 'gt21days', label: '>21 дня', color: '#424242' },
];

interface PdzFilterTilesProps {
  selected: PdzFilterKey[];
  onChange: (selected: PdzFilterKey[]) => void;
}

// Добавим проп hideToday для управления отображением плитки 'Сегодня'
interface PdzFilterTilesProps {
  selected: PdzFilterKey[];
  onChange: (selected: PdzFilterKey[]) => void;
  hideToday?: boolean;
}

export const PdzFilterTiles: React.FC<PdzFilterTilesProps> = ({ selected, onChange, hideToday }) => {
  const handleToggle = (key: PdzFilterKey) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <Box display="flex" gap={2} flexWrap="wrap" my={2}>
      {FILTERS.filter(f => !(hideToday && f.key === 'today')).map((f) => (
        <Button
          key={f.key}
          variant={selected.includes(f.key) ? 'contained' : 'outlined'}
          sx={{ backgroundColor: selected.includes(f.key) ? f.color : undefined, color: selected.includes(f.key) ? '#fff' : undefined, minWidth: 120, fontWeight: 600 }}
          onClick={() => handleToggle(f.key)}
        >
          {f.label}
        </Button>
      ))}
    </Box>
  );
};
