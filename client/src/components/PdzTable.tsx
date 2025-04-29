import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, TableSortLabel, TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export type Debitorka = {
  id: number;
  docUid: string;
  ulUid: string; // Используем как "адрес" для поиска
  otsrochkaDay: number;
  payDate: string;
  ostatokDay: number;
  prosrochkaDay: number;
  sumDoc: number;
  sumPaid: number;
  sumDolg: number;
  docNum?: string; // номер документа
  address?: string; // адрес доставки
  clientName?: string; // название клиента
};

interface PdzTableProps {
  data: Debitorka[];
}

type Order = 'asc' | 'desc';

type SortField = 'docUid' | 'otsrochkaDay' | 'payDate' | 'ostatokDay' | 'prosrochkaDay' | 'sumDoc' | 'sumPaid' | 'ulUid' | 'docNum' | 'address' | 'clientName';

const columns: { key: SortField; label: string }[] = [
  { key: 'docNum', label: 'Документ (номер + дата)' },
  { key: 'otsrochkaDay', label: 'Отсрочка' },
  { key: 'payDate', label: 'Дата оплаты' },
  { key: 'ostatokDay', label: 'Дней осталось' },
  { key: 'prosrochkaDay', label: 'Дней просрочки' },
  { key: 'sumDoc', label: 'Сумма' },
  { key: 'sumPaid', label: 'Оплачено' },
  { key: 'clientName', label: 'Клиент' },
  { key: 'address', label: 'Адрес доставки' },
];

export const PdzTable: React.FC<PdzTableProps> = ({ data }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<SortField>('docUid');
  const [docFilter, setDocFilter] = useState('');
  const [ulFilter, setUlFilter] = useState('');

  const handleSort = (field: SortField) => {
    if (orderBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder('asc');
    }
  };

  const filtered = useMemo(() => {
    return data.filter(row => {
      const address = row.deliveryAddress || row.clientName || '';
      return (
        String(row.docUid ?? '').toLowerCase().includes(docFilter.toLowerCase()) &&
        address.toLowerCase().includes(ulFilter.toLowerCase())
      );
    });
  }, [data, docFilter, ulFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      if (orderBy === 'payDate') {
        aValue = a.payDate || '';
        bValue = b.payDate || '';
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return order === 'asc'
        ? String(aValue).localeCompare(String(bValue), 'ru')
        : String(bValue).localeCompare(String(aValue), 'ru');
    });
  }, [filtered, order, orderBy]);

  return (
    <>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Поиск по номеру документа"
          size="small"
          value={docFilter}
          onChange={e => setDocFilter(e.target.value)}
        />
        <TextField
          label="Поиск по адресу/контрагенту"
          size="small"
          value={ulFilter}
          onChange={e => setUlFilter(e.target.value)}
        />
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell
  key={col.key}
  sortDirection={orderBy === col.key ? order : false}
  sx={{
    fontSize: { xs: '0.75rem', sm: '0.9rem' },
    px: { xs: 0.5, sm: 1.5 },
    py: { xs: 0.5, sm: 1 },
    fontWeight: 600
  }}
>
                  <TableSortLabel
                    active={orderBy === col.key}
                    direction={orderBy === col.key ? order : 'asc'}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.5, sm: 1 } }}
>
                  <Link
                    component="button"
                    underline="hover"
                    onClick={() => navigate(`/invoices/${row.docUid}`)}
                  >
                    {row.docNum || row.docUid}
                  </Link>
                  {row.payDate ? ` от ${new Date(row.payDate).toLocaleDateString('ru-RU')}` : ''}
                </TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.5, sm: 1 } }}
>{row.otsrochkaDay}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.5, sm: 1 } }}
>{row.payDate ? new Date(row.payDate).toLocaleDateString('ru-RU') : ''}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.5, sm: 1 } }}
>{row.ostatokDay}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.5, sm: 1 } }}
>{row.prosrochkaDay}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.5, sm: 1 } }}
>{row.sumDoc.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.5, sm: 1 } }}
>{row.sumPaid.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.5, sm: 1 } }}
>{row.clientName ?? ''}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.5, sm: 1 } }}
>{row.address ?? ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
