interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  data?: any;
}

class Logger {
  private isDev = import.meta.env.DEV;

  private formatTimestamp(): string {
    return new Date().toLocaleString('ru-RU', { 
      timeZone: 'Europe/Moscow',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  private log(level: LogEntry['level'], message: string, data?: any) {
    const logEntry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      data
    };

    if (this.isDev) {
      const logMessage = `[${logEntry.timestamp}] ${logEntry.level}: ${logEntry.message}`;
      
      switch (level) {
        case 'INFO':
          console.log(logMessage, data ? data : '');
          break;
        case 'WARN':
          console.warn(logMessage, data ? data : '');
          break;
        case 'ERROR':
          console.error(logMessage, data ? data : '');
          break;
        case 'DEBUG':
          console.debug(logMessage, data ? data : '');
          break;
      }
    }

    // В production можно отправлять логи на сервер
    if (!this.isDev && level === 'ERROR') {
      // Здесь можно добавить отправку ошибок на сервер
      this.sendToServer(logEntry);
    }
  }

  private sendToServer(logEntry: LogEntry) {
    // Заглушка для отправки логов на сервер
    // fetch('/api/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(logEntry)
    // }).catch(() => {});
  }

  info(message: string, data?: any) {
    this.log('INFO', message, data);
  }

  warn(message: string, data?: any) {
    this.log('WARN', message, data);
  }

  error(message: string, data?: any) {
    this.log('ERROR', message, data);
  }

  debug(message: string, data?: any) {
    this.log('DEBUG', message, data);
  }
}

export const logger = new Logger();
