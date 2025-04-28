import { useQuery } from '@tanstack/react-query';
import { fetchInvoiceLines } from '../api/invoices';
import { InvoiceLine } from '../types/invoice';
import { useAuth } from '../context/AuthContext';

export function useInvoiceLinesQuery(uid: string | undefined) {
  const { isAuthenticated } = useAuth();
  return useQuery<InvoiceLine[]>({
    queryKey: ['invoiceLines', uid],
    queryFn: () => (uid ? fetchInvoiceLines(uid) : Promise.resolve([])),
    enabled: !!uid && isAuthenticated,
    staleTime: 30_000,
  });
}
