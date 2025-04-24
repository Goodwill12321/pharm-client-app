import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Alert, TextField } from '@mui/material';
import { PdzTable, Debitorka } from '../components/PdzTable';
import { PdzFilterTiles, FILTERS, PdzFilterKey } from '../components/PdzFilterTiles';
import { useLocation } from 'react-router-dom';
import { fetchDebtsWithFilter } from '../api/debts';

const filterByTiles = (data: Debitorka[], tiles: PdzFilterKey[]) => {
  if (tiles.length === 0) return data;
  return data.filter(d => {
    return tiles.some(tile => {
      switch (tile) {
        case 'today':
          return d.ostatokDay === 0 && d.prosrochkaDay === 0;
        case '3days':
          return (d.prosrochkaDay >= 1 && d.prosrochkaDay <= 3) ;
        case '7days':
          return (d.prosrochkaDay >= 4 && d.prosrochkaDay <= 7) ;
        case '14days':
          return (d.prosrochkaDay >= 8 && d.prosrochkaDay <= 14) ;
        case '21days':
          return (d.prosrochkaDay >= 15 && d.prosrochkaDay <= 21) ;
        case 'gt21days':
          return (d.prosrochkaDay > 21) ;
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

  // Функция для получения строки даты в формате YYYY-MM-DD (локальная зона)
  const pad = (n: number) => n.toString().padStart(2, '0');
  const todayDate = new Date();
  const todayString = `${todayDate.getFullYear()}-${pad(todayDate.getMonth() + 1)}-${pad(todayDate.getDate())}`;
  const getDateString = (date: Date | string) => {
    if (typeof date === 'string') {
      return date.slice(0, 10);
    }
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  // Типизированная функция фильтрации по типу задолженности
  const filterByType = (docs: Debitorka[], t: string | null): Debitorka[] => {
    switch (t) {
      case 'overdue':
        return docs.filter((d: Debitorka) =>
          (d.payDate && getDateString(d.payDate) < todayString) ||
          (typeof d.prosrochkaDay === 'number' && d.prosrochkaDay > 0)
        );
      case 'today':
        return docs.filter((d: Debitorka) =>
          d.payDate && getDateString(d.payDate) === todayString && d.prosrochkaDay === 0
        );
      case 'notdue':
        return docs.filter((d: Debitorka) =>
          (d.payDate && getDateString(d.payDate) > todayString) ||
          (typeof d.prosrochkaDay === 'number' && d.prosrochkaDay < 0)
        );
      default:
        return docs;
    }
  };

  // Сначала фильтруем по типу задолженности
  const filteredByType = useMemo(() => filterByType(data, type), [data, type, todayString]);

  // Затем фильтруем по плиткам (если есть)
  const filteredByTiles = useMemo(() => {
    if (tiles.length > 0 && (type === 'overdue' || type === 'all')) {
      return filterByTiles(filteredByType, tiles, type || undefined);
    }
    return filteredByType;
  }, [filteredByType, tiles, type]);

  // Для summary, таблицы и фильтрации по адресу используем filteredByTiles
  const filteredData = filteredByTiles;



  // Определяем, какие фильтры показывать
  let filterOptions: string[] = [];
  if (type === 'all') {
    filterOptions = ['overdue', 'notdue', 'today', 'all'];
  } else if (type === 'overdue') {
    filterOptions = ['overdue', 'notdue', 'all'];
  }
  // Для today и notdue фильтры не отображаем

  // summary только по отфильтрованным данным
  const summary = useMemo(() => {
    const overdue = filteredData.filter((d: Debitorka) => d.payDate && getDateString(d.payDate) < todayString);
    const todayDebts = filteredData.filter((d: Debitorka) => d.payDate && getDateString(d.payDate) === todayString && d.prosrochkaDay === 0);
    const notDue = filteredData.filter((d: Debitorka) => d.payDate && getDateString(d.payDate) > todayString);
    return {
      overdue: {
        docCount: overdue.length,
        sum: overdue.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      },
      today: {
        docCount: todayDebts.length,
        sum: todayDebts.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      },
      notDue: {
        docCount: notDue.length,
        sum: notDue.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      },
      all: {
        docCount: filteredData.length,
        sum: filteredData.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      }
    };
  }, [filteredData, todayString]);

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
      {filterOptions.length > 0 && (
        <PdzFilterTiles selected={tiles} onChange={setTiles} hideToday={type !== 'all'} />
      )}

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
      {/* Фильтрация по адресу */}
      {(() => {
        const filteredByAddress = !address ? filteredData : filteredData.filter((d: Debitorka) =>
          (d.ulUid || '').toLowerCase().includes(address.toLowerCase())
        );
        return <>
          {!loading && !error && (
            <PdzTable data={filteredByAddress} />
          )}
          {!loading && !error && filteredByAddress.length === 0 && (
            <Typography sx={{ mt: 3 }}>Нет документов по выбранным фильтрам</Typography>
          )}
        </>;
      })()}

    </Box>
  );
};

export default Debts;
