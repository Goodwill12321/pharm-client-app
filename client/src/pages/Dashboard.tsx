import React, { useState } from 'react';
import { Box, Typography, Grid, Modal, CircularProgress, Alert } from '@mui/material';

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
  const [open, setOpen] = useState(false);
  const [overdue, setOverdue] = useState<Debitorka[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOverdueClick = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/debitorka/overdue');
      if (!response.ok) throw new Error('Ошибка при запросе');
      const data = await response.json();
      setOverdue(data);
    } catch (e: any) {
      setError(e.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Главная</Typography>
      {/* Блок с 4 интерактивными плитками задолженности */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ bgcolor: '#1976d2', color: '#fff', p: 2, borderRadius: 2, cursor: 'pointer' }}>Общая задолженность</Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ bgcolor: '#388e3c', color: '#fff', p: 2, borderRadius: 2, cursor: 'pointer' }}>Не просроченная задолженность</Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{ bgcolor: '#d32f2f', color: '#fff', p: 2, borderRadius: 2, cursor: 'pointer' }}
            onClick={handleOverdueClick}
          >
            Просроченная задолженность
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ bgcolor: '#ffa000', color: '#fff', p: 2, borderRadius: 2, cursor: 'pointer' }}>Подошедшие платежи</Box>
        </Grid>
      </Grid>

      {/* Модальное окно для отображения просроченной задолженности */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', bgcolor: 'background.paper',
          boxShadow: 24, p: 4, borderRadius: 2, minWidth: 320, maxHeight: 400, overflow: 'auto'
        }}>
          <Typography variant="h6" gutterBottom>Просроченная задолженность</Typography>
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {!loading && !error && overdue.length === 0 && (
            <Typography>Нет просроченной задолженности</Typography>
          )}
          {!loading && !error && overdue.length > 0 && (
            <ul>
              {overdue.map((item) => (
                <li key={item.id}>
                  Документ: {item.docUid}, Сумма: {item.sumDolg} ₽, Дата оплаты: {item.payDate}, Просрочено дней: {item.prosrochkaDay}
                </li>
              ))}
            </ul>
          )}
        </Box>
      </Modal>

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
