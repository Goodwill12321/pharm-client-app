import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchFilesClame, FilesClameDto } from '../api/filesClame';

export function useFilesClameQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery<FilesClameDto[]>({
    queryKey: ['filesClame'],
    queryFn: () => fetchFilesClame(),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}
