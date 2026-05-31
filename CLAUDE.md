# pharm-client-app — Claude Code context

Личный кабинет для клиентов оптовой фармацевтической фирмы (заведующие аптек). Интеграция с учётной системой 1С через REST API.

## Критичные ограничения

- **Аудитория:** слабый интернет, старое железо/ОС, низкая компьютерная грамотность → лёгкий UI, совместимость, простота.
- **Remote-first:** приложение **работает на удалённом сервере** в Docker. Сборка backend, запуск, **тесты и ручная проверка — только на remote**. Локально — правка кода и (опционально) `npm run lint`.
- **Remote debug:** IDE подключается к JDWP **5005** на сервере (обычно через SSH tunnel). См. skill `remote-dev`.
- **Docker-first:** 3 контейнера — `pharmopt-pa-frontend`, `pharmopt-pa-backend`, `pharmopt-pa-db`.
- **Перед неожиданными изменениями** — спросить пользователя: зачем и почему.
- **Отвечать пошагово** на русском, если пользователь пишет по-русски.

## Структура репозитория

```
client/          React 18 + Vite 5 + TypeScript + MUI v5 + TanStack Query (PWA)
server/          Spring Boot 3.2.7, Java 17, JPA, Flyway, JWT, PostgreSQL 15
docker-compose.* ENV переключает окружение (по умолчанию dev-secure)
```

Подробнее: `@WARP.md`, `@DATABASE_INIT.md`, `@.cursor/rules/description-project.mdc`

## Команды (удалённый сервер + локальная синхронизация)

> Основной инструмент: **`./scripts/dev.sh`**. Конфиг: `scripts/dev.env` (скопировать из `scripts/dev.env.example`).

### Типичный цикл разработки

```bash
cp scripts/dev.env.example scripts/dev.env   # один раз
./scripts/dev.sh sync-restart              # rsync → remote + restart backend
./scripts/dev.sh tunnel                    # SSH tunnel для debug / localhost:8383
./scripts/dev.sh test                      # mvn test в контейнере на remote
cd client && npm run lint                  # lint локально
```

### Команды dev.sh (аналог Run Script)

| Команда | Run Script alias | Действие |
|---------|------------------|----------|
| `sync` | rsync-to-remote | rsync на `alterserv.ru:/home/projects/pharm-client-app/` |
| `restart-backend` | remote-docker-rebuild | `docker compose restart backend` на remote |
| `swarm-rebuild` | remote-swarm-rebuild | `docker compose build` + `docker stack deploy` |
| `sync-restart` | — | sync + restart backend |
| `tunnel` | — | SSH `-L 5005,8383,5173` для debug и UI |
| `up [ENV]` | — | `docker compose up -d` (напр. `up dev-dbfull`) |
| `logs [svc]` | — | `docker compose logs -f` |
| `test [args]` | — | `docker exec … mvn test` на remote |

`DEV_TARGET=local` в `dev.env` — docker compose локально (опционально).

### Docker на remote (напрямую по SSH)

```bash
ENV=dev-dbfull docker compose up -d    # hot-reload + Flyway + debug 5005
ENV=dev-secure docker compose up -d
docker compose logs -f backend
```

Порты на сервере: frontend **5173**, backend **8383**, debug **5005**, PostgreSQL **5333**.

### Remote debug

```bash
./scripts/dev.sh tunnel
# IDE: Attach to localhost:5005
```

### Swagger / API

`http://alterserv.ru:8383/swagger-ui/` (или через tunnel: `localhost:8383`)

Подробно: skill **`remote-dev`**, конфиг **`scripts/dev.env.example`**

## Архитектура (кратко)

### Backend — REST sync hub

- Слои: `controller` → `service` → `repository` → `entity`
- **Auth:** stateless JWT. `POST /auth/login`, refresh в HttpOnly cookie. Principal = `Contact`.
- **1С:** тот же REST API под тех. пользователем `exchange_1c`. Upsert по UID, batch (`/add_batch`), full replace (`/replace/{key}`).
- **Flyway:** `server/src/main/resources/db/migration/V*.sql`. `ddl-auto=none`.
- **Профили:** комбинируются — `dev,secure` (работа), `dev,dbfull` (миграции). Secure = `pharm_service`, Flyway off.

### Frontend

- Маршруты в `client/src/App.tsx`. API через `client/src/api/index.ts` (`apiFetch`, JWT из localStorage).
- React Query в `client/src/hooks/`. Address filter в `AddressFilterContext`.
- Имена с бэкенда: `clame`, `debitorka`, `invoiceh`, `sert` — **не переименовывать**.

### Домены

| Область | Backend | Frontend |
|---------|---------|----------|
| Задолженность | `/api/debitorka` | `/debts`, Dashboard |
| Накладные | `/api/invoiceh`, `/api/invoicet` | `/invoices` |
| Эл. накладные (→1С) | `/api/doc-unload-tasks` | Invoices (unload tasks) |
| Сертификаты | `/api/sert`, sert-goods/series | `/certificates` |
| Претензии | `/api/clameh`, `/api/clamet` | `/claims` |

## Соглашения при изменениях

1. Минимальный diff — только запрошенное.
2. Новая миграция Flyway — только в `dev-dbfull`, см. skill `flyway-migration`.
3. Новый API: entity → repository → service → controller → `client/src/api/` → hook → page.
4. Не хардкодить секреты (`JWT_SECRET` из env).
5. Тесты: `@WebMvcTest` / Testcontainers — **запускать на remote** (`docker exec ... mvn test`), не локально по умолчанию.

## Дополнительный контекст (загружается по scope)

- **Backend Java:** `.claude/rules/backend-java.md` — при работе с `server/**`
- **Frontend React:** `.claude/rules/frontend-react.md` — при работе с `client/**`
- **Skills:** `.claude/skills/` — **`remote-dev`**, миграции, Docker, добавление фичи

## Память (auto memory)

Claude Code может сам записывать learnings в auto memory (`/memory`). Для личных настроек проекта — `CLAUDE.local.md` (уже в `.gitignore` через `*.local`).
