import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Select, MenuItem, TextField, Checkbox, TableSortLabel, Button, IconButton, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { InvoiceHeader, InvoiceLine } from '../types/invoice';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Импортируем хук для загрузки строк накладной с сервера
import { useInvoiceLinesQuery } from '../hooks/useInvoiceLinesQuery';
import { exportInvoiceToExcel } from '../utils/excelExport';
import { useDocUnloadHistoryQuery } from '../hooks/useDocUnloadHistoryQuery';
import { useDocUnloadTaskSummaryQuery } from '../hooks/useDocUnloadTaskSummaryQuery';
import { useCreateDocUnloadTaskMutation } from '../hooks/useCreateDocUnloadTaskMutation';
import { markDocUnloadTaskDeleted } from '../api/docUnloadTasks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  invoice?: InvoiceHeader;
  openUnloadHistory?: boolean;
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

const InvoiceForm: React.FC<Props> = ({ invoice, openUnloadHistory }) => {
  if (!invoice) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="body1">Накладная не выбрана</Typography>
      </Paper>
    );
  }

  const [unloadPanelExpanded, setUnloadPanelExpanded] = React.useState(!!openUnloadHistory);
  const createUnloadTaskMutation = useCreateDocUnloadTaskMutation();
  const qc = useQueryClient();
  const cancelUnloadTaskMutation = useMutation({
    mutationFn: (uid: string) => markDocUnloadTaskDeleted(uid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['docUnloadHistory', invoice.uid] });
      qc.invalidateQueries({ queryKey: ['docUnloadTaskSummary'] });
      qc.invalidateQueries({ queryKey: ['docUnloadTaskGlobalSummary'] });
      qc.invalidateQueries({ queryKey: ['docUnloadTasksView'] });
    },
  });

  const handleCancelUnloadTask = (uid: string) => {
    setTaskToCancel(uid);
    setCancelConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!taskToCancel) return;
    cancelUnloadTaskMutation.mutate(taskToCancel);
    setCancelConfirmOpen(false);
    setTaskToCancel(null);
  };

  const handleCancelCancel = () => {
    setCancelConfirmOpen(false);
    setTaskToCancel(null);
  };

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingWarningOpen, setPendingWarningOpen] = React.useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = React.useState(false);
  const [taskToCancel, setTaskToCancel] = React.useState<string | null>(null);

  // Загружаем строки накладной по UID
  const { data: lines = [], isLoading, isError } = useInvoiceLinesQuery(invoice.uid);

  const { data: unloadSummary = [] } = useDocUnloadTaskSummaryQuery([invoice.uid]);
  const summary = unloadSummary?.find(s => s.docUid === invoice.uid);

  const { data: unloadHistory = [], isLoading: unloadHistoryLoading } = useDocUnloadHistoryQuery(invoice.uid, unloadPanelExpanded);

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

  // Функция выгрузки накладной в Excel
  const handleExportToExcel = () => {
    if (lines.length > 0) {
      exportInvoiceToExcel(invoice, lines);
    }
  };

  const handleRequestUnload = async () => {
    try {
      await createUnloadTaskMutation.mutateAsync({
        docType: 'Электронная накладная',
        docUid: invoice.uid,
        docNum: invoice.docNum,
        docDate: invoice.docDate,
      });
      setSnackbarSeverity('success');
      setSnackbarMessage('Запрос на выгрузку создан');
      setSnackbarOpen(true);
    } catch (e) {
      const status = (e as any)?.status;
      if (status === 409) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Уже есть невыполненный запрос на выгрузку по этой накладной');
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('Не удалось создать запрос на выгрузку');
      }
      setSnackbarOpen(true);
    }
  };

  const handleRequestUnloadClick = () => {
    if ((summary?.pending ?? 0) > 0) {
      setPendingWarningOpen(true);
      return;
    }
    setConfirmOpen(true);
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" mb={1.2} sx={{ fontSize: { xs: '17px', sm: '15px' } }}>Детализация накладной №{invoice.docNum}</Typography>
      <Box mb={1.5} display="flex" alignItems="center" justifyContent="space-between" gap={{ xs: 1, sm: 2 }} flexWrap="wrap">
        <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }} flexWrap="wrap">
          <Typography variant="body2" sx={{ fontSize: { xs: '11px', sm: '11px' } }}>Дата: {invoice.docDate}</Typography>
          <Typography variant="body2" sx={{ fontSize: { xs: '11px', sm: '11px' } }}>Статус: 
            {invoice.status ? (
              <Box 
                component="span" 
                sx={{ 
                  backgroundColor: invoice.status === 'Не подтвержден' ? '#ffebee' : '#e8f5e8', 
                  color: invoice.status === 'Не подтвержден' ? '#c62828' : '#2e7d32',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  fontSize: { xs: '11px', sm: '11px' },
                  fontWeight: 500,
                  display: 'inline-block',
                  textAlign: 'center',
                  ml: 0.5
                }}
              >
                {invoice.status}
              </Box>
            ) : ''}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: { xs: '11px', sm: '11px' } }}>Комментарий: {invoice.comment || '—'}</Typography>
          {summary && (
            <Typography variant="body2" sx={{ fontSize: { xs: '11px', sm: '11px' } }}>
              Запросы выгрузки: {summary.total} (вып: {summary.done} / ожид: {summary.pending})
            </Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <Button 
            variant="outlined" 
            startIcon={<DescriptionIcon />} 
            onClick={handleExportToExcel}
            disabled={lines.length === 0}
            sx={{ fontSize: { xs: '10px', sm: '12px' }, py: { xs: 0.3, sm: 0.6 }, px: { xs: 1, sm: 1.5 } }}
          >
            Выгрузить в Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            onClick={handleRequestUnloadClick}
            disabled={createUnloadTaskMutation.isPending}
            sx={{ fontSize: { xs: '10px', sm: '12px' }, py: { xs: 0.3, sm: 0.6 }, px: { xs: 1, sm: 1.5 } }}
          >
            Запросить выгрузку
          </Button>
        </Box>
      </Box>

      <Accordion
        expanded={unloadPanelExpanded}
        onChange={(_e, expanded) => setUnloadPanelExpanded(expanded)}
        sx={{ mb: 1.5 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="doc-unload-history-header">
          <Typography sx={{ fontSize: { xs: '12px', sm: '13px' }, fontWeight: 500 }}>
            История запросов выгрузки
            {summary ? `: всего ${summary.total}, выполнено ${summary.done}, ожидание ${summary.pending}` : ''}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {unloadHistoryLoading ? (
            <Typography variant="body2" sx={{ fontSize: { xs: '12px', sm: '13px' } }}>Загрузка...</Typography>
          ) : unloadHistory.length === 0 ? (
            <Typography variant="body2" sx={{ fontSize: { xs: '12px', sm: '13px' } }}>Нет запросов</Typography>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ tableLayout: 'fixed', minWidth: { xs: 600, sm: 800 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' }, fontWeight: 'bold' }}>Дата запроса</TableCell>
                    <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' }, fontWeight: 'bold' }}>Кто запросил</TableCell>
                    <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' }, fontWeight: 'bold' }}>Статус</TableCell>
                    <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' }, fontWeight: 'bold' }}>Время выгрузки</TableCell>
                    <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' }, fontWeight: 'bold' }}>Обновлено</TableCell>
                    <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' }, fontWeight: 'bold' }}>Комментарий</TableCell>
                    <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' }, fontWeight: 'bold' }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unloadHistory.map(t => (
                    <TableRow key={t.uid}>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' } }}>{t.requestTime ? new Date(t.requestTime).toLocaleString('ru-RU') : ''}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' } }}>{t.contactName || t.contactUid || '—'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' } }}>{t.isUnloaded ? 'Выгружено' : 'Ожидает'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' } }}>{t.unloadTime ? new Date(t.unloadTime).toLocaleString('ru-RU') : '—'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' } }}>{t.statusUpdateTime ? new Date(t.statusUpdateTime).toLocaleString('ru-RU') : '—'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' }, whiteSpace: 'normal', wordBreak: 'break-word' }}>{t.unloadComment || '—'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '12px' } }}>
                        {!t.isUnloaded && (
                          <IconButton
                            size="small"
                            onClick={() => handleCancelUnloadTask(t.uid)}
                            disabled={cancelUnloadTaskMutation.isPending}
                            aria-label="Отменить"
                            title="Отменить"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </AccordionDetails>
      </Accordion>

      <Dialog open={cancelConfirmOpen} onClose={handleCancelCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Подтверждение отмены</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontSize: { xs: '12px', sm: '13px' } }}>
            Вы действительно хотите отменить этот запрос на выгрузку?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCancel}>Нет</Button>
          <Button variant="contained" onClick={handleConfirmCancel} disabled={cancelUnloadTaskMutation.isPending}>
            Да, отменить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Запросить выгрузку?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontSize: { xs: '12px', sm: '13px' } }}>
            Накладная №{invoice.docNum} от {invoice.docDate ? new Date(invoice.docDate).toLocaleDateString('ru-RU') : ''}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Отмена</Button>
          <Button
            variant="contained"
            onClick={async () => {
              setConfirmOpen(false);
              await handleRequestUnload();
            }}
            disabled={createUnloadTaskMutation.isPending}
          >
            Запросить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={pendingWarningOpen} onClose={() => setPendingWarningOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Выгрузка уже запрошена</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontSize: { xs: '12px', sm: '13px' } }}>
            По этой накладной уже есть невыполненный запрос на выгрузку.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setPendingWarningOpen(false)}>Понятно</Button>
        </DialogActions>
      </Dialog>
      {/* Фильтры */}
      <Box mb={1} display={{ xs: 'block', sm: 'flex' }} gap={0.5} alignItems="center" sx={{ '& .MuiTextField-root, & .MuiSelect-root': { fontSize: { xs: '12px', sm: '11px' }, minHeight: '28px', '& .MuiInputBase-input': { fontSize: { xs: '12px', sm: '11px' }, py: 0.5 } }, '& .MuiInputLabel-root': { fontSize: { xs: '12px', sm: '11px' }, top: '-4px' }, '& .MuiMenuItem-root': { fontSize: { xs: '12px', sm: '11px' }, minHeight: '28px' } }}>
        <TextField label="Поиск по товару" value={goodNameFilter} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoodNameFilter(e.target.value)} size="small" />
        <TextField label="Поиск по серии" value={seriesNameFilter} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeriesNameFilter(e.target.value)} size="small" />
        <Select value={markedOnly} onChange={(e) => setMarkedOnly(e.target.value as 'all' | 'marked' | 'unmarked')} size="small" sx={{ fontSize: { xs: '12px', sm: '11px' } }}>
          <MenuItem value="all" sx={{ fontSize: { xs: '12px', sm: '11px' } }}>Все</MenuItem>
          <MenuItem value="marked" sx={{ fontSize: { xs: '12px', sm: '11px' } }}>Только маркированные</MenuItem>
          <MenuItem value="unmarked" sx={{ fontSize: { xs: '12px', sm: '11px' } }}>Только немарк.</MenuItem>
        </Select>
      </Box>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ tableLayout: 'fixed', minWidth: { xs: 900, sm: 1200 } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 150, width: { xs: 300, sm: 300 }, fontSize: { xs: '12px', sm: '11px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'goodName'} direction={orderBy === 'goodName' ? order : 'asc'} onClick={() => handleSort('goodName')}>Товар</TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: { xs: 80, sm: 100 }, fontSize: { xs: '12px', sm: '13px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'isMarked'} direction={orderBy === 'isMarked' ? order : 'asc'} onClick={() => handleSort('isMarked')}>Маркирован</TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '12px', sm: '13px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'seriesName'} direction={orderBy === 'seriesName' ? order : 'asc'} onClick={() => handleSort('seriesName')}>Серия</TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '12px', sm: '13px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'dateExpBefore'} direction={orderBy === 'dateExpBefore' ? order : 'asc'} onClick={() => handleSort('dateExpBefore')}>Срок годн.</TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '12px', sm: '13px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'dateProduction'} direction={orderBy === 'dateProduction' ? order : 'asc'} onClick={() => handleSort('dateProduction')}>Дата произв.</TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '12px', sm: '13px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'price'} direction={orderBy === 'price' ? order : 'asc'} onClick={() => handleSort('price')}>Цена с НДС</TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: { xs: 80, sm: 100 }, fontSize: { xs: '12px', sm: '13px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'qnt'} direction={orderBy === 'qnt' ? order : 'asc'} onClick={() => handleSort('qnt')}>Кол-во</TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: { xs: 80, sm: 100 }, fontSize: { xs: '12px', sm: '13px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'nds'} direction={orderBy === 'nds' ? order : 'asc'} onClick={() => handleSort('nds')}>Ставка НДС</TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '12px', sm: '13px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'sumSNds'} direction={orderBy === 'sumSNds' ? order : 'asc'} onClick={() => handleSort('sumSNds')}>Сумма с НДС</TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '14px', sm: '15px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 }, display: { xs: 'none', sm: 'table-cell' } }}>
                <TableSortLabel active={orderBy === 'gtin'} direction={orderBy === 'gtin' ? order : 'asc'} onClick={() => handleSort('gtin')}>GTIN</TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '14px', sm: '15px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 }, display: { xs: 'none', sm: 'table-cell' } }}>
                <TableSortLabel active={orderBy === 'ean'} direction={orderBy === 'ean' ? order : 'asc'} onClick={() => handleSort('ean')}>EAN</TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '12px', sm: '13px' }, fontWeight: 'bold', py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>
                <TableSortLabel active={orderBy === 'dateSaleProducer'} direction={orderBy === 'dateSaleProducer' ? order : 'asc'} onClick={() => handleSort('dateSaleProducer')}>Дата реализации</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLines.map(line => (
              <TableRow key={line.uidLine}>
                <TableCell sx={{ minWidth: 150, width: { xs: 300, sm: 300 }, fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 }, whiteSpace: 'normal', wordBreak: 'break-word' }}>{line.goodName}</TableCell>
                <TableCell sx={{ width: { xs: 80, sm: 100 }, fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}><Checkbox checked={!!line.isMarked} disabled /></TableCell>
                <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>{line.seriesName}</TableCell>
                <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '14px', sm: '15px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>{formatDate(line.dateExpBefore)}</TableCell>
                <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '14px', sm: '15px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>{formatDate(line.dateProduction)}</TableCell>
                <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '14px', sm: '15px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>{line.price}</TableCell>
                <TableCell sx={{ width: { xs: 80, sm: 100 }, fontSize: { xs: '14px', sm: '15px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>{line.qnt}</TableCell>
                <TableCell sx={{ width: { xs: 80, sm: 100 }, fontSize: { xs: '14px', sm: '15px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>{line.nds}%</TableCell>
                <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '14px', sm: '15px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>{line.sumSNds}</TableCell>
                <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '14px', sm: '15px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 }, display: { xs: 'none', sm: 'table-cell' } }}>{line.gtin}</TableCell>
                <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '14px', sm: '15px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 }, display: { xs: 'none', sm: 'table-cell' } }}>{line.ean}</TableCell>
                <TableCell sx={{ width: { xs: 100, sm: 120 }, fontSize: { xs: '14px', sm: '15px' }, py: { xs: 0.25, sm: 0.375 }, px: { xs: 0.5, sm: 1.5 } }}>{line.dateSaleProducer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={snackbarOpen} autoHideDuration={3500} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default InvoiceForm;
