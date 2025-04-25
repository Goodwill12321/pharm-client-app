import React from 'react';
import { useClientsQuery } from '../hooks/useClientsQuery';
import { AddressFilter } from '../components/AddressFilter';
import { Box, Typography } from '@mui/material';

const ClaimForm: React.FC = () => {
  const { data: clients = [], isLoading: loadingClients, error: errorClients } = useClientsQuery();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Форма претензии</Typography>
      <AddressFilter addresses={clients.map(c => ({ id: c.id, name: c.name }))} />
      {/* TODO: Форма создания/просмотра претензии, чат, таблица товаров */}
      <Typography>Форма претензии (будет реализовано согласно ТЗ)</Typography>
    </Box>
  );
};

export default ClaimForm;
