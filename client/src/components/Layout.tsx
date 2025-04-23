import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthMenu from './AuthMenu';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { UpdatePWAButton } from './UpdatePWAButton';
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
import Badge from '@mui/material/Badge';
import { fetchOverdueSummary } from '../api/debts';

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/debts', label: 'Задолженности' },
  { to: '/invoices', label: 'Накладные' },
  { to: '/certificates', label: 'Сертификаты' },
  { to: '/claims', label: 'Претензии' },
  { to: '/news', label: 'Новости' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overdueSummary, setOverdueSummary] = useState<{ doc_count: number; sum: number } | null>(null);
  const [loadingOverdue, setLoadingOverdue] = useState(false);
  const [errorOverdue, setErrorOverdue] = useState<string | null>(null);

  useEffect(() => {
    setLoadingOverdue(true);
    fetchOverdueSummary()
      .then(setOverdueSummary)
      .catch(() => setErrorOverdue('Ошибка при загрузке задолженности'))
      .finally(() => setLoadingOverdue(false));
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleDrawerClose = () => setDrawerOpen(false);

  const { isAuthenticated, login, loading, error, logout } = useAuth();
  // Показываем AuthMenu, если не авторизован
  if (!isAuthenticated) {
    return (
      <AuthMenu open={true} onLogin={login} loading={loading} error={error} />
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
          <Typography
            variant="h6"
            sx={{ flexGrow: 0, fontSize: { xs: '1.1rem', sm: '1.25rem' }, whiteSpace: 'nowrap', minWidth: 0 }}
          >
            ClientApp
          </Typography>
          <UpdatePWAButton />

          {/* Кнопка выхода */}
          <Button color="inherit" onClick={logout} sx={{ ml: 2 }}>
            Выйти
          </Button>

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
                        <Badge
                          color="error"
                          badgeContent={
                            item.label === 'Задолженности' && overdueSummary && overdueSummary.sum > 0
                              ? `${overdueSummary.sum.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽`
                              : null
                          }
                          overlap="rectangular"
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                          <ListItemButton
                            component={Link}
                            to={item.to}
                            onClick={handleDrawerClose}
                          >
                            <ListItemText primary={item.label} />
                          </ListItemButton>
                        </Badge>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navLinks.map((item) => (
                item.label === 'Задолженности' ? (
                  <Badge
                    key={item.to}
                    color="error"
                    badgeContent={
                      overdueSummary && overdueSummary.sum > 0
                        ? `${overdueSummary.sum.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽`
                        : null
                    }
                    overlap="rectangular"
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <Button
                      color="inherit"
                      component={Link}
                      to={item.to}
                      size="medium"
                      sx={{ minWidth: 100 }}
                    >
                      {item.label}
                    </Button>
                  </Badge>
                ) : (
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
                )
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
