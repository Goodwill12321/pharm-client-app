import { API_BASE_URL } from './index';

export async function fetchOverdueSummary() {
  const res = await fetch(`${API_BASE_URL}/debitorka/overdue/summary`);
  if (!res.ok) throw new Error('Ошибка при получении задолженности');
  return res.json();
}
