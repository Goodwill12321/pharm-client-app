import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchInvoiceHeader } from '../api/invoices';
import InvoiceForm from './InvoiceForm';
import { Box, CircularProgress, Typography } from '@mui/material';

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: invoice, isLoading, isError, error } = useQuery({
    queryKey: ['invoiceHeader', id],
    queryFn: () => (id ? fetchInvoiceHeader(id) : Promise.reject(new Error('No id'))),
    enabled: !!id,
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box mt={2}>
        <Typography variant="body1">Не удалось загрузить накладную: {(error as Error)?.message}</Typography>
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box mt={2}>
        <Typography variant="body1">Накладная не найдена</Typography>
      </Box>
    );
  }

  return <InvoiceForm invoice={invoice} />;
};

export default InvoiceDetailPage;
