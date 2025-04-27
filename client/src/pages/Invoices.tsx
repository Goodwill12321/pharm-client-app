import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, IconButton, TextField, Select, MenuItem, Button, Tooltip, Chip } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import PrintIcon from '@mui/icons-material/Print';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { InvoiceHeader, InvoiceLine } from '../types/invoice';
import InvoiceForm from './InvoiceForm';

// Импортируем хук для загрузки накладных с сервера
import { useInvoicesQuery } from '../hooks/useInvoicesQuery';

const Invoices: React.FC = () => {
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

  // Загружаем накладные с сервера с фильтрами
  const { data: invoices = [], isLoading, isError } = useInvoicesQuery({
    status: statusFilter,
    dateFrom,
    dateTo,
    // clientUids: ... // если потребуется
  });

  // Фильтрация по номеру и части адреса (филиал или клиент)
  const filteredInvoices = invoices.filter(inv => {
    const docNumMatch = docNumFilter === '' || inv.docNum?.toLowerCase().includes(docNumFilter.toLowerCase());
    const addressMatch = addressFilter === '' ||
      inv.clientName?.toLowerCase().includes(addressFilter.toLowerCase());
    return docNumMatch && addressMatch;
  });

  return (
    <Box p={2}>
      <Typography variant="h5" mb={1.5} sx={{ fontSize: { xs: '20px', sm: '22px' } }}>Накладные</Typography>
      <Paper sx={{ mb: 2, p: 2 }}>
        <Box display={{ xs: 'block', sm: 'flex' }} gap={0.5} alignItems="center" mb={1} sx={{ '& .MuiTextField-root, & .MuiSelect-root': { fontSize: { xs: '13px', sm: '19px' }, minHeight: '28px', '& .MuiInputBase-input': { fontSize: { xs: '13px', sm: '19px' }, py: 0.5 } }, '& .MuiInputLabel-root': { fontSize: { xs: '14px', sm: '20px' }, top: '-4px' }, '& .MuiMenuItem-root': { fontSize: { xs: '13px', sm: '19px' }, minHeight: '28px' }, '& .MuiButton-root': { fontSize: { xs: '10px', sm: '13px' }, minHeight: { xs: '24px', sm: '32px' }, px: { xs: 0.6, sm: 1.4 }, py: { xs: 0.2, sm: 0.6 }, '& .MuiButton-startIcon, & .MuiButton-endIcon': { mr: 0.3, '& svg': { fontSize: 18 } } } }}>
          <TextField label="Номер накладной" value={docNumFilter} onChange={e => setDocNumFilter(e.target.value)} size="small" />
          <TextField label="Часть адреса/филиала" value={addressFilter} onChange={e => setAddressFilter(e.target.value)} size="small" />
          <TextField type="date" label="С" value={dateFrom} onChange={e => setDateFrom(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
          <TextField type="date" label="По" value={dateTo} onChange={e => setDateTo(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} displayEmpty size="small" sx={{ fontSize: { xs: '13px', sm: '19px' } }}>
            <MenuItem value="" sx={{ fontSize: { xs: '13px', sm: '19px' } }}>Все статусы</MenuItem>
            <MenuItem value="Не подтвержден" sx={{ fontSize: { xs: '13px', sm: '19px' } }}>Не подтвержден</MenuItem>
            <MenuItem value="Подтвержден" sx={{ fontSize: { xs: '13px', sm: '19px' } }}>Подтвержден</MenuItem>
          </Select>
          <Button variant="outlined" startIcon={<GetAppIcon />}>Скачать документы</Button>
          <Button variant="outlined">Выгрузить в Excel</Button>
        </Box>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }} padding="checkbox"><Checkbox /></TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>НОМЕР</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 }, display: { xs: 'none', sm: 'table-cell' } }}>КЛИЕНТ</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>ДАТА</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>СУММА С НДС</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>СТАТУС</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>ДЕЙСТВИЯ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }} colSpan={6} align="center">Нет данных</TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map(inv => (
                  <TableRow key={inv?.uid || Math.random()} hover selected={selectedInvoice?.uid === inv?.uid} onClick={() => inv && setSelectedInvoice(inv)} style={{ cursor: 'pointer' }}>
                    <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }} padding="checkbox"><Checkbox disabled={!inv} /></TableCell>
                    <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{inv?.docNum ?? ''}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 }, display: { xs: 'none', sm: 'table-cell' } }}>{inv?.clientName ?? ''}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{inv?.docDate ? new Date(inv.docDate).toLocaleDateString('ru-RU') : ''}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{typeof inv?.sumSNds === 'number' ? inv.sumSNds.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) : ''}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>
                      {inv?.status ? (
                        <Chip label={inv.status} color={inv.status === 'Не подтвержден' ? 'error' : 'success'} size="small" />
                      ) : ''}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '14px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>
                      <Tooltip title="Детали"><span><IconButton disabled={!inv}><InfoOutlinedIcon /></IconButton></span></Tooltip>
                      <Tooltip title="Скачать"><span><IconButton disabled={!inv}><GetAppIcon /></IconButton></span></Tooltip>
                      <Tooltip title="Печать"><span><IconButton disabled={!inv}><PrintIcon /></IconButton></span></Tooltip>
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
