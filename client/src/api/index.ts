// Здесь будут функции для работы с серверным API
// Пример:
// export async function getDebts() { ... }

import { InvoiceHeader, InvoiceLine } from '../types/invoice';

export const API_BASE_URL = '/api';

export async function fetchInvoices(filters: any): Promise<InvoiceHeader[]> {
  const { search, status, dateFrom, dateTo, clientUids } = filters || {};
  const params: any = {};
  if (search) params.search = search;
  if (status) params.status = status;
  if (dateFrom) params.dateFrom = dateFrom;
  if (dateTo) params.dateTo = dateTo;
  if (clientUids) params.clientUids = clientUids;

  const query = new URLSearchParams(params).toString();
  const res = await apiFetch(`${API_BASE_URL}/invoiceh/filtered${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch invoices');
  return await res.json();
}

export async function fetchInvoiceLines(uid: string): Promise<InvoiceLine[]> {
  const res = await apiFetch(`${API_BASE_URL}/invoicet/by-uid/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch invoice lines');
  return await res.json();
}

/**
 * Универсальная функция для fetch-запросов с автоматическим добавлением JWT-токена
 * @param input URL или Request
 * @param init параметры fetch
 */
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
      window.location.reload();
      throw new Error('Session expired');
    }
  }
  return res;
}
