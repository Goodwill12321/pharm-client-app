import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchClaims } from '../api/claims';
import type { ClameH } from '../types/clame';

export function useClaimsQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery<ClameH[]>({
    queryKey: ['claims'],
    queryFn: () => fetchClaims(),
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 600_000,
  });
}
