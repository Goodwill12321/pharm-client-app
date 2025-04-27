import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Select, MenuItem, TextField, Checkbox } from '@mui/material';
import { InvoiceHeader, InvoiceLine } from '../types/invoice';

// Импортируем хук для загрузки строк накладной с сервера
import { useInvoiceLinesQuery } from '../hooks/useInvoiceLinesQuery';

interface Props {
  invoice: InvoiceHeader;
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
  // Загружаем строки накладной по UID
  const { data: lines = [], isLoading, isError } = useInvoiceLinesQuery(invoice.uid);

  // Фильтры
  const [goodNameFilter, setGoodNameFilter] = React.useState('');
  const [seriesNameFilter, setSeriesNameFilter] = React.useState('');
  const [markedOnly, setMarkedOnly] = React.useState<'all' | 'marked' | 'unmarked'>('all');

  const filteredLines = lines.filter(line => {
    const goodMatch = line.goodName?.toLowerCase().includes(goodNameFilter.toLowerCase());
    const seriesMatch = line.seriesName?.toLowerCase().includes(seriesNameFilter.toLowerCase());
    const markedMatch = markedOnly === 'all' ? true : (markedOnly === 'marked' ? line.isMarked : !line.isMarked);
    return goodMatch && seriesMatch && markedMatch;
  });

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
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>Товар</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>Наименование</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>Маркировка</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>Серия</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>Наименование серии</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>Срок годн.</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>Дата произв.</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>Цена с НДС</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>Кол-во</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>Ставка НДС</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>Сумма с НДС</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 }, display: { xs: 'none', sm: 'table-cell' } }}>GTIN</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 }, display: { xs: 'none', sm: 'table-cell' } }}>EAN</TableCell>
              <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>Дата реализации</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLines.map(line => (
              <TableRow key={line.uidLine}>
                <TableCell sx={{ fontSize: { xs: '1сделай 4px', sm: '18px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{line.goodUid}</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{line.goodName}</TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}><Checkbox checked={!!line.isMarked} disabled /></TableCell>
                <TableCell sx={{ fontSize: { xs: '14px', sm: '17px' }, py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1.5 } }}>{line.seriesUid}</TableCell>
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
