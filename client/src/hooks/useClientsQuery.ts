import { useQuery } from '@tanstack/react-query';
import { fetchClients } from '../api/clients';

export function useClientsQuery() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
