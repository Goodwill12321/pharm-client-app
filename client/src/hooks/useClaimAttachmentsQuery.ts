import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchClaimAttachments, ClaimAttachmentDto } from '../api/claimAttachments';

export function useClaimAttachmentsQuery(claimUid?: string) {
  const { isAuthenticated } = useAuth();
  return useQuery<ClaimAttachmentDto[]>({
    queryKey: ['claimAttachments', claimUid],
    queryFn: () => {
      if (!claimUid) return Promise.resolve([]);
      return fetchClaimAttachments(claimUid);
    },
    enabled: isAuthenticated && !!claimUid,
    staleTime: 30_000,
  });
}
