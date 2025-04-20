import React from 'react';
import { Box, Typography } from '@mui/material';

const Invoices: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Накладные</Typography>
      {/* TODO: Фильтры, кнопки, таблица с накладными */}
      <Typography>Страница накладных (будет реализовано согласно ТЗ)</Typography>
    </Box>
  );
};

export default Invoices;
