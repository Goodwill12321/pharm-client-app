import React, { useState, useEffect, useMemo } from 'react';
import { useClientsQuery } from '../hooks/useClientsQuery';
import { AddressFilter } from '../components/AddressFilter';
import { useDebts } from '../hooks/useDebtsQuery';
import { Box, Typography, CircularProgress, Alert, TextField } from '@mui/material';
import { PdzTable, Debitorka } from '../components/PdzTable';
import { PdzFilterTiles, FILTERS, PdzFilterKey } from '../components/PdzFilterTiles';
import { useLocation } from 'react-router-dom';
import { fetchDebtsWithFilter } from '../api/debts';



const filterByTiles = (data: Debitorka[], tiles: PdzFilterKey[]): Debitorka[] => {
  if (tiles.length === 0) return data;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Отладочный лог (раскомментировать для отладки)
  // console.log('🔍 filterByTiles DEBUG:', {
  //   tiles,
  //   today: today.toISOString().split('T')[0],
  //   dataCount: data.length,
  //   sampleData: data.slice(0, 3).map(d => ({
  //     id: d.id,
  //     payDate: d.payDate,
  //     payDateObj: new Date(d.payDate),
  //     diffDays: d.payDate ? Math.floor((today.getTime() - new Date(d.payDate).getTime()) / (1000 * 60 * 60 * 24)) : 'no payDate'
  //   }))
  // });
  
  return data.filter((d: Debitorka) => {
    const payDate = new Date(d.payDate);
    payDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - payDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const matches = tiles.some((tile: PdzFilterKey) => {
      switch (tile) {
        case 'today':
          return diffDays === 0;
        case '3days':
          return diffDays >= 1 && diffDays <= 3;
        case '7days':
          return diffDays >= 4 && diffDays <= 7;
        case '14days':
          return diffDays >= 8 && diffDays <= 14;
        case '21days':
          return diffDays >= 15 && diffDays <= 21;
        case 'gt21days':
          return diffDays > 21;
        default:
          return false;
      }
    });
    
    // Отладочный лог для каждого элемента (раскомментировать для отладки)
    // if (tiles.includes('today')) {
    //   console.log(`📍 Item ${d.id}: payDate=${d.payDate}, diffDays=${diffDays}, matches=${matches}`);
    // }
    
    return matches;
  });
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

import { useAddressFilter } from '../context/AddressFilterContext';

const Debts: React.FC = () => {
  const { data: clients = [], isLoading: loadingClients, error: errorClients } = useClientsQuery();
  const { selectedAddresses } = useAddressFilter();
  const { data = [], isLoading, error, refetch } = useDebts(selectedAddresses.length > 0 ? selectedAddresses : undefined);
  const query = useQuery();
  const type = query.get('type');
  const [tiles, setTiles] = useState<PdzFilterKey[]>([]);
  const [address, setAddress] = useState<string>('');
  const [page, setPage] = useState(0);

  // tiles сбрасываем при смене адреса
  useEffect(() => {
    setTiles([]);
  }, [address]);

  // tiles выставляем по type при изменении type
  useEffect(() => {
    // console.log('🔄 useEffect type changed:', { type, currentTiles: tiles });
    if (type === 'today') {
      setTiles(['today']);
    } else if (type === 'overdue') {
      setTiles(['3days', '7days', '14days', '21days', 'gt21days']);
    } else if (type === 'notdue') {
      setTiles([]); // или другой ключ, если нужен
    } else if (type === 'all') {
      setTiles([]);
    }
  }, [type]);

  // Сбрасываем страницу при смене фильтров
  useEffect(() => {
    setPage(0);
  }, [tiles]);

  // Функция для получения строки даты в формате YYYY-MM-DD (локальная зона)
  const pad = (n: number): string => n.toString().padStart(2, '0');
  const todayDate = new Date();
  const todayString = `${todayDate.getFullYear()}-${pad(todayDate.getMonth() + 1)}-${pad(todayDate.getDate())}`;
  const getDateString = (date: Date | string): string => {
    if (typeof date === 'string') {
      return date.slice(0, 10);
    }
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  // Затем фильтруем по плиткам (если есть)
  const filteredData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // console.log('🎯 filteredData useMemo:', {
    //   dataCount: data.length,
    //   tiles,
    //   type,
    //   willUseFilterByTiles: tiles.length > 0
    // });
    
    if (tiles.length > 0) {
      return filterByTiles(data, tiles);
    }
    // Если плитки не выбраны, но есть type, фильтруем по нему
    if (type === 'overdue') {
      return data.filter((d: Debitorka) => {
        const payDate = new Date(d.payDate);
        payDate.setHours(0, 0, 0, 0);
        return payDate < today;
      });
    }
    if (type === 'today') {
      // console.log('📅 Using direct type=today filter');
      return data.filter((d: Debitorka) => {
        const payDate = new Date(d.payDate);
        payDate.setHours(0, 0, 0, 0);
        const matches = payDate.getTime() === today.getTime();
        // console.log(`📍 Direct filter: ${d.id}, payDate=${d.payDate}, matches=${matches}`);
        return matches;
      });
    }
    if (type === 'notdue') {
      return data.filter((d: Debitorka) => {
        const payDate = new Date(d.payDate);
        payDate.setHours(0, 0, 0, 0);
        return payDate > today;
      });
    }
    // all или не задан — возвращаем все
    return data;
  }, [data, tiles, type]);

  // Summary для всех плиток и категорий (рассчитывается по data)
  const summary = useMemo(() => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const today = data.filter((d: Debitorka) => {
      const payDate = new Date(d.payDate);
      payDate.setHours(0, 0, 0, 0);
      return payDate.getTime() === todayDate.getTime();
    });
    const overdue3 = data.filter((d: Debitorka) => {
      const payDate = new Date(d.payDate);
      payDate.setHours(0, 0, 0, 0);
      const diff = Math.floor((todayDate.getTime() - payDate.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 1 && diff <= 3;
    });
    const overdue7 = data.filter((d: Debitorka) => {
      const payDate = new Date(d.payDate);
      payDate.setHours(0, 0, 0, 0);
      const diff = Math.floor((todayDate.getTime() - payDate.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 4 && diff <= 7;
    });
    const overdue14 = data.filter((d: Debitorka) => {
      const payDate = new Date(d.payDate);
      payDate.setHours(0, 0, 0, 0);
      const diff = Math.floor((todayDate.getTime() - payDate.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 8 && diff <= 14;
    });
    const overdue21 = data.filter((d: Debitorka) => {
      const payDate = new Date(d.payDate);
      payDate.setHours(0, 0, 0, 0);
      const diff = Math.floor((todayDate.getTime() - payDate.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 15 && diff <= 21;
    });
    const overdueGt21 = data.filter((d: Debitorka) => {
      const payDate = new Date(d.payDate);
      payDate.setHours(0, 0, 0, 0);
      const diff = Math.floor((todayDate.getTime() - payDate.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 21;
    });
    const overdueAll = data.filter((d: Debitorka) => {
      const payDate = new Date(d.payDate);
      payDate.setHours(0, 0, 0, 0);
      return payDate < todayDate;
    });
    const notDue = data.filter((d: Debitorka) => {
      const payDate = new Date(d.payDate);
      payDate.setHours(0, 0, 0, 0);
      return payDate > todayDate;
    });
    return {
      today: {
        docCount: today.length,
        sum: today.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      },
      overdue3: {
        docCount: overdue3.length,
        sum: overdue3.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      },
      overdue7: {
        docCount: overdue7.length,
        sum: overdue7.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      },
      overdue14: {
        docCount: overdue14.length,
        sum: overdue14.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      },
      overdue21: {
        docCount: overdue21.length,
        sum: overdue21.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      },
      overdueGt21: {
        docCount: overdueGt21.length,
        sum: overdueGt21.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      },
      overdueAll: {
        docCount: overdueAll.length,
        sum: overdueAll.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      },
      notDue: {
        docCount: notDue.length,
        sum: notDue.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      },
      all: {
        docCount: data.length,
        sum: data.reduce((acc: number, d: Debitorka) => acc + (d.sumDolg || 0), 0)
      }
    };
  }, [data]);



  // Определяем, какие фильтры показывать
  let filterOptions: string[] = [];
  if (type === 'all') {
    filterOptions = ['overdue', 'notdue', 'today', 'all'];
  } else if (type === 'overdue') {
    filterOptions = ['overdue', 'notdue', 'all'];
  }
  // Для today и notdue фильтры не отображаем



  return (
    <Box>
      <Typography variant="h4" gutterBottom>Задолженности</Typography>

      <AddressFilter addresses={clients.map(c => ({ id: c.id, name: c.name }))} />

      {filterOptions.length > 0 && (
        <PdzFilterTiles selected={tiles} onChange={setTiles} hideToday={type !== 'all'} />
      )}

      {type === 'overdue' && (
        <Typography sx={{ mb: 2 }}>
          Всего просроченных документов: <b>{summary.overdueAll.docCount}</b> &nbsp; | &nbsp; Сумма: <b>{summary.overdueAll.sum.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}</b>
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
      {isLoading && <CircularProgress sx={{ my: 4 }} />}
      {error && <Alert severity="error">{typeof error === 'string' ? error : (error instanceof Error ? error.message : String(error))}</Alert>}
      {!isLoading && !error && (
        <PdzTable data={filteredData} page={page} setPage={setPage} />
      )}
      {!isLoading && !error && filteredData.length === 0 && (
        <Typography sx={{ mt: 3 }}>Нет документов по выбранным фильтрам</Typography>
      )}

    </Box>
  );
};

export default Debts;
