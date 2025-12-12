import React, { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, TableSortLabel, TextField, Box, IconButton, Typography, Pagination, Select, MenuItem, SelectChangeEvent } from '@mui/material';
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
  { key: 'docNum', label: 'Документ (№ + дата)' },
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
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      // default ascending when switching column
      setOrder('asc');
    }
    setPage(0);
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
  };

  useEffect(() => {
    setPage(0);
  }, [docFilter, ulFilter, rowsPerPage]);

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
      <Box display="flex" gap={2} mb={2} sx={{ '& .MuiTextField-root': { fontSize: { xs: '14px', sm: '14px' }, '& .MuiInputBase-input': { fontSize: { xs: '14px', sm: '14px' } }, '& .MuiInputLabel-root': { fontSize: { xs: '14px', sm: '14px' } } } }}>
        <TextField
          label="По № документа"
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
          label="По адресу/контрагенту"
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
        <Box mb={1} display="flex" justifyContent="center" alignItems="center" gap={{ xs: 1, sm: 2 }} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" sx={{ fontSize: { xs: '12px', sm: '12px' } }}>
              Выводить по:
            </Typography>
            <Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              size="small"
              sx={{ fontSize: { xs: '11px', sm: '11px' }, minWidth: { xs: 50, sm: 60 } }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </Box>
          <Pagination
            size="small"
            count={Math.max(1, Math.ceil(sorted.length / rowsPerPage))}
            page={page + 1}
            onChange={(_, newPage) => setPage(newPage - 1)}
            siblingCount={0}
            boundaryCount={1}
            sx={{ '& .MuiPaginationItem-root': { fontSize: { xs: '12px', sm: '12px' }, minWidth: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } } }}
          />
          <Typography variant="body2" sx={{ fontSize: { xs: '11px', sm: '11px' } }}>
            {sorted.length > 0 
              ? `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, sorted.length)} из ${sorted.length}`
              : `0 из 0`
            }
          </Typography>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell
                  key={col.key}
                  sortDirection={orderBy === col.key ? order : false}
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.75rem' },
                    px: { xs: 0.5, sm: 1.5 },
                    py: { xs: 0.25, sm: 0.5 },
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
  sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.25, sm: 0.5 } }}
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
  sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.25, sm: 0.5 } }}
>{row.otsrochkaDay}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.25, sm: 0.5 } }}
>{row.payDate ? new Date(row.payDate).toLocaleDateString('ru-RU') : ''}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.25, sm: 0.5 } }}
>{row.ostatokDay}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.25, sm: 0.5 } }}
>{row.prosrochkaDay}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.25, sm: 0.5 } }}
>{row.sumDoc.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.25, sm: 0.5 } }}
>{row.sumPaid.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.25, sm: 0.5 } }}
>{row.clientName ?? ''}</TableCell>
                <TableCell
  sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' }, px: { xs: 0.5, sm: 1.5 }, py: { xs: 0.25, sm: 0.5 } }}
>{row.address ?? ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
