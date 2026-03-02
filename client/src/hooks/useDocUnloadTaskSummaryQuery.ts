import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchDocUnloadTaskSummaryByDocUids } from '../api/docUnloadTasks';
import { DocUnloadTaskSummary } from '../types/docUnloadTask';

export function useDocUnloadTaskSummaryQuery(docUids: string[]) {
  const { isAuthenticated } = useAuth();

  return useQuery<DocUnloadTaskSummary[]>({
    queryKey: ['docUnloadTaskSummary', docUids],
    queryFn: () => fetchDocUnloadTaskSummaryByDocUids(docUids),
    staleTime: 30_000,
    enabled: isAuthenticated && Array.isArray(docUids) && docUids.length > 0,
  });
}
