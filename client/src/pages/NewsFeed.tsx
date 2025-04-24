import React from 'react';
import { useClientsQuery } from '../hooks/useClientsQuery';
import { AddressFilter } from '../components/AddressFilter';
import { Box, Typography } from '@mui/material';

const NewsFeed: React.FC = () => {
  const { data: clients = [], isLoading: loadingClients, error: errorClients } = useClientsQuery();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Новости</Typography>
      <Typography variant="h6" sx={{ mb: 1 }}>Отбор по адресам</Typography>
      <AddressFilter addresses={clients.map(c => ({ id: c.id, name: c.name }))} />
      {/* TODO: Новостная лента ЛК */}
      <Typography>Новостная лента (будет реализовано согласно ТЗ)</Typography>
    </Box>
  );
};

export default NewsFeed;
