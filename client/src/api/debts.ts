import { API_BASE_URL, apiFetch } from './index';

// Получить список дебиторки по типу (all, overdue, today, notdue)
export async function fetchDebts(type?: string) {
  let url = `${API_BASE_URL}/debitorka`;
  if (type === 'overdue') url = `${API_BASE_URL}/debitorka/overdue`;
  // Если потребуется отдельный эндпоинт для today или notdue — добавить ниже
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
