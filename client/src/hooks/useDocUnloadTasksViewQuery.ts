import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchDocUnloadTasks, DocUnloadTaskListFilters } from '../api/docUnloadTasks';
import { DocUnloadTaskViewDto } from '../types/docUnloadTask';

export function useDocUnloadTasksViewQuery(filters: DocUnloadTaskListFilters, enabled: boolean) {
  const { isAuthenticated } = useAuth();

  return useQuery<DocUnloadTaskViewDto[]>({
    queryKey: ['docUnloadTasksView', filters],
    queryFn: () => fetchDocUnloadTasks(filters),
    staleTime: 30_000,
    enabled: isAuthenticated && enabled,
  });
}
