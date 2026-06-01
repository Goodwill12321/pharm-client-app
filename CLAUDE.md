# pharm-client-app — Claude Code context

Личный кабинет для клиентов оптовой фармацевтической фирмы (заведующие аптек). Интеграция с учётной системой 1С через REST API.

## Критичные ограничения

- **Аудитория:** слабый интернет, старое железо/ОС, низкая компьютерная грамотность → лёгкий UI, совместимость, простота.
- **Remote-first:** приложение **работает на удалённом сервере** в Docker. Сборка backend, запуск, **тесты и ручная проверка — только на remote**. Локально — правка кода и (опционально) `npm run lint`.
- **Remote debug:** IDE подключается к JDWP **5005** на сервере (обычно через SSH tunnel). См. skill `remote-dev`.
- **Docker-first:** 3 контейнера — `pharmopt-pa-frontend`, `pharmopt-pa-backend`, `pharmopt-pa-db`.
- **Перед неожиданными изменениями** — спросить пользователя: зачем и почему (см. `.claude/rules/project-behavior.md`).
- **Отвечать пошагово** на русском, если пользователь пишет по-русски.

## Структура репозитория

```
client/          React 18 + Vite 5 + TypeScript + MUI v5 + TanStack Query (PWA)
server/          Spring Boot 3.2.7, Java 17, JPA, Flyway, JWT, PostgreSQL 15
docker-compose.* ENV переключает окружение (по умолчанию dev-secure)
```

## Цикл разработки

## Команды (удалённый сервер + локальная синхронизация)
> Основной инструмент: **`./scripts/dev.sh`** (remote: `alterserv.ru:/home/projects/pharm-client-app`).
> Конфиг: `scripts/dev.env` (скопировать из `scripts/dev.env.example`). Порты: frontend `5173`, backend `8383`, debug `5005` (JDWP), PostgreSQL `5333`.

```bash
cp scripts/dev.env.example scripts/dev.env   # один раз
./scripts/dev.sh sync-restart              # rsync → remote + restart backend (основной цикл)
./scripts/dev.sh tunnel                    # SSH tunnel: debug 5005 + localhost:8383/5173
./scripts/dev.sh test                      # mvn test в backend-контейнере на remote
cd client && npm run lint                  # lint локально
```

Полный список команд, remote debug, Swagger, troubleshooting — skills **`remote-dev`** и **`docker-dev`**.

## Архитектура (кратко)

### Backend — REST sync hub

- Слои: `controller` → `service` → `repository` → `entity`. Пакет `com.pharma.clientapp`.
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
3. Новый API: entity → repository → service → controller → `client/src/api/` → hook → page (skill `add-api-feature`).
4. Не хардкодить секреты (`JWT_SECRET` из env).
5. Тесты: `@WebMvcTest` / Testcontainers — **запускать на remote** (`./scripts/dev.sh test`), не локально.

## Контекст по scope (загружается по необходимости)

- **Backend Java:** `.claude/rules/backend-java.md` — при работе с `server/**`
- **Frontend React:** `.claude/rules/frontend-react.md` — при работе с `client/**`
- **Поведение/UX/процесс:** `.claude/rules/project-behavior.md`
- **Skills:** `.claude/skills/` — `remote-dev`, `docker-dev`, `flyway-migration`, `add-api-feature`
- **Справочно (по запросу):** `WARP.md`, `DATABASE_INIT.md`, `.cursor/rules/description-project.mdc`

## Память (auto memory)

Claude Code может сам записывать learnings в auto memory (`/memory`). Для личных настроек проекта — `CLAUDE.local.md` (уже в `.gitignore` через `*.local`).
