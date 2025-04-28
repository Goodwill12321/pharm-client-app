import { useQuery } from '@tanstack/react-query';
import { fetchInvoices } from '../api/invoices';
import { InvoiceHeader } from '../types/invoice';
import { useAuth } from '../context/AuthContext';

export function useInvoicesQuery(filters: any) {
  const { isAuthenticated } = useAuth();
  return useQuery<InvoiceHeader[]>({
    queryKey: ['invoices', filters],
    queryFn: () => fetchInvoices(filters),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 600_000,
    enabled: isAuthenticated,
  });
}
