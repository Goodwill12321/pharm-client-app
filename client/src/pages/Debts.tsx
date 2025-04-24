import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Alert, TextField } from '@mui/material';
import { PdzTable, Debitorka } from '../components/PdzTable';
import { PdzFilterTiles, FILTERS, PdzFilterKey } from '../components/PdzFilterTiles';
import { useLocation } from 'react-router-dom';
import { fetchDebtsWithFilter } from '../api/debts';

const filterByTiles = (data: Debitorka[], tiles: PdzFilterKey[], type?: string) => {
  if (tiles.length === 0) return data;
  return data.filter(d => {
    return tiles.some(tile => {
      switch (tile) {
        case 'today':
          return d.ostatokDay === 0 && d.prosrochkaDay <= 0;
        case '3days':
          return type === 'overdue'
            ? d.prosrochkaDay >= 1 && d.prosrochkaDay <= 3
            : d.ostatokDay >= 1 && d.ostatokDay <= 3 && d.prosrochkaDay <= 0;
        case '7days':
          return type === 'overdue'
            ? d.prosrochkaDay >= 4 && d.prosrochkaDay <= 7
            : d.ostatokDay >= 4 && d.ostatokDay <= 7 && d.prosrochkaDay <= 0;
        case '14days':
          return type === 'overdue'
            ? d.prosrochkaDay >= 8 && d.prosrochkaDay <= 14
            : d.ostatokDay >= 8 && d.ostatokDay <= 14 && d.prosrochkaDay <= 0;
        case '21days':
          return type === 'overdue'
            ? d.prosrochkaDay >= 15 && d.prosrochkaDay <= 21
            : d.ostatokDay >= 15 && d.ostatokDay <= 21 && d.prosrochkaDay <= 0;
        case 'gt21days':
          return type === 'overdue'
            ? d.prosrochkaDay > 21
            : d.ostatokDay > 21 && d.prosrochkaDay <= 0;
        default:
          return false;
      }
    });
  });
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Debts: React.FC = () => {
  const query = useQuery();
  const type = query.get('type');
  const [data, setData] = useState<Debitorka[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tiles, setTiles] = useState<PdzFilterKey[]>([]);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    setTiles([]);
  }, [address]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchDebtsWithFilter(address)
      .then(setData)
      .catch(e => setError(e.message || 'Неизвестная ошибка'))
      .finally(() => setLoading(false));
  }, [address]);

  // Получаем сегодняшнюю дату в формате yyyy-mm-dd
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  }, []);

  // Фильтрация по плиткам (без type)
  const filtered = useMemo(() => {
    if (tiles.length > 0) {
      return filterByTiles(data, tiles, 'overdue');
    }
    return data;
  }, [data, tiles]);

  // Суммарные значения по всем типам задолженности
  const summary = useMemo(() => {
    const overdue = data.filter(d => {
      if (!d.payDate) return false;
      const payDate = new Date(d.payDate);
      payDate.setHours(0,0,0,0);
      return payDate < today;
    });
    const todayDebts = data.filter(d => {
      if (!d.payDate) return false;
      const payDate = new Date(d.payDate);
      payDate.setHours(0,0,0,0);
      return payDate.getTime() === today.getTime();
    });
    const notDue = data.filter(d => {
      if (!d.payDate) return false;
      const payDate = new Date(d.payDate);
      payDate.setHours(0,0,0,0);
      return payDate > today;
    });
    return {
      overdue: {
        docCount: overdue.length,
        sum: overdue.reduce((acc, d) => acc + (d.sumDolg || 0), 0)
      },
      today: {
        docCount: todayDebts.length,
        sum: todayDebts.reduce((acc, d) => acc + (d.sumDolg || 0), 0)
      },
      notDue: {
        docCount: notDue.length,
        sum: notDue.reduce((acc, d) => acc + (d.sumDolg || 0), 0)
      },
      all: {
        docCount: data.length,
        sum: data.reduce((acc, d) => acc + (d.sumDolg || 0), 0)
      }
    };
  }, [data, today]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Задолженности</Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Фильтр по адресу"
          value={address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
          size="small"
        />
      </Box>
      <PdzFilterTiles selected={tiles} onChange={setTiles} hideToday={false} />
      {type === 'overdue' && (
        <Typography sx={{ mb: 2 }}>
          Всего просроченных документов: <b>{summary.overdue.docCount}</b> &nbsp; | &nbsp; Сумма: <b>{summary.overdue.sum.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}</b>
        </Typography>
      )}
      {type === 'today' && (
        <Typography sx={{ mb: 2 }}>
          Платежей на сегодня: <b>{summary.today.docCount}</b> &nbsp; | &nbsp; Сумма: <b>{summary.today.sum.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}</b>
        </Typography>
      )}
      {type === 'notdue' && (
        <Typography sx={{ mb: 2 }}>
          Не просроченных документов: <b>{summary.notDue.docCount}</b> &nbsp; | &nbsp; Сумма: <b>{summary.notDue.sum.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}</b>
        </Typography>
      )}
      {(!type || type === 'all') && (
        <Typography sx={{ mb: 2 }}>
          Всего документов: <b>{summary.all.docCount}</b> &nbsp; | &nbsp; Сумма: <b>{summary.all.sum.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}</b>
        </Typography>
      )}
      {loading && <CircularProgress sx={{ my: 4 }} />}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      {!loading && !error && (
        <PdzTable data={filtered} />
      )}
      {!loading && !error && filtered.length === 0 && (
        <Typography sx={{ mt: 3 }}>Нет документов по выбранным фильтрам</Typography>
      )}
    </Box>
  );
};

export default Debts;
