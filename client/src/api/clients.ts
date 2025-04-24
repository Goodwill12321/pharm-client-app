import { API_BASE_URL, apiFetch } from './index';

export type Client = {
  id: string;
  name: string;
};

// Получить список клиентов (адресов)
export async function fetchClients(): Promise<{id: string, name: string}[]> {
  const res = await apiFetch(`${API_BASE_URL}/client-contacts/available-addresses`);
  if (!res.ok) throw new Error('Ошибка при получении списка адресов');
  return res.json();
}
