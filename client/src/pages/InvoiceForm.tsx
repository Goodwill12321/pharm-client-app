import React from 'react';
import { useClientsQuery } from '../hooks/useClientsQuery';
import { AddressFilter } from '../components/AddressFilter';
import { Box, Typography } from '@mui/material';

const InvoiceForm: React.FC = () => {
  const { data: clients = [], isLoading: loadingClients, error: errorClients } = useClientsQuery();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Форма накладной</Typography>
      <AddressFilter addresses={clients.map(c => ({ id: c.id, name: c.name }))} />
      {/* TODO: Шапка, фильтры, кнопки, таблица товаров */}
      <Typography>Форма накладной (будет реализовано согласно ТЗ)</Typography>
    </Box>
  );
};

export default InvoiceForm;
