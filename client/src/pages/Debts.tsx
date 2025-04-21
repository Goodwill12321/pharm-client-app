import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { PdzTable, Debitorka } from '../components/PdzTable';
import { PdzFilterTiles, FILTERS, PdzFilterKey } from '../components/PdzFilterTiles';
import { useLocation } from 'react-router-dom';

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
  const [data, setData] = useState<Debitorka[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tiles, setTiles] = useState<PdzFilterKey[]>([]);
  const query = useQuery();
  const type = query.get('type');

  // Сброс выбранных плиток при смене фильтра type
  useEffect(() => {
    setTiles([]);
  }, [type]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = '/api/debitorka/overdue';
    if (!type || type === 'all' || type === 'today' || type === 'notdue') {
      url = '/api/debitorka';
    }
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Ошибка при получении данных');
        return res.json();
      })
      .then(setData)
      .catch(e => setError(e.message || 'Неизвестная ошибка'))
      .finally(() => setLoading(false));
  }, [type]);

  // Получаем сегодняшнюю дату в формате yyyy-mm-dd
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  }, []);

  // Фильтрация по типу
  const filtered = useMemo(() => {
    // Для overdue и all плитки работают одинаково, только источник данных разный
    if (!type || type === 'all') {
      if (tiles.length > 0) {
        // Для общей задолженности фильтры работают по prosrochkaDay так же, как и для ПДЗ
        return filterByTiles(data, tiles, 'overdue');
      }
      return data;
    }
    if (type === 'overdue') {
      if (tiles.length > 0) {
        return filterByTiles(
          data.filter(d => {
            if (!d.payDate) return false;
            const payDate = new Date(d.payDate);
            payDate.setHours(0,0,0,0);
            return payDate < today;
          }),
          tiles,
          type
        );
      }
      return data.filter(d => {
        if (!d.payDate) return false;
        const payDate = new Date(d.payDate);
        payDate.setHours(0,0,0,0);
        return payDate < today;
      });
    }
    if (type === 'today') {
      return data.filter(d => {
        if (!d.payDate) return false;
        const payDate = new Date(d.payDate);
        payDate.setHours(0,0,0,0);
        return payDate.getTime() === today.getTime() && d.prosrochkaDay === 0;
      });
    }
    if (type === 'notdue') {
      return data.filter(d => {
        if (!d.payDate) return false;
        const payDate = new Date(d.payDate);
        payDate.setHours(0,0,0,0);
        return payDate > today && d.prosrochkaDay <= 0;
      });
    }
    return data;
  }, [data, type, today, tiles]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Задолженности</Typography>
      {(!type || type === 'overdue' || type === 'all') && (
        <PdzFilterTiles selected={tiles} onChange={setTiles} hideToday={type === 'overdue'} />
      )}
      {(type === undefined || type === 'all') && <Typography sx={{ mb: 2 }}>Показана вся задолженность</Typography>}
      {type === 'overdue' && <Typography sx={{ mb: 2 }}>Показана только просроченная задолженность</Typography>}
      {type === 'today' && <Typography sx={{ mb: 2 }}>Показаны платежи, которые нужно оплатить сегодня</Typography>}
      {type === 'notdue' && <Typography sx={{ mb: 2 }}>Показана не просроченная задолженность</Typography>}
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
