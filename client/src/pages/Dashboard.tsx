import React, { useState } from 'react';
import { Box, Typography, Grid, Modal, CircularProgress, Alert } from '@mui/material';
import { useEffect } from 'react';
import { fetchDebtsWithFilter } from '../api/debts';
import { OverdueBadgeButton } from '../components/OverdueBadgeButton';
import { SummaryBadgeButton } from '../components/SummaryBadgeButton';
import { useNavigate } from 'react-router-dom';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleTileClick = (type: 'all' | 'overdue' | 'today' | 'notdue') => {
    navigate(`/debts?type=${type}`);
  };

  const [allDebts, setAllDebts] = useState<Debitorka[]>([]);
  const [allLoading, setAllLoading] = useState(false);
  const navigate = useNavigate();

  // Загружаем всю дебиторку для бейджей (только доступную для контакта)
  useEffect(() => {
    setAllLoading(true);
    fetchDebtsWithFilter()
      .then(setAllDebts)
      .catch(() => setAllDebts([]))
      .finally(() => setAllLoading(false));
  }, []);

  // Суммы для бейджей
  const today = new Date();
  today.setHours(0,0,0,0);
  const sumAll = allDebts.reduce((acc, d) => acc + (d.sumDolg || 0), 0);
  const countAll = allDebts.length;
  const overdueDebts = allDebts.filter(d => {
    if (!d.payDate) return false;
    const payDate = new Date(d.payDate);
    payDate.setHours(0,0,0,0);
    return payDate < today;
  });
  const sumOverdue = overdueDebts.reduce((acc, d) => acc + (d.sumDolg || 0), 0);
  const countOverdue = overdueDebts.length;
  const todayDebts = allDebts.filter(d => {
    if (!d.payDate) return false;
    const payDate = new Date(d.payDate);
    payDate.setHours(0,0,0,0);
    return payDate.getTime() === today.getTime();
  });
  const sumToday = todayDebts.reduce((acc, d) => acc + (d.sumDolg || 0), 0);
  const countToday = todayDebts.length;
  const notDueDebts = allDebts.filter(d => {
    if (!d.payDate) return false;
    const payDate = new Date(d.payDate);
    payDate.setHours(0,0,0,0);
    return payDate > today;
  });
  const sumNotDue = notDueDebts.reduce((acc, d) => acc + (d.sumDolg || 0), 0);
  const countNotDue = notDueDebts.length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Главная</Typography>
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
