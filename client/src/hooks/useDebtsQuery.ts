import { useQuery } from '@tanstack/react-query';
import { fetchDebtsWithFilter } from '../api/debts';

export function useDebts(address?: string) {
  return useQuery({
    queryKey: ['debts', address],
    queryFn: () => fetchDebtsWithFilter(address),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });
}
// Для React Query 5 синтаксис useQuery({ ... }) остался валиден, но можно и так:
// return useQuery({ queryKey: ['debts', address], queryFn: ... });
