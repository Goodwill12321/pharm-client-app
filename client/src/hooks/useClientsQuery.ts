import { useQuery } from '@tanstack/react-query';
import { fetchClients } from '../api/clients';
import { useAuth } from '../context/AuthContext';

export function useClientsQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated,
  });
}
