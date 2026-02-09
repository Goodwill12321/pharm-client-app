import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchClaimTypes } from '../api/claims';
import type { ClameType } from '../types/clame';

export function useClaimTypesQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery<ClameType[]>({
    queryKey: ['claimTypes'],
    queryFn: () => fetchClaimTypes(),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}
