// Здесь будут функции для работы с серверным API
// Пример:
// export async function getDebts() { ... }

import { InvoiceHeader, InvoiceLine } from '../types/invoice';

export const API_BASE_URL = '/api';


/**
 * Универсальная функция для fetch-запросов с автоматическим добавлением JWT-токена
 * @param input URL или Request
 * @param init параметры fetch
 */
let isRefreshing = false; // глобальный флаг для предотвращения зацикливания

export async function apiFetch(input: RequestInfo, init: RequestInit = {}, retry = true): Promise<Response> {
  let url = typeof input === 'string' ? input : input.url;
  // Не добавлять токен для запроса авторизации/refresh
  if (!url.includes('/auth/login') && !url.includes('/auth/refresh')) {
    const token = localStorage.getItem('jwt');
    if (token) {
      // Корректно работаем с типом HeadersInit
      if (init.headers instanceof Headers) {
        init.headers.set('Authorization', `Bearer ${token}`);
      } else {
        init.headers = {
          ...(typeof init.headers === 'object' ? init.headers : {}),
          'Authorization': `Bearer ${token}`,
        } as Record<string, string>;
      }
    }
  }
  let res = await fetch(input, { ...init, credentials: 'include' }); 
  if ((res.status === 401 || res.status === 403) && retry && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
    // Попробовать обновить access token
    const refreshRes = await fetch('/auth/refresh', { method: 'POST', credentials: 'include' });
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem('jwt', data.token);
      // Повторить исходный запрос с новым токеном
      if (init.headers instanceof Headers) {
        init.headers.set('Authorization', `Bearer ${data.token}`);
      } else if (init.headers && typeof init.headers === 'object') {
        (init.headers as Record<string, string>)['Authorization'] = `Bearer ${data.token}`;
      } else {
        init.headers = { 'Authorization': `Bearer ${data.token}` };
      }
      res = await fetch(input, { ...init, credentials: 'include' });
    } else {
      // refresh не сработал — разлогиниваем
      localStorage.removeItem('jwt');
      // Диспатчим глобальное событие logout для реактивного разлогинивания
      window.dispatchEvent(new Event('logout'));
      return Promise.reject();
    }
  }
  return res;
}
