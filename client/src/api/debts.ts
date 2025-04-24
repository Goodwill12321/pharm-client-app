import { API_BASE_URL, apiFetch } from './index';

// Получить список дебиторки по типу (all, overdue, today, notdue)
export async function fetchDebtsWithFilter(address?: string) {
  let url = `${API_BASE_URL}/debitorka/filtered`;
  if (address) {
    url += `?address=${encodeURIComponent(address)}`;
  }
  const res = await apiFetch(url);
  if (!res.ok) throw new Error('Ошибка при получении данных');
  return res.json();
}

// Получить краткую сводку по просроченной дебиторке
export async function fetchOverdueSummary() {
  const res = await apiFetch(`${API_BASE_URL}/debitorka/overdue/summary`);
  if (!res.ok) throw new Error('Ошибка при получении задолженности');
  return res.json();
}
