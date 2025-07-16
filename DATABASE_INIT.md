# Инициализация базы данных

## Обзор

Приложение использует разные пользователи для разных окружений:

### 🛡️ БЕЗОПАСНЫЕ ОКРУЖЕНИЯ (рекомендуемые для обычной работы)
- **dev-secure**: `pharm_service` - ограниченные права только для работы с данными
- **prod-secure**: `pharm_service` - ограниченные права только для работы с данными
- **swarm-secure**: `pharm_service` - ограниченные права только для работы с данными

### ⚠️ ОКРУЖЕНИЯ С ПОЛНЫМ ДОСТУПОМ К БД (только для миграций!)
- **dev-dbfull**: `postgres` - полные права для изменения структуры БД
- **prod-dbfull**: `postgres` - полные права для изменения структуры БД
- **swarm-dbfull**: `postgres` - полные права для изменения структуры БД

## Права пользователей

### postgres (dbfull окружения - ТОЛЬКО ДЛЯ МИГРАЦИЙ!)
- ✅ Полные права на изменение структуры БД
- ✅ Выполнение миграций
- ✅ Все операции с данными
- ⚠️ **НЕ ИСПОЛЬЗОВАТЬ ДЛЯ ОБЫЧНОЙ РАБОТЫ!**

### pharm_service (secure окружения - для обычной работы)
#### ✅ Разрешенные операции:
- Подключение к базе данных
- Чтение данных (SELECT)
- Вставка данных (INSERT)
- Обновление данных (UPDATE)
- Удаление данных (DELETE)
- Использование последовательностей
- Создание временных таблиц

#### ❌ Запрещенные операции:
- Изменение структуры таблиц (CREATE, DROP, ALTER)
- Управление схемами
- Управление правами других пользователей

## Процесс работы

### Разработка (локально)

#### Обычная разработка (безопасно)
```bash
# Запуск с ограниченными правами (по умолчанию)
docker-compose up -d

# Или явно указать dev-secure окружение
ENV=dev-secure docker-compose up -d

# Приложение использует pharm_service с ограниченными правами
```

#### Разработка с полными правами (только для миграций!)
```bash
# Запуск с полными правами для изменения структуры БД
ENV=dev-dbfull docker-compose up -d

# ⚠️ ВНИМАНИЕ: Используется только для создания миграций!
```

### Продакшн (двухэтапный процесс)

#### 1. Первый запуск (создание пользователя)
```bash
# Запуск с postgres для создания ограниченного пользователя
ENV=prod-dbfull docker-compose up -d

# Приложение создает pharm_service и выполняет миграции
```

#### 2. Безопасная работа
```bash
# Переключение на ограниченного пользователя
ENV=prod-secure docker-compose up -d

# Приложение использует pharm_service без возможности изменения структуры БД
```

### Swarm (продакшн кластер)

#### 1. Первый запуск (создание пользователя)
```bash
# Запуск swarm с postgres для создания ограниченного пользователя
ENV=swarm-dbfull docker stack deploy -c docker-compose.yml pharmopt

# Приложение создает pharm_service и выполняет миграции
```

#### 2. Безопасная работа
```bash
# Переключение на ограниченного пользователя
ENV=swarm-secure docker stack deploy -c docker-compose.yml pharmopt

# Приложение использует pharm_service без возможности изменения структуры БД
```

## Структура Docker Compose файлов

### Базовый файл
- `docker-compose.base.yml` - общие настройки для всех сервисов

### Основной файл с переключением окружений
- `docker-compose.yml` - переключается между окружениями через переменную ENV

### Файлы окружений

#### БЕЗОПАСНЫЕ ОКРУЖЕНИЯ (рекомендуемые):
- `docker-compose.dev-secure.yml` - разработка (dev-secure профиль, наследует от dev-dbfull)
- `docker-compose.prod-secure.yml` - продакшн (prod-secure профиль, наследует от prod-dbfull)
- `docker-compose.swarm-secure.yml` - продакшн в swarm режиме (prod-secure профиль, наследует от swarm-dbfull)

