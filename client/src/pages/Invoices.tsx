import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, IconButton, TextField, Select, MenuItem, Button, Tooltip, Chip, TableSortLabel, Pagination, FormControlLabel, SelectChangeEvent } from '@mui/material';
import { AddressFilter } from '../components/AddressFilter';
import { useClientsQuery } from '../hooks/useClientsQuery';
import { useAddressFilter } from '../context/AddressFilterContext';
import GetAppIcon from '@mui/icons-material/GetApp';
import PrintIcon from '@mui/icons-material/Print';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { InvoiceHeader, InvoiceLine } from '../types/invoice';
import InvoiceForm from './InvoiceForm';

// Импортируем хук для загрузки накладных с сервера
import { useInvoicesQuery } from '../hooks/useInvoicesQuery';

const Invoices: React.FC = () => {
  const { data: clients = [], isLoading: loadingClients, error: errorClients } = useClientsQuery();
  const { selectedAddresses } = useAddressFilter();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceHeader | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  // Значения по умолчанию: последние 7 дней
  const getDefaultDates = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 6);
    // Формат YYYY-MM-DD
    const pad = (n: number) => n.toString().padStart(2, '0');
    const toStr = `${to.getFullYear()}-${pad(to.getMonth()+1)}-${pad(to.getDate())}`;
    const fromStr = `${from.getFullYear()}-${pad(from.getMonth()+1)}-${pad(from.getDate())}`;
    return { from: fromStr, to: toStr };
  };

  
  const defaultDates = getDefaultDates();

  const [dateFrom, setDateFrom] = useState(defaultDates.from);
  const [dateTo, setDateTo] = useState(defaultDates.to);
  const [docNumFilter, setDocNumFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showClientColumn, setShowClientColumn] = useState(false);
  const [showAddressColumn, setShowAddressColumn] = useState(false);
  const [selectedUids, setSelectedUids] = useState<string[]>([]);

  const isSelected = (uid?: string) => !!uid && selectedUids.includes(uid);
  const toggleSelected = (uid?: string) => {
    if (!uid) return;
    setSelectedUids(prev => (prev.includes(uid) ? prev.filter(u => u !== uid) : [...prev, uid]));
  };

  // Сброс страницы при изменении фильтров/поиска
  useEffect(() => {
    setPage(1);
  }, [docNumFilter, addressFilter, statusFilter, dateFrom, dateTo, selectedAddresses, rowsPerPage]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
  };

  // Загружаем накладные с сервера только по статусу и датам (клиентские фильтры применяем локально, чтобы список клиентов был глобальным)
  const { data: invoices = [], isLoading, isError } = useInvoicesQuery({
    status: statusFilter,
    dateFrom,
    dateTo,
  });

  // Сортировка
  type Order = 'asc' | 'desc';
  type SortField = 'docNum' | 'clientName' | 'deliveryAddress' | 'docDate' | 'sumSNds' | 'status';
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<SortField>('docDate');

  // Фильтрация по номеру и части адреса (филиал или клиент)
  const filteredInvoices = invoices.filter(inv => {
    const docNumMatch = docNumFilter === '' || inv.docNum?.toLowerCase().includes(docNumFilter.toLowerCase());
    const addressText = `${inv.clientName ?? ''} ${inv.deliveryAddress ?? ''}`.toLowerCase();
    const addressMatch = addressFilter === '' || addressText.includes(addressFilter.toLowerCase());
    // Если выбран фильтр адресов (из AddressFilter), оставляем только те, чей clientUid входит в выбранные адреса
    const addressSelected = selectedAddresses.length === 0 || selectedAddresses.includes(inv.clientUid);
    return docNumMatch && addressMatch && addressSelected;
  });

  // Функция сравнения для сортировки
  function getComparator<Key extends keyof any>(order: Order, orderBy: Key) {
    return (a: { [key in Key]: any }, b: { [key in Key]: any }) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      if (orderBy === 'docDate') {
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
      // Безопасное сравнение по строковому представлению для остальных случаев
      const aStr = String(aValue);
      const bStr = String(bValue);
      const cmp = aStr.localeCompare(bStr, 'ru', { numeric: true });
      return order === 'asc' ? cmp : -cmp;
    };
  }

  const sortedInvoices = [...filteredInvoices].sort(getComparator(order, orderBy));
  const totalPages = Math.max(1, Math.ceil(sortedInvoices.length / rowsPerPage));
  const pagedInvoices = sortedInvoices.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSort = (field: SortField) => {
    if (orderBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder(field === 'docDate' ? 'desc' : 'asc'); // По дате по умолчанию по убыванию
    }
  };

  // Опции клиентов для AddressFilter: глобально по загруженным накладным (без локальных фильтров/пагинации)
  const addressOptions = useMemo(() => {
    const presentClientUids = new Set(invoices.map(inv => inv.clientUid));
    const limitedClients = clients.filter(c => presentClientUids.has(c.id));
    return limitedClients.map(c => ({ id: c.id, name: c.name }));
  }, [invoices, clients]);

  return (
    <Box p={2}>
      <Typography variant="h5" mb={1.5} sx={{ fontSize: { xs: '18px', sm: '20px' } }}>Накладные</Typography>
      <Paper sx={{ mb: 2, p: 2 }}>
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mb={1.5} sx={{ '& .MuiTextField-root, & .MuiSelect-root': { fontSize: { xs: '11px', sm: '14px' }, minHeight: '28px', '& .MuiInputBase-input': { fontSize: { xs: '11px', sm: '14px' }, py: 0.5 } }, '& .MuiInputLabel-root': { fontSize: { xs: '12px', sm: '15px' }, top: '-4px' }, '& .MuiMenuItem-root': { fontSize: { xs: '11px', sm: '14px' }, minHeight: '28px' }, '& .MuiButton-root': { fontSize: { xs: '8px', sm: '9px' }, minHeight: { xs: '24px', sm: '32px' }, px: { xs: 0.6, sm: 1.4 }, py: { xs: 0.2, sm: 0.6 }, '& .MuiButton-startIcon, & .MuiButton-endIcon': { mr: 0.3, '& svg': { fontSize: 18 } } } }}>
          <AddressFilter addresses={addressOptions} />
          <TextField
            label="Поиск по номеру накладной"
            size="small"
            value={docNumFilter}
            onChange={e => setDocNumFilter(e.target.value)}
            sx={{ minWidth: 200, ml: 0 }}
            InputProps={{
              endAdornment: docNumFilter ? (
                <IconButton size="small" onClick={() => setDocNumFilter('')} aria-label="Очистить">
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null,
            }}
          />
          <TextField
            label="Поиск по клиенту/адресу"
            size="small"
            value={addressFilter}
            onChange={e => setAddressFilter(e.target.value)}
            sx={{ minWidth: 200 }}
            InputProps={{
              endAdornment: addressFilter ? (
                <IconButton size="small" onClick={() => setAddressFilter('')} aria-label="Очистить">
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null,
            }}
          />
          <TextField type="date" label="С" value={dateFrom} onChange={e => setDateFrom(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
          <TextField type="date" label="По" value={dateTo} onChange={e => setDateTo(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} displayEmpty size="small" sx={{ fontSize: { xs: '11px', sm: '15px' } }}>
            <MenuItem value="">Все статусы</MenuItem>
            <MenuItem value="Не подтвержден">Не подтвержден</MenuItem>
            <MenuItem value="Подтвержден">Подтвержден</MenuItem>
            <MenuItem value="Проведен">Проведен</MenuItem>
            <MenuItem value="Отменен">Отменен</MenuItem>
          </Select>
          <Button variant="outlined" startIcon={<GetAppIcon />}>Скачать документы</Button>
          <Button variant="outlined">Выгрузить в Excel</Button>
        </Box>

        <Box display={{ xs: 'flex', sm: 'none' }} alignItems="center" gap={1} mb={1}>
          <FormControlLabel
            control={<Checkbox size="small" checked={showClientColumn} onChange={e => setShowClientColumn(e.target.checked)} />}
            label="Название аптеки"
            sx={{ '& .MuiFormControlLabel-label': { fontSize: { xs: '9px' } } }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={showAddressColumn} onChange={e => setShowAddressColumn(e.target.checked)} />}
            label="Адрес"
            sx={{ '& .MuiFormControlLabel-label': { fontSize: { xs: '9px' } } }}
          />
        </Box>

        <Box mb={0.5} display="flex" justifyContent="center" alignItems="center" gap={{ xs: 1, sm: 1.5 }} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" sx={{ fontSize: { xs: '11px', sm: '11px' } }}>
              Выводить по:
            </Typography>
            <Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              size="small"
              sx={{ fontSize: { xs: '9px', sm: '12px' }, minWidth: { xs: 50, sm: 60 } }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={500}>500</MenuItem>
            </Select>
          </Box>
          <Pagination
            size="small"
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            siblingCount={0}
            boundaryCount={1}
            sx={{ '& .MuiPaginationItem-root': { fontSize: { xs: '9px', sm: '10px' }, minWidth: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } } }}
          />
          <Typography variant="body2" sx={{ fontSize: { xs: '9px', sm: '11px' } }}>
            {filteredInvoices.length > 0 
              ? `${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, filteredInvoices.length)} из ${filteredInvoices.length}`
              : `0 из 0`
            }
          </Typography>
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ tableLayout: 'fixed', minWidth: { xs: 900, sm: 1000 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: { xs: 112, sm: 140 }, pr: 1, fontSize: { xs: '12px', sm: '14px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                  <TableSortLabel
                    active={orderBy === 'docNum'}
                    direction={orderBy === 'docNum' ? order : 'asc'}
                    onClick={() => handleSort('docNum')}
                  >Номер</TableSortLabel>
                </TableCell>
                <TableCell sx={{ width: { xs: 240, sm: '22%' }, fontSize: { xs: '12px', sm: '14px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 }, display: showClientColumn ? 'table-cell' : { xs: 'none', sm: 'table-cell' } }}>
                  <TableSortLabel
                    active={orderBy === 'clientName'}
                    direction={orderBy === 'clientName' ? order : 'asc'}
                    onClick={() => handleSort('clientName')}
                  >Клиент</TableSortLabel>
                </TableCell>
                <TableCell sx={{ width: { xs: 360, sm: '38%' }, fontSize: { xs: '12px', sm: '14px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 }, display: showAddressColumn ? 'table-cell' : { xs: 'none', sm: 'table-cell' } }}>
                  <TableSortLabel
                    active={orderBy === 'deliveryAddress'}
                    direction={orderBy === 'deliveryAddress' ? order : 'asc'}
                    onClick={() => handleSort('deliveryAddress')}
                  >Адрес доставки</TableSortLabel>
                </TableCell>
                <TableCell sx={{ width: { xs: 96, sm: 120 }, fontSize: { xs: '12px', sm: '14px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                  <TableSortLabel
                    active={orderBy === 'docDate'}
                    direction={orderBy === 'docDate' ? order : 'desc'}
                    onClick={() => handleSort('docDate')}
                  >Дата</TableSortLabel>
                </TableCell>
                <TableCell sx={{ width: { xs: 120, sm: 140 }, fontSize: { xs: '14px', sm: '16px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                  <TableSortLabel
                    active={orderBy === 'sumSNds'}
                    direction={orderBy === 'sumSNds' ? order : 'asc'}
                    onClick={() => handleSort('sumSNds')}
                  >Сумма с НДС</TableSortLabel>
                </TableCell>
                <TableCell sx={{ width: { xs: 96, sm: 120 }, fontSize: { xs: '12px', sm: '14px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleSort('status')}
                  >Статус</TableSortLabel>
                </TableCell>
                 <TableCell sx={{ whiteSpace: 'nowrap', width: { xs: 120, sm: 140 }, fontSize: { xs: '12px', sm: '14px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 }, textAlign: 'left' }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }} colSpan={7} align="center">Нет данных</TableCell>
                </TableRow>
              ) : (
                pagedInvoices.map(inv => (
                  <TableRow key={inv?.uid || Math.random()} hover selected={selectedInvoice?.uid === inv?.uid} onClick={() => inv && setSelectedInvoice(inv)} style={{ cursor: 'pointer' }}>
                    <TableCell sx={{ width: { xs: 112, sm: 140 }, pr: 1, fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleSelected(inv?.uid); }}>
                          {isSelected(inv?.uid) ? (
                            <CheckBoxIcon fontSize="small" color="primary" />
                          ) : (
                            <CheckBoxOutlineBlankIcon fontSize="small" color="disabled" />
                          )}
                        </IconButton>
                        <span>{inv?.docNum ?? ''}</span>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: { xs: 240, sm: '22%' }, fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 }, display: showClientColumn ? 'table-cell' : { xs: 'none', sm: 'table-cell' }, whiteSpace: 'normal', wordBreak: 'break-word' }}>{inv?.clientName}</TableCell>
                    <TableCell sx={{ width: { xs: 360, sm: '38%' }, fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 }, display: showAddressColumn ? 'table-cell' : { xs: 'none', sm: 'table-cell' }, whiteSpace: 'normal', wordBreak: 'break-word' }}>{inv?.deliveryAddress ?? ''}</TableCell>
                    <TableCell sx={{ width: { xs: 96, sm: 120 }, fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>{inv?.docDate ? new Date(inv.docDate).toLocaleDateString('ru-RU') : ''}</TableCell>
                    <TableCell sx={{ width: { xs: 120, sm: 140 }, fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>{typeof inv?.sumSNds === 'number' ? inv.sumSNds.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) : ''}</TableCell>
                    <TableCell sx={{ width: { xs: 96, sm: 120 }, fontSize: { xs: '14px', sm: '16px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                      {inv?.status ? (
                        <Chip label={inv.status} color={inv.status === 'Не подтвержден' ? 'error' : 'success'} size="small" />
                      ) : ''}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', width: { xs: 120, sm: 140 }, fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 }, textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'nowrap' }}>
                        <Tooltip title="Детали"><span><IconButton size="small" disabled={!inv}><InfoOutlinedIcon fontSize="small" /></IconButton></span></Tooltip>
                        <Tooltip title="Скачать"><span><IconButton size="small" disabled={!inv}><GetAppIcon fontSize="small" /></IconButton></span></Tooltip>
                        <Tooltip title="Печать"><span><IconButton size="small" disabled={!inv}><PrintIcon fontSize="small" /></IconButton></span></Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {selectedInvoice && <InvoiceForm invoice={selectedInvoice} />}
    </Box>
  );
};

export default Invoices;
