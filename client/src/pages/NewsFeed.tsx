import React from 'react';
import { Box, Typography } from '@mui/material';

const NewsFeed: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Новости</Typography>
      {/* TODO: Новостная лента ЛК */}
      <Typography>Новостная лента (будет реализовано согласно ТЗ)</Typography>
    </Box>
  );
};

export default NewsFeed;
