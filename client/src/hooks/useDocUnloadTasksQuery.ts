import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchDocUnloadTasks, DocUnloadTaskListFilters } from '../api/docUnloadTasks';
import { DocUnloadTask } from '../types/docUnloadTask';

export function useDocUnloadTasksQuery(filters: DocUnloadTaskListFilters, enabled: boolean) {
  const { isAuthenticated } = useAuth();

  return useQuery<DocUnloadTask[]>({
    queryKey: ['docUnloadTasks', filters],
    queryFn: () => fetchDocUnloadTasks(filters),
    staleTime: 30_000,
    enabled: isAuthenticated && enabled,
  });
}
