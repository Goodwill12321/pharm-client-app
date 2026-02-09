import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchClaim } from '../api/claims';
import type { ClameH } from '../types/clame';

export function useClaimQuery(uid: string | undefined) {
  const { isAuthenticated } = useAuth();
  return useQuery<ClameH>({
    queryKey: ['claim', uid],
    queryFn: () => {
      if (!uid) return Promise.reject(new Error('uid is required'));
      return fetchClaim(uid);
    },
    enabled: !!uid && isAuthenticated,
    staleTime: 30_000,
  });
}
