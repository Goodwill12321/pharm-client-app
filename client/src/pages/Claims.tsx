import React, { useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Pagination,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import GetAppIcon from '@mui/icons-material/GetApp';
import DescriptionIcon from '@mui/icons-material/Description';
import ReplayIcon from '@mui/icons-material/Replay';
import { useNavigate } from 'react-router-dom';
import { useClientsQuery } from '../hooks/useClientsQuery';
import { useAddressFilter } from '../context/AddressFilterContext';
import { AddressFilter } from '../components/AddressFilter';
import { useInvoicesQuery } from '../hooks/useInvoicesQuery';
import type { InvoiceHeader } from '../types/invoice';
import type { ClameH } from '../types/clame';
import { useClaimsQuery } from '../hooks/useClaimsQuery';
import { createClaim } from '../api/claims';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import '../styles/global.css';

type Order = 'asc' | 'desc';
type SortField = 'code' | 'docNum' | 'docDate' | 'status' | 'comment' | 'clientName' | 'deliveryAddress';

const Claims: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: clients = [] } = useClientsQuery();
  const { selectedAddresses } = useAddressFilter();

  const { data: claims = [], isLoading: claimsLoading, isError: claimsIsError } = useClaimsQuery();

  const getDefaultDates = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 29);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return {
      from: `${from.getFullYear()}-${pad(from.getMonth() + 1)}-${pad(from.getDate())}`,
      to: `${to.getFullYear()}-${pad(to.getMonth() + 1)}-${pad(to.getDate())}`,
    };
  };

  const defaultDates = getDefaultDates();
  const [dateFrom, setDateFrom] = useState(defaultDates.from);
  const [dateTo, setDateTo] = useState(defaultDates.to);
  const { data: invoicesPeriod = [] } = useInvoicesQuery({ status: '', dateFrom, dateTo });

  const [invoiceSearch, setInvoiceSearch] = useState('');
  const invoiceSearchActive = invoiceSearch.trim().length > 0;
  const { data: invoicesSearch = [] } = useInvoicesQuery({
    status: '',
    search: invoiceSearchActive ? invoiceSearch : undefined,
    dateFrom: invoiceSearchActive ? '2000-01-01' : dateFrom,
    dateTo: invoiceSearchActive ? '2100-01-01' : dateTo,
  });

  const [createExpanded, setCreateExpanded] = useState(true);
  const [selectedInvoiceUid, setSelectedInvoiceUid] = useState<string>('');
  const [createComment, setCreateComment] = useState('');
  const [createStatus, setCreateStatus] = useState('Новая');
  const [createError, setCreateError] = useState<string | null>(null);
  const [deliveryFilter, setDeliveryFilter] = useState('');

  const invoiceOptions = useMemo(() => {
    const source = invoiceSearchActive ? invoicesSearch : invoicesPeriod;
    const filtered = source.filter((inv) => {
      return selectedAddresses.length === 0 || selectedAddresses.includes(inv.clientUid);
    });
    const d = deliveryFilter.trim().toLowerCase();
    if (!d) return filtered;
    return filtered.filter((inv) => (inv.deliveryAddress ?? '').toLowerCase().includes(d));
  }, [deliveryFilter, invoiceSearchActive, invoicesPeriod, invoicesSearch, selectedAddresses]);

  // Клиентский поиск по подстроке для уже отфильтрованных накладных
  const filteredInvoiceOptions = useMemo(() => {
    if (!invoiceSearch.trim()) return invoiceOptions;
    const s = invoiceSearch.trim().toLowerCase();
    return invoiceOptions.filter((inv) => {
      const num = (inv.docNum ?? '').toLowerCase();
      const addr = (inv.deliveryAddress ?? '').toLowerCase();
      // Ищем по словам в любом порядке: "А-161 Лен" → ["а-161", "лен"]
      const searchWords = s.split(/\s+/).filter(Boolean);
      return searchWords.every(word => num.includes(word) || addr.includes(word));
    });
  }, [invoiceOptions, invoiceSearch]);

  const selectedInvoice = useMemo<InvoiceHeader | undefined>(() => {
    return invoiceOptions.find((i) => i.uid === selectedInvoiceUid);
  }, [invoiceOptions, selectedInvoiceUid]);

  const createMutation = useMutation({
    mutationFn: (payload: Partial<ClameH>) => createClaim(payload),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ['claims'] });
      setSelectedInvoiceUid('');
      setCreateComment('');
      setCreateStatus('Новая');
      setCreateExpanded(false);
      navigate(`/claims/${created.uid}`);
    },
    onError: (e: any) => {
      setCreateError(e?.message || 'Не удалось создать претензию');
    },
  });

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<SortField>('docDate');

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchFilter, selectedAddresses, rowsPerPage]);

  useEffect(() => {
    setCreateError(null);
  }, [selectedInvoiceUid, createComment, createStatus]);

  const filteredClaims = useMemo(() => {
    const s = searchFilter.trim().toLowerCase();
    return claims
      .filter((c) => {
        const addressSelected =
          selectedAddresses.length === 0 || (!!c.clientUid && selectedAddresses.includes(c.clientUid));
        const statusMatch = statusFilter === '' || (c.status ?? '') === statusFilter;
        const inv = c.uidDocOsn ? invoicesSearch.find((i) => i.uid === c.uidDocOsn) || invoicesPeriod.find((i) => i.uid === c.uidDocOsn) : undefined;
        const delivery = (inv?.deliveryAddress ?? '').toLowerCase();
        const text = `${c.code ?? ''} ${c.docNum ?? ''} ${c.comment ?? ''} ${delivery}`.toLowerCase();
        const searchMatch = s === '' || text.includes(s);
        return addressSelected && statusMatch && searchMatch;
      })
      .filter((c) => !c.isDel);
  }, [claims, invoicesPeriod, invoicesSearch, searchFilter, selectedAddresses, statusFilter]);

  const sortedClaims = useMemo(() => {
    const toTime = (v?: string) => {
      const t = v ? new Date(v).getTime() : 0;
      return Number.isFinite(t) ? t : 0;
    };

    const cmp = (a: ClameH, b: ClameH) => {
      const aVal = (a as any)[orderBy];
      const bVal = (b as any)[orderBy];
      if (orderBy === 'docDate') {
        return order === 'asc' ? toTime(aVal) - toTime(bVal) : toTime(bVal) - toTime(aVal);
      }
      const av = String(aVal ?? '');
      const bv = String(bVal ?? '');
      const res = av.localeCompare(bv, 'ru', { numeric: true });
      return order === 'asc' ? res : -res;
    };

    return [...filteredClaims].sort(cmp);
  }, [filteredClaims, order, orderBy]);

  const totalPages = Math.max(1, Math.ceil(sortedClaims.length / rowsPerPage));
  const pagedClaims = sortedClaims.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSort = (field: SortField) => {
    if (orderBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setOrderBy(field);
    setOrder('asc');
  };

  const handleCreate = async () => {
    if (!selectedInvoice) {
      setCreateError('Выберите накладную');
      return;
    }
    const payload: Partial<ClameH> = {
      uidDocOsn: selectedInvoice.uid,
      docNum: selectedInvoice.docNum,
      docDate: selectedInvoice.docDate,
      clientUid: selectedInvoice.clientUid,
      comment: createComment,
      status: createStatus,
      isDel: false,
    };
    setCreateError(null);
    createMutation.mutate(payload);
  };

  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    for (const c of claims) {
      if (c.status) set.add(c.status);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ru'));
  }, [claims]);

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['claims'] });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
          Претензии
        </Typography>
        <AddressFilter addresses={clients.map((c) => ({ id: c.id, name: c.name }))} />
      </Box>

      <Accordion expanded={createExpanded} onChange={(_, v) => setCreateExpanded(v)} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '13px' }}>Создать претензию</Typography>
            {selectedInvoice?.docNum && (
              <Chip size="small" label={`Накладная ${selectedInvoice.docNum}`} color="primary" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="Период с"
              type="date"
              size="small"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className="date-input"
            />
            <TextField
              label="по"
              type="date"
              size="small"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className="date-input"
            />
            
            <Autocomplete
              size="small"
              sx={{ minWidth: 340 }}
              value={invoiceOptions.find((i) => i.uid === selectedInvoiceUid) || null}
              onChange={(_, value) => setSelectedInvoiceUid(value?.uid ?? '')}
              getOptionLabel={(option) => option ? `${option.docNum} от ${option.docDate ? new Date(option.docDate).toLocaleDateString('ru-RU') : ''} — ${option.deliveryAddress}` : ''}
              options={filteredInvoiceOptions}
              className="autocomplete-input"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Накладная"
                  size="small"
                />
              )}
              ListboxProps={{
                className: 'autocomplete-list',
              }}
            />
            
            <TextField
              label="Текст претензии"
              size="small"
              value={createComment}
              onChange={(e) => setCreateComment(e.target.value)}
              className="form-input"
              sx={{ minWidth: 320, flexGrow: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="button-medium"
              sx={{ minWidth: 160 }}
            >
              Создать
            </Button>
          </Box>
          {createError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {createError}
            </Alert>
          )}
        </AccordionDetails>
      </Accordion>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
        <TextField
          label="Поиск"
          size="small"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="form-input"
          sx={{ minWidth: 260 }}
          InputProps={{
            endAdornment: searchFilter ? (
              <IconButton size="small" onClick={() => setSearchFilter('')} aria-label="Очистить">
                <CloseIcon fontSize="small" />
              </IconButton>
            ) : undefined,
          }}
        />
        <Select
          size="small"
          value={statusFilter}
          onChange={(e: SelectChangeEvent<string>) => setStatusFilter(e.target.value)}
          displayEmpty
          className="select-input"
          sx={{ minWidth: 220 }}
          MenuProps={{
            className: 'select-menu',
          }}
        >
          <MenuItem value="">Все статусы</MenuItem>
          {availableStatuses.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
        <Button variant="outlined" size="small" startIcon={<ReplayIcon />} onClick={handleRefresh} className="button-small">
          Обновить
        </Button>
        <Typography variant="body2" className="typography-small" sx={{ color: 'text.secondary' }}>
          Найдено: {sortedClaims.length}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
        <Button variant="contained" size="small" onClick={() => setCreateExpanded(true)} className="button-small" sx={{ minWidth: 180 }}>
          Оформить претензию
        </Button>
        <Button variant="outlined" size="small" startIcon={<DescriptionIcon />} disabled className="button-small">
          Возвратные документы
        </Button>
        <Button variant="outlined" size="small" disabled className="button-small">
          Отозвать претензию
        </Button>
        <Button variant="outlined" size="small" startIcon={<PrintIcon />} disabled className="button-small">
          Распечатать
        </Button>
        <Button variant="outlined" size="small" startIcon={<GetAppIcon />} disabled className="button-small">
          Выгрузить в Excel
        </Button>
      </Box>

      <Box mb={1} display="flex" justifyContent="center" alignItems="center" gap={{ xs: 1, sm: 2 }} flexWrap="wrap">
        <Pagination
          size="small"
          count={totalPages}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          siblingCount={0}
          boundaryCount={1}
          sx={{ '& .MuiPaginationItem-root': { fontSize: { xs: '12px', sm: '12px' }, minWidth: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } } }}
        />
        <Select
          value={rowsPerPage}
          onChange={(e: SelectChangeEvent<number>) => setRowsPerPage(Number(e.target.value))}
          size="small"
          sx={{ fontSize: { xs: '11px', sm: '11px' }, minWidth: { xs: 70, sm: 80 } }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
        <Typography variant="body2" sx={{ fontSize: { xs: '11px', sm: '11px' }, color: 'text.secondary' }}>
          {sortedClaims.length > 0 ? `${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, sortedClaims.length)} из ${sortedClaims.length}` : '0 из 0'}
        </Typography>
      </Box>

      {claimsIsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Ошибка загрузки претензий
        </Alert>
      )}

      <TableContainer component={Paper} className="table-compact">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === 'code' ? order : false} sx={{ width: '8%' }}>
                <TableSortLabel
                  active={orderBy === 'code'}
                  direction={orderBy === 'code' ? order : 'asc'}
                  onClick={() => handleSort('code')}
                >
                  №
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'docDate' ? order : false} sx={{ width: '10%' }}>
                <TableSortLabel
                  active={orderBy === 'docDate'}
                  direction={orderBy === 'docDate' ? order : 'asc'}
                  onClick={() => handleSort('docDate')}
                >
                  Дата
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'docNum' ? order : false} sx={{ width: '12%' }}>
                <TableSortLabel
                  active={orderBy === 'docNum'}
                  direction={orderBy === 'docNum' ? order : 'asc'}
                  onClick={() => handleSort('docNum')}
                >
                  Накладная
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'status' ? order : false} sx={{ width: '12%' }}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  Статус
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'clientName' ? order : false} sx={{ width: '18%' }}>
                <TableSortLabel
                  active={orderBy === 'clientName'}
                  direction={orderBy === 'clientName' ? order : 'asc'}
                  onClick={() => handleSort('clientName')}
                >
                  Клиент
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'deliveryAddress' ? order : false} sx={{ width: '24%' }}>
                <TableSortLabel
                  active={orderBy === 'deliveryAddress'}
                  direction={orderBy === 'deliveryAddress' ? order : 'asc'}
                  onClick={() => handleSort('deliveryAddress')}
                >
                  Адрес доставки
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'comment' ? order : false} sx={{ width: '16%' }}>
                <TableSortLabel
                  active={orderBy === 'comment'}
                  direction={orderBy === 'comment' ? order : 'asc'}
                  onClick={() => handleSort('comment')}
                >
                  Комментарий
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '5%' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedClaims.map((c) => {
              const inv = c.uidDocOsn ? invoicesSearch.find((i) => i.uid === c.uidDocOsn) || invoicesPeriod.find((i) => i.uid === c.uidDocOsn) : undefined;
              return (
              <TableRow
                key={c.uid}
                hover
                onClick={() => navigate(`/claims/${c.uid}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell sx={{ fontSize: '0.75rem' }}>{c.code || c.uid.slice(0, 8)}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{c.docDate ? new Date(c.docDate).toLocaleDateString('ru-RU') : ''}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{c.docNum ?? ''}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{c.status ?? ''}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{inv?.clientName ?? ''}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{inv?.deliveryAddress ?? ''}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>
                  {c.docDate ? new Date(c.docDate).toLocaleDateString('ru-RU') : ''}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{c.status ?? ''}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{c.comment ?? ''}</TableCell>
              </TableRow>
              );
            })}
            {!claimsLoading && sortedClaims.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  Нет претензий по выбранным фильтрам
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Claims;
