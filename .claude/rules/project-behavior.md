# Поведение при работе с проектом

## Пользователи и UX

Целевая аудитория — заведующие аптек. Часто: медленный интернет, Windows XP–10, старые браузеры (Chrome 49+).

- Не добавлять тяжёлые зависимости без необходимости.
- UI на русском, простые формулировки, кликабельные элементы, расчет на разрешение экрана 1920х1080 (чаще всего встречается).
- TypeScript target ES2017 — учитывать старые браузеры.
- PWA уже настроен (Workbox, auto-update) — не ломать offline/cache стратегию без обсуждения.

## Процесс работы

1. Отвечать пошагово.
2. Перед изменениями, которые не обсуждались — **спросить**: что делаем и зачем.
3. Не создавать коммиты, если пользователь явно не попросил.
4. Не создавать markdown-документы, если пользователь не просил.

## Инфраструктура

- **Primary tool:** `./scripts/dev.sh` — rsync, restart, tunnel, tests (see `scripts/dev.env.example`).
- Sync workflow: edit locally → `./scripts/dev.sh sync-restart` → remote Docker recompiles/restarts.
- Tests (JUnit, Testcontainers, manual API/browser): **remote only**.
- Local machine: edit code; frontend **`npm run lint`** is OK locally.
- Dev on remote: hot-reload Spring DevTools (`DEV=true`) + Vite HMR; source via volumes.
- Remote debug: JDWP port **5005** — attach from local IDE via SSH tunnel. See skill `remote-dev`.
- Logs on remote: `server/logs/`, `docker compose logs`, MDC with user/IP via `RequestContext`.

## Интеграция 1С

- 1С — HTTP-клиент, не отдельный протокол.
- UID из 1С = PK в БД (`varchar(36)`).
- `NumberFormatConfig` принимает `.` и `,` в числах — не ломать для 1С.
- Роль `exchange_1c` проверяется по `contact.getLogin()`, не через `@PreAuthorize`.
