import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UpdateIcon from '@mui/icons-material/Update';
import CloudOffIcon from '@mui/icons-material/CloudOff';

export const UpdatePWAButton: React.FC = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);
  const [checking, setChecking] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Определяем, установлено ли как PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(!!isPWA);
    // Следим за онлайн-статусом
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // Проверяем наличие обновления
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(r => {
        setSwRegistered(!!r);
        if (r && r.waiting) setHasUpdate(true);
      });
    }
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);





  const checkForUpdate = async () => {
    setChecking(true);
    setError(null);
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        try {
          await reg.update();
          if (reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            setUpdated(true);
            setHasUpdate(false);
            setChecking(false);
            return;
          }
          let updatedNow = false;
          reg.addEventListener('updatefound', () => {
            if (reg.installing) {
              reg.installing.addEventListener('statechange', () => {
                if (reg.waiting && !updatedNow) {
                  reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                  setUpdated(true);
                  setHasUpdate(false);
                  updatedNow = true;
                  setChecking(false);
                }
              });
            }
          });
          setTimeout(() => {
            if (!updatedNow) {
              setError('Обновлений нет..');
              setChecking(false);
            }
          }, 3000);
        } catch (e: any) {
          setError('Ошибка при обновлении');
          setChecking(false);
          console.error('Service Worker update error:', e);
        }
      } else {
        setError('Service worker не зарегистрирован');
        setChecking(false);
      }
    } else {
      setError('Service worker не поддерживается');
      setChecking(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
      {/* Статус PWA и онлайн */}
      {isStandalone ? (
        <>
          <CheckCircleIcon color="success" sx={{ mr: 0.5 }} />
          <span style={{ fontSize: 13, marginRight: 8 }}>Установлено</span>
        </>
      ) : (
        <span style={{ fontSize: 13, color: '#888', marginRight: 8 }}>Web-версия</span>
      )}
      {online ? (
        <span style={{ fontSize: 13, color: '#4caf50', marginRight: 8 }}>Онлайн</span>
      ) : (
        <span style={{ fontSize: 13, color: '#f44336', marginRight: 8, display: 'flex', alignItems: 'center' }}><CloudOffIcon fontSize="small" sx={{ mr: 0.5 }} />Оффлайн</span>
      )}
      {/* Кнопка проверки обновления показывается если сервис-воркер зарегистрирован */}
      {swRegistered && (
        <Button
          variant={hasUpdate ? 'contained' : 'outlined'}
          color={hasUpdate ? 'warning' : updated ? 'success' : 'primary'}
          size="small"
          onClick={checkForUpdate}
          disabled={checking || updated}
          startIcon={hasUpdate ? <UpdateIcon /> : undefined}
          sx={{ ml: 1 }}
        >
          {checking ? <CircularProgress size={18} /> : hasUpdate ? 'Есть обновление!' : updated ? 'Обновлено!' : 'Проверить обновление'}
        </Button>
      )}
      {error && (
        <span style={{ color: 'red', marginLeft: 8, fontSize: 12 }}>{error}</span>
      )}
    </Box>
  );
};
