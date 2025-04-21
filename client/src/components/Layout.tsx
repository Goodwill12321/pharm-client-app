import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/debts', label: 'Задолженности' },
  { to: '/invoices', label: 'Накладные' },
  { to: '/certificates', label: 'Сертификаты' },
  { to: '/claims', label: 'Претензии' },
  { to: '/news', label: 'Новости' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleDrawerClose = () => setDrawerOpen(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' }, whiteSpace: 'nowrap', minWidth: 0 }}
          >
            ClientApp
          </Typography>

          {isMobile ? (
            <>
              <IconButton color="inherit" edge="end" onClick={handleDrawerToggle} aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerClose}
                PaperProps={{ sx: { width: 240 } }}
              >
                <Box sx={{ mt: 2 }}>
                  <List>
                    {navLinks.map((item) => (
                      <ListItem key={item.to} disablePadding>
                        <ListItemButton
                          component={Link}
                          to={item.to}
                          onClick={handleDrawerClose}
                        >
                          <ListItemText primary={item.label} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navLinks.map((item) => (
                <Button
                  key={item.to}
                  color="inherit"
                  component={Link}
                  to={item.to}
                  size="medium"
                  sx={{ minWidth: 100 }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ p: { xs: 1, sm: 2 } }}>{children}</Box>
    </>
  );
};

export default Layout;
