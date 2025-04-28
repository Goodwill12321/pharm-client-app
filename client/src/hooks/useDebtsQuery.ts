import { useQuery } from '@tanstack/react-query';
import { fetchDebtsWithFilter } from '../api/debts';
import { useAddressFilter } from '../context/AddressFilterContext';
import { useAuth } from '../context/AuthContext';

export function useDebts(addressIds?: string[]) {
  const { selectedAddresses } = useAddressFilter();
  const { isAuthenticated } = useAuth();
  const effectiveAddresses = addressIds !== undefined ? addressIds : selectedAddresses;
  return useQuery({
    queryKey: ['debts', ...(effectiveAddresses ?? [])],
    queryFn: () => fetchDebtsWithFilter(effectiveAddresses),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 600_000,
    enabled: isAuthenticated,
  });
}
// Для React Query 5 синтаксис useQuery({ ... }) остался валиден, но можно и так:
// return useQuery({ queryKey: ['debts', address], queryFn: ... });
