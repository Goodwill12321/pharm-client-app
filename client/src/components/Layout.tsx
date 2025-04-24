import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthMenu from './AuthMenu';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { UpdatePWAButton } from './UpdatePWAButton';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { useDebts } from '../hooks/useDebtsQuery';
import { Debitorka } from './PdzTable';
import { useClientsQuery } from '../hooks/useClientsQuery';
import { AddressFilter } from './AddressFilter';
import { useAddressFilter } from '../context/AddressFilterContext';
import Chip from '@mui/material/Chip';
const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/debts', label: 'Задолженности' },
  { to: '/invoices', label: 'Накладные' },
  { to: '/certificates', label: 'Сертификаты' },
  { to: '/claims', label: 'Претензии' },
  { to: '/news', label: 'Новости' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Получаем данные о задолженностях через React Query
  const { data: debts = [], isLoading: loadingOverdue, error: errorOverdue, refetch } = useDebts();

  const { data: clients = [], isLoading: loadingClients, error: errorClients } = useClientsQuery();
  const { selectedAddresses, setSelectedAddresses } = useAddressFilter();
  const selected = clients.filter(c => selectedAddresses.includes(c.id));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleDrawerClose = () => setDrawerOpen(false);

  const { isAuthenticated, login, loading, error } = useAuth();
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Показываем AuthMenu, если не авторизован
  if (!isAuthenticated) {
    return (
      <AuthMenu open={true} onLogin={login} loading={loading} error={error} />
    );
  }

  // Функция для повторного входа (смены пользователя)
  const handleReAuth = (loginValue: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    login(loginValue, password)
      .then(() => setAuthMenuOpen(false))
      .catch((e: any) => setAuthError(e?.message || 'Ошибка авторизации'))
      .finally(() => setAuthLoading(false));
  };

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

          {/* Маленькая иконка пользователя для смены пользователя */}
          <IconButton color="inherit" sx={{ ml: 1 }} onClick={() => setAuthMenuOpen(true)} size="small">
            <AccountCircleIcon fontSize="medium" />
          </IconButton>

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
                        {item.label === 'Задолженности' ? (() => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const sum = debts.filter((d: Debitorka) => {
  if (!d.payDate) return false;
  const payDate = new Date(d.payDate);
  payDate.setHours(0,0,0,0);
  return payDate < today;
}).reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0);
  if (sum > 0) {
    return (
      <Badge
        color="error"
        badgeContent={`${sum.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽`}
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
    );
  } else {
    return (
      <ListItemButton
        component={Link}
        to={item.to}
        onClick={handleDrawerClose}
      >
        <ListItemText primary={item.label} />
      </ListItemButton>
    );
  }
})() : (
  <ListItemButton
    component={Link}
    to={item.to}
    onClick={handleDrawerClose}
  >
    <ListItemText primary={item.label} />
  </ListItemButton>
)}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navLinks.map((item) => {
  if (item.label === 'Задолженности') {
    const today = new Date();
    today.setHours(0,0,0,0);
    const sum = debts.filter((d: Debitorka) => {
      if (!d.payDate) return false;
      const payDate = new Date(d.payDate);
      payDate.setHours(0,0,0,0);
      return payDate < today;
    }).reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0);
    return sum > 0 ? (
      <Badge
        key={item.to}
        color="error"
        badgeContent={`${sum.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽`}
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
    );
  } else {
    return (
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
    );
  }
})}

            </Box>
          )}
          {/* AddressFilter — глобальный фильтр по адресам */}
          <Box sx={{ ml: 2, display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            {loadingClients ? (
              <Typography variant="caption" sx={{ color: 'white' }}>Загрузка адресов...</Typography>
            ) : errorClients ? (
              <Typography variant="caption" sx={{ color: 'error.main' }}>Ошибка загрузки адресов</Typography>
            ) : clients.length === 0 ? null : (
              <>
                <AddressFilter addresses={clients.map(c => ({ id: c.id, name: c.name }))} />
                {selected.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                    {selected.map(addr => (
                      <Chip
                        key={addr.id}
                        label={addr.name}
                        size="small"
                        onDelete={() => setSelectedAddresses(selectedAddresses.filter(id => id !== addr.id))}
                        sx={{ bgcolor: 'background.paper', fontSize: '0.8rem' }}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: { xs: 1, sm: 2 } }}>{children}</Box>
    </>
  );
};

export default Layout;
