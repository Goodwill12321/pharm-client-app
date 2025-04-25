import React from 'react';
import { useClientsQuery } from '../hooks/useClientsQuery';
import { AddressFilter } from '../components/AddressFilter';
import { Box, Typography } from '@mui/material';

const Claims: React.FC = () => {
  const { data: clients = [], isLoading: loadingClients, error: errorClients } = useClientsQuery();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Претензии</Typography>
      <AddressFilter addresses={clients.map(c => ({ id: c.id, name: c.name }))} />
      {/* TODO: Фильтры, кнопки, таблица претензий */}
      <Typography>Страница претензий (будет реализовано согласно ТЗ)</Typography>
    </Box>
  );
};

export default Claims;
