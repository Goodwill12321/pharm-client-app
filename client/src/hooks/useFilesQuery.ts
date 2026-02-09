import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchFiles, FileDto } from '../api/files';

export function useFilesQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery<FileDto[]>({
    queryKey: ['files'],
    queryFn: () => fetchFiles(),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}
