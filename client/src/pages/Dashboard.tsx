import React from 'react';
import { useDebts } from '../hooks/useDebtsQuery';
import { Box, Typography, Grid, Modal, CircularProgress, Alert, Chip } from '@mui/material';
import { useEffect } from 'react';
import { fetchDebtsWithFilter } from '../api/debts';
import { OverdueBadgeButton } from '../components/OverdueBadgeButton';
import { SummaryBadgeButton } from '../components/SummaryBadgeButton';
import { useNavigate } from 'react-router-dom';
import { useClientsQuery } from '../hooks/useClientsQuery';
import { AddressFilter } from '../components/AddressFilter';
import { useAddressFilter } from '../context/AddressFilterContext';

// Тип для одной записи дебиторки
type Debitorka = {
  id: number;
  docUid: string;
  ulUid: string;
  otsrochkaDay: number;
  payDate: string;
  ostatokDay: number;
  prosrochkaDay: number;
  sumDoc: number;
  sumPaid: number;
  sumDolg: number;
};

const Dashboard: React.FC = () => {
  const { data: clients = [], isLoading: loadingClients, error: errorClients } = useClientsQuery();
  const navigate = useNavigate();
  const { data: allDebts = [], isLoading: allLoading, error: allError } = useDebts();
  const { selectedAddresses, setSelectedAddresses } = useAddressFilter();
  const selected = clients.filter(c => selectedAddresses.includes(c.id));

  const handleTileClick = (type: 'all' | 'overdue' | 'today' | 'notdue') => {
    navigate(`/debts?type=${type}`);
  };

  if (allLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (allError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="error">
          {typeof allError === 'string' ? allError : (allError instanceof Error ? allError.message : String(allError))}
        </Alert>
      </Box>
    );
  }

  // Суммы для бейджей
  const today = new Date();
  today.setHours(0,0,0,0);
  const sumAll = allDebts.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0);
  const countAll = allDebts.length;
  const overdueDebts = allDebts.filter((d: Debitorka) => {
    if (!d.payDate) return false;
    const payDate = new Date(d.payDate);
    payDate.setHours(0,0,0,0);
    return payDate < today;
  });
  const sumOverdue = overdueDebts.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0);
  const countOverdue = overdueDebts.length;
  const todayDebts = allDebts.filter((d: Debitorka) => {
    if (!d.payDate) return false;
    const payDate = new Date(d.payDate);
    payDate.setHours(0,0,0,0);
    return payDate.getTime() === today.getTime();
  });
  const sumToday = todayDebts.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0);
  const countToday = todayDebts.length;
  const notDueDebts = allDebts.filter((d: Debitorka) => {
    if (!d.payDate) return false;
    const payDate = new Date(d.payDate);
    payDate.setHours(0,0,0,0);
    return payDate > today;
  });
  const sumNotDue = notDueDebts.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0);
  const countNotDue = notDueDebts.length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Главная</Typography>
      <AddressFilter addresses={clients.map(c => ({ id: c.id, name: c.name }))} />
      {/* AddressFilter и чипсы выбранных адресов */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box>
          
        </Box>
        
      </Box>
      {/* Блок с бейджами в одну линию */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <SummaryBadgeButton
          label="Общая задолженность"
          sum={sumAll}
          docCount={countAll}
          color="#1976d2"
          loading={allLoading}
          onClick={() => handleTileClick('all')}
        />
        <OverdueBadgeButton
          sum={sumOverdue}
          docCount={countOverdue}
          loading={allLoading}
          onClick={() => handleTileClick('overdue')}
        />
        <SummaryBadgeButton
          label="Подошедшие платежи (сегодня)"
          sum={sumToday}
          docCount={countToday}
          color="#ffa000"
          loading={allLoading}
          onClick={() => handleTileClick('today')}
        />
        <SummaryBadgeButton
          label="Не просроченная задолженность"
          sum={sumNotDue}
          docCount={countNotDue}
          color="#388e3c"
          loading={allLoading}
          onClick={() => handleTileClick('notdue')}
        />
      </Box>

      {/* TODO: Новостная лента ЛК */}
      <Typography variant="h5" gutterBottom>Новости</Typography>
      <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, minHeight: 120 }}>
        {/* Здесь будет новостная лента */}
        <Typography>Здесь будет новостная лента ЛК</Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
