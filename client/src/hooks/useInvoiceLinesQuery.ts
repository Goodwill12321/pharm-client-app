import { useQuery } from '@tanstack/react-query';
import { fetchInvoiceLines } from '../api';
import { InvoiceLine } from '../types/invoice';

export function useInvoiceLinesQuery(uid: string | undefined) {
  return useQuery<InvoiceLine[]>({
    queryKey: ['invoiceLines', uid],
    queryFn: () => (uid ? fetchInvoiceLines(uid) : Promise.resolve([])),
    enabled: !!uid,
    staleTime: 30_000,
  });
}
