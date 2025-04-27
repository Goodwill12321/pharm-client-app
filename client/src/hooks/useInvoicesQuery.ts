import { useQuery } from '@tanstack/react-query';
import { fetchInvoices } from '../api';
import { InvoiceHeader } from '../types/invoice';

export function useInvoicesQuery(filters: any) {
  return useQuery<InvoiceHeader[]>({
    queryKey: ['invoices', filters],
    queryFn: () => fetchInvoices(filters),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 600_000,
  });
}
