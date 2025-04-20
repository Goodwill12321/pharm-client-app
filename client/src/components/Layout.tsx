import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ClientApp
        </Typography>
        <Button color="inherit" component={Link} to="/">Главная</Button>
        <Button color="inherit" component={Link} to="/debts">Задолженности</Button>
        <Button color="inherit" component={Link} to="/invoices">Накладные</Button>
        <Button color="inherit" component={Link} to="/certificates">Сертификаты</Button>
        <Button color="inherit" component={Link} to="/claims">Претензии</Button>
        <Button color="inherit" component={Link} to="/news">Новости</Button>
      </Toolbar>
    </AppBar>
    <Box sx={{ p: 2 }}>{children}</Box>
  </>
);

export default Layout;
