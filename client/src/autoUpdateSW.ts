// Автоматическое обновление PWA: обновление при открытии или простое
// Показывает уведомление, если скачана новая версия, и обновляет страницу при бездействии или при открытии

const AUTO_UPDATE_DELAY = 600000; // 10 минут после простоя (можно увеличить)

function listenForWaitingServiceWorker(reg: ServiceWorkerRegistration, callback: () => void) {
  if (!reg) return;
  if (reg.waiting) {
    callback();
    return;
  }
  function stateChangeListener() {
    if (reg.waiting) {
      callback();
    }
  }
  if (reg.installing) {
    reg.installing.addEventListener('statechange', stateChangeListener);
  }
  reg.addEventListener('updatefound', () => {
    if (reg.installing) {
      reg.installing.addEventListener('statechange', stateChangeListener);
    }
  });
}

export function setupAutoUpdateSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => {
      listenForWaitingServiceWorker(reg, () => {
        // Если пользователь неактивен или только что открыл вкладку — обновить
        let idleTimeout = setTimeout(() => {
          reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
        }, AUTO_UPDATE_DELAY);
        // Если пользователь начнет активно работать — сбросить таймер
        ['mousemove', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
          window.addEventListener(evt, () => {
            clearTimeout(idleTimeout);
          }, { once: true });
        });
      });
    });
    // При смене контроллера — перезагрузить страницу
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
}
