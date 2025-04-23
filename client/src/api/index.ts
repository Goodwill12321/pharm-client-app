// Здесь будут функции для работы с серверным API
// Пример:
// export async function getDebts() { ... }

export const API_BASE_URL = '/api';

/**
 * Универсальная функция для fetch-запросов с автоматическим добавлением JWT-токена
 * @param input URL или Request
 * @param init параметры fetch
 */
export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  let url = typeof input === 'string' ? input : input.url;
  // Не добавлять токен для запроса авторизации
  if (!url.includes('/auth/login')) {
    const token = localStorage.getItem('jwt');
    if (token) {
      init.headers = {
        ...(typeof init.headers === 'object' ? init.headers : {}),
        'Authorization': `Bearer ${token}`,
      };
    }
  }
  return fetch(input, init);
}
