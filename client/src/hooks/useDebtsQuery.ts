import { useQuery } from '@tanstack/react-query';
import { fetchDebtsWithFilter } from '../api/debts';
import { useAddressFilter } from '../context/AddressFilterContext';

export function useDebts(addressIds?: string[]) {
  const { selectedAddresses } = useAddressFilter();
  const effectiveAddresses = addressIds !== undefined ? addressIds : selectedAddresses;
  return useQuery({
    queryKey: ['debts', ...(effectiveAddresses ?? [])],
    queryFn: () => fetchDebtsWithFilter(effectiveAddresses),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 600_000,
  });
}
// Для React Query 5 синтаксис useQuery({ ... }) остался валиден, но можно и так:
// return useQuery({ queryKey: ['debts', address], queryFn: ... });
