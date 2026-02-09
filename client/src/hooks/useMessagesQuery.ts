import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchMessages, MessageDto } from '../api/messages';

export function useMessagesQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery<MessageDto[]>({
    queryKey: ['messages'],
    queryFn: () => fetchMessages(),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}
