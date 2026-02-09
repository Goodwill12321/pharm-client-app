import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchClaimLines } from '../api/claims';
import type { ClameT } from '../types/clame';

export function useClaimLinesQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery<ClameT[]>({
    queryKey: ['claimLines'],
    queryFn: () => fetchClaimLines(),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}