#### ОКРУЖЕНИЯ С ПОЛНЫМ ДОСТУПОМ К БД (только для миграций!):
- `docker-compose.dev-dbfull.yml` - разработка (dev-dbfull профиль + hot reload)
- `docker-compose.prod-dbfull.yml` - продакшн (prod-dbfull профиль)
- `docker-compose.swarm-dbfull.yml` - продакшн в swarm режиме (prod-dbfull профиль)

Схема наследования:
```
docker-compose.base.yml (базовые настройки)
├── docker-compose.dev-dbfull.yml (наследует от base + dev настройки)
│   └── docker-compose.dev-secure.yml (наследует от dev-dbfull + secure профиль)
├── docker-compose.prod-dbfull.yml (наследует от base + prod настройки)
│   └── docker-compose.prod-secure.yml (наследует от prod-dbfull + secure профиль)
└── docker-compose.swarm-dbfull.yml (наследует от base + swarm настройки)
    └── docker-compose.swarm-secure.yml (наследует от swarm-dbfull + secure профиль)
```

### Переключение окружений

Docker Compose автоматически читает переменную `ENV` из файла `.env` в корне проекта.

**По умолчанию**: `ENV=dev-secure` (безопасная разработка)

**Для переключения окружения**:
```bash
# БЕЗОПАСНЫЕ ОКРУЖЕНИЯ (рекомендуемые):
ENV=dev-secure docker-compose up -d    # разработка (по умолчанию)
ENV=prod-secure docker-compose up -d   # продакшн
ENV=swarm-secure docker-compose up -d  # swarm

# ОКРУЖЕНИЯ С ПОЛНЫМ ДОСТУПОМ К БД (только для миграций!):
ENV=dev-dbfull docker-compose up -d    # разработка с полными правами
ENV=prod-dbfull docker-compose up -d   # продакшн с полными правами
ENV=swarm-dbfull docker-compose up -d  # swarm с полными правами
```

**Примечание**: 
- `docker-compose.yml` использует переменную ENV из файла `.env` для переключения между файлами окружений
- По умолчанию используется dev-secure окружение (`ENV=dev-secure` в `.env`)
- Основные файлы (dev-dbfull, prod-dbfull, swarm-dbfull) наследуют от `docker-compose.base.yml`
- Secure файлы наследуют от соответствующих dbfull файлов и переопределяют только профиль Spring
- Миграции отключены в secure версиях (`spring.flyway.enabled=false`)

## Конфигурации

### Основные конфигурации (dbfull - только для миграций!)
- `application.properties` - по умолчанию (postgres для разработки)
- `application-dev-dbfull.properties` - разработка (postgres, полные права)
- `application-prod-dbfull.properties` - продакшн (postgres, полные права)

### Secure конфигурации (для обычной работы)
- `application-dev-secure.properties` - разработка (pharm_service, ограниченные права)
- `application-prod-secure.properties` - продакшн (pharm_service, ограниченные права)

**Примечание**: Secure конфигурации наследуют все настройки из основных конфигураций, переопределяя только:
- Пользователя БД (`pharm_service`)
- Пароль БД
- Отключение миграций (`spring.flyway.enabled=false`)

## Преимущества подхода

### 🛡️ Безопасность
- В продакшне приложение работает с минимальными правами
- Даже при компрометации учетных данных структура БД защищена
- Четкое разделение между безопасными и dbfull окружениями

### 🔧 Гибкость разработки
- Локально можно свободно изменять структуру БД (dev-dbfull)
- Миграции работают корректно в разработке
- Безопасная разработка с ограниченными правами (dev-secure)

### 📋 Контроль версий
- Все изменения структуры БД отслеживаются через миграции
- Четкое разделение между разработкой и продакшном
- Явное указание когда используются полные права

## Устранение неполадок

### Если нужно изменить структуру БД в продакшне:
1. Временно переключиться на `ENV=prod-dbfull`
2. Выполнить миграцию
3. Вернуться к `ENV=prod-secure`

### Если миграции не выполняются:
```bash
# Проверить статус БД
docker-compose ps

# Пересоздать БД
docker-compose down -v
docker-compose up -d db
ENV=prod-dbfull docker-compose up -d
```

### Для запуска миграций:
```bash
# Безопасная миграция (без остановки приложения)
./scripts/migrate.sh safe

# Критическая миграция (с остановкой приложения)
./scripts/migrate.sh critical
``` 