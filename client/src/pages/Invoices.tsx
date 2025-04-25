import React from 'react';
import { useClientsQuery } from '../hooks/useClientsQuery';
import { AddressFilter } from '../components/AddressFilter';
import { Box, Typography } from '@mui/material';

const Invoices: React.FC = () => {
  const { data: clients = [], isLoading: loadingClients, error: errorClients } = useClientsQuery();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Накладные</Typography>
      <AddressFilter addresses={clients.map(c => ({ id: c.id, name: c.name }))} />
      {/* TODO: Фильтры, кнопки, таблица с накладными */}
      <Typography>Страница накладных (будет реализовано согласно ТЗ)</Typography>
    </Box>
  );
};

export default Invoices;
