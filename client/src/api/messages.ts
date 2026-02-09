import { API_BASE_URL, apiFetch } from './index';

export type MessageDto = {
  uid: string;
  objectUid?: string;
  objectType?: string;
  createTime?: string;
  updateTime?: string;
  readTime?: string;
  sender?: string;
  sessionUid?: string;
  message?: string;
};

export async function fetchMessages(): Promise<MessageDto[]> {
  const res = await apiFetch(`${API_BASE_URL}/messages`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return await res.json();
}

export async function createMessage(payload: Partial<MessageDto>): Promise<MessageDto> {
  const res = await apiFetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create message');
  return await res.json();
}

export async function updateMessage(uid: string, patch: Partial<MessageDto>): Promise<MessageDto> {
  const res = await apiFetch(`${API_BASE_URL}/messages/${uid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update message');
  return await res.json();
}
