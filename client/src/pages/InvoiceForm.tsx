import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Select, MenuItem, TextField, Checkbox, TableSortLabel } from '@mui/material';
import { InvoiceHeader, InvoiceLine } from '../types/invoice';

// Импортируем хук для загрузки строк накладной с сервера
import { useInvoiceLinesQuery } from '../hooks/useInvoiceLinesQuery';

interface Props {
  invoice?: InvoiceHeader;
}

// Новый компонент детальной формы накладной (InvoiceForm)
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

const InvoiceForm: React.FC<Props> = ({ invoice }) => {
  if (!invoice) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="body1">Накладная не выбрана</Typography>
      </Paper>
    );
  }

  // Загружаем строки накладной по UID
  const { data: lines = [], isLoading, isError } = useInvoiceLinesQuery(invoice.uid);

  // Фильтры
  const [goodNameFilter, setGoodNameFilter] = React.useState('');
  const [seriesNameFilter, setSeriesNameFilter] = React.useState('');
  const [markedOnly, setMarkedOnly] = React.useState<'all' | 'marked' | 'unmarked'>('all');

  // Сортировка
  type Order = 'asc' | 'desc';
  type SortField = 'goodName' | 'isMarked' | 'seriesName' | 'dateExpBefore' | 'dateProduction' | 'price' | 'qnt' | 'nds' | 'sumSNds' | 'gtin' | 'ean' | 'dateSaleProducer';
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<SortField>('goodName');

  const filteredLines = lines.filter(line => {
    const goodMatch = line.goodName?.toLowerCase().includes(goodNameFilter.toLowerCase());
    const seriesMatch = line.seriesName?.toLowerCase().includes(seriesNameFilter.toLowerCase());
    const markedMatch = markedOnly === 'all' ? true : (markedOnly === 'marked' ? line.isMarked : !line.isMarked);
    return goodMatch && seriesMatch && markedMatch;
  });

  function getComparator<Key extends keyof any>(order: Order, orderBy: Key) {
    return (a: { [key in Key]: any }, b: { [key in Key]: any }) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      // Даты сортируем как числа
      if ([
        'dateExpBefore', 'dateProduction', 'dateSaleProducer'
      ].includes(orderBy as string)) {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const cmp = aValue.localeCompare(bValue, 'ru', { numeric: true });
        return order === 'asc' ? cmp : -cmp;
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return order === 'asc' ? (aValue === bValue ? 0 : aValue ? 1 : -1) : (aValue === bValue ? 0 : aValue ? -1 : 1);
      }
      // Безопасное сравнение по строковому представлению для остальных случаев
      const aStr = String(aValue);
      const bStr = String(bValue);
      const cmp = aStr.localeCompare(bStr, 'ru', { numeric: true });
      return order === 'asc' ? cmp : -cmp;
    };
  }

  const sortedLines = [...filteredLines].sort(getComparator(order, orderBy));

  const handleSort = (field: SortField) => {
    if (orderBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder('asc');
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" mb={1.2} sx={{ fontSize: { xs: '17px', sm: '19px' } }}>Детализация накладной №{invoice.docNum}</Typography>
      <Box mb={2}>
        <Typography variant="body2">Дата: {invoice.docDate}</Typography>
        <Typography variant="body2">Статус: <Chip label={invoice.status} color={invoice.status === 'Не подтвержден' ? 'error' : 'success'} size="small" /></Typography>
        <Typography variant="body2">Комментарий: {invoice.comment || '—'}</Typography>
      </Box>
      {/* Фильтры */}
      <Box mb={1} display={{ xs: 'block', sm: 'flex' }} gap={0.5} alignItems="center" sx={{ '& .MuiTextField-root, & .MuiSelect-root': { fontSize: { xs: '14px', sm: '17px' }, minHeight: '28px', '& .MuiInputBase-input': { fontSize: { xs: '14px', sm: '17px' }, py: 0.5 } }, '& .MuiInputLabel-root': { fontSize: { xs: '14px', sm: '17px' }, top: '-4px' }, '& .MuiMenuItem-root': { fontSize: { xs: '14px', sm: '17px' }, minHeight: '28px' } }}>
        <TextField label="Поиск по товару" value={goodNameFilter} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoodNameFilter(e.target.value)} size="small" />
        <TextField label="Поиск по серии" value={seriesNameFilter} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeriesNameFilter(e.target.value)} size="small" />
        <Select value={markedOnly} onChange={(e) => setMarkedOnly(e.target.value as 'all' | 'marked' | 'unmarked')} size="small" sx={{ fontSize: { xs: '14px', sm: '17px' } }}>
          <MenuItem value="all" sx={{ fontSize: { xs: '14px', sm: '17px' } }}>Все</MenuItem>
          <MenuItem value="marked" sx={{ fontSize: { xs: '14px', sm: '17px' } }}>Только маркированные</MenuItem>
          <MenuItem value="unmarked" sx={{ fontSize: { xs: '14px', sm: '17px' } }}>Только немаркированные</MenuItem>
        </Select>
      </Box>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'goodName'} direction={orderBy === 'goodName' ? order : 'asc'} onClick={() => handleSort('goodName')}>Товар</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'isMarked'} direction={orderBy === 'isMarked' ? order : 'asc'} onClick={() => handleSort('isMarked')}>Маркирован</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'seriesName'} direction={orderBy === 'seriesName' ? order : 'asc'} onClick={() => handleSort('seriesName')}>Серия</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'dateExpBefore'} direction={orderBy === 'dateExpBefore' ? order : 'asc'} onClick={() => handleSort('dateExpBefore')}>Срок годн.</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'dateProduction'} direction={orderBy === 'dateProduction' ? order : 'asc'} onClick={() => handleSort('dateProduction')}>Дата произв.</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'price'} direction={orderBy === 'price' ? order : 'asc'} onClick={() => handleSort('price')}>Цена с НДС</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'qnt'} direction={orderBy === 'qnt' ? order : 'asc'} onClick={() => handleSort('qnt')}>Кол-во</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'nds'} direction={orderBy === 'nds' ? order : 'asc'} onClick={() => handleSort('nds')}>Ставка НДС</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'sumSNds'} direction={orderBy === 'sumSNds' ? order : 'asc'} onClick={() => handleSort('sumSNds')}>Сумма с НДС</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 }, display: { xs: 'none', sm: 'table-cell' } }}>
                <TableSortLabel active={orderBy === 'gtin'} direction={orderBy === 'gtin' ? order : 'asc'} onClick={() => handleSort('gtin')}>GTIN</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 }, display: { xs: 'none', sm: 'table-cell' } }}>
                <TableSortLabel active={orderBy === 'ean'} direction={orderBy === 'ean' ? order : 'asc'} onClick={() => handleSort('ean')}>EAN</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'dateSaleProducer'} direction={orderBy === 'dateSaleProducer' ? order : 'asc'} onClick={() => handleSort('dateSaleProducer')}>Дата реализации</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLines.map(line => (
              <TableRow key={line.uidLine}>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{line.goodName}</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}><Checkbox checked={!!line.isMarked} disabled /></TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{line.seriesName}</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{formatDate(line.dateExpBefore)}</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{formatDate(line.dateProduction)}</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{line.price}</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{line.qnt}</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{line.nds}%</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{line.sumSNds}</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 }, display: { xs: 'none', sm: 'table-cell' } }}>{line.gtin}</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 }, display: { xs: 'none', sm: 'table-cell' } }}>{line.ean}</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{line.dateSaleProducer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InvoiceForm;
