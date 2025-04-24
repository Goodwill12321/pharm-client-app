import { API_BASE_URL, apiFetch } from './index';

// Получить список дебиторки по типу (all, overdue, today, notdue)
export async function fetchDebtsWithFilter(addressIds?: string[]) {
  let url = `${API_BASE_URL}/debitorka/filtered`;
  if (addressIds && addressIds.length > 0) {
    const params = addressIds.map(id => `addresses=${encodeURIComponent(id)}`).join('&');
    url += `?${params}`;
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
