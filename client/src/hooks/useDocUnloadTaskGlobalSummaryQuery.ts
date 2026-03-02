import { useQuery } from '@tanstack/react-query';
import { fetchDocUnloadTaskSummaryByContact } from '../api/docUnloadTasks';

export function useDocUnloadTaskGlobalSummaryQuery() {
  return useQuery({
    queryKey: ['docUnloadTaskGlobalSummary'],
    queryFn: fetchDocUnloadTaskSummaryByContact,
    staleTime: 5 * 60 * 1000,
  });
}
