import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchDocUnloadHistoryByDocUid } from '../api/docUnloadTasks';
import { DocUnloadTask } from '../types/docUnloadTask';

export function useDocUnloadHistoryQuery(docUid: string | undefined, enabled: boolean) {
  const { isAuthenticated } = useAuth();

  return useQuery<DocUnloadTask[]>({
    queryKey: ['docUnloadHistory', docUid],
    queryFn: () => {
      if (!docUid) return Promise.resolve([]);
      return fetchDocUnloadHistoryByDocUid(docUid);
    },
    staleTime: 30_000,
    enabled: isAuthenticated && !!docUid && enabled,
  });
}
