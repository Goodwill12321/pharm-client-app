import React, { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, TableSortLabel, TextField, Box, TablePagination, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

export type Debitorka = {
  id: number;
  docUid: string;
  ulUid: string; // Используем как "адрес" для поиска
  otsrochkaDay: number;
  docDate?: string;
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
  page?: number;
  setPage?: (page: number) => void;
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

export const PdzTable: React.FC<PdzTableProps> = ({ data, page: externalPage, setPage: externalSetPage }) => {
  const navigate = useNavigate();
  // default: payDate asc
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<SortField>('payDate');
  const [docFilter, setDocFilter] = useState('');
  const [ulFilter, setUlFilter] = useState('');
  
  // Используем внешнюю страницу если передана, иначе внутреннюю
  const [internalPage, setInternalPage] = useState(0);
  const page = externalPage !== undefined ? externalPage : internalPage;
  const setPage = externalSetPage || setInternalPage;
  
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (field: SortField) => {
    if (orderBy === field) {
      setOrder(order === 'asc' ? 'asc' : 'desc');
    } else {
      setOrderBy(field);
      // default ascending when switching column
      setOrder('asc');
    }
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
  }, [docFilter, ulFilter]);

  const filtered = useMemo(() => {
    return data.filter(row => {
      const address = row.address || row.clientName || '';
      const docNumber = row.docNum || '';
      return (
        docNumber.toLowerCase().includes(docFilter.toLowerCase()) &&
        address.toLowerCase().includes(ulFilter.toLowerCase())
      );
    });
  }, [data, docFilter, ulFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (orderBy === 'payDate') {
        const av = a.payDate ? new Date(a.payDate).getTime() : 0;
        const bv = b.payDate ? new Date(b.payDate).getTime() : 0;
        return order === 'asc' ? av - bv : bv - av;
      }
      const aValue = a[orderBy] as any;
      const bValue = b[orderBy] as any;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return order === 'asc'
        ? String(aValue ?? '').localeCompare(String(bValue ?? ''), 'ru')
        : String(bValue ?? '').localeCompare(String(aValue ?? ''), 'ru');
    });
  }, [filtered, order, orderBy]);

  return (
    <>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Поиск по номеру документа"
          size="small"
          value={docFilter}
          onChange={e => { setDocFilter(e.target.value); setPage(0); }}
          InputProps={{
            endAdornment: docFilter ? (
              <IconButton size="small" onClick={() => { setDocFilter(''); setPage(0); }} aria-label="Очистить">
                <CloseIcon fontSize="small" />
              </IconButton>
            ) : undefined
          }}
        />
        <TextField
          label="Поиск по адресу/контрагенту"
          size="small"
          value={ulFilter}
          onChange={e => { setUlFilter(e.target.value); setPage(0); }}
          InputProps={{
            endAdornment: ulFilter ? (
              <IconButton size="small" onClick={() => { setUlFilter(''); setPage(0); }} aria-label="Очистить">
                <CloseIcon fontSize="small" />
              </IconButton>
            ) : undefined
          }}
        />
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <TablePagination
          component="div"
          count={sorted.length}
          page={page}
          onPageChange={(_e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 20, 50, 100]}
          labelRowsPerPage="Накладных на стр."
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
          sx={{ mb: 1 }}
        />
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
            {sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
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
                  {row.docDate ? ` от ${new Date(row.docDate).toLocaleDateString('ru-RU')}` : ''}
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
