---
name: add-api-feature
description: Add a full-stack feature (backend REST endpoint + frontend page) in pharm-client-app. Use when implementing new LK functionality exposed to users or 1C.
---

# Add full-stack API feature

## Overview

Typical flow: DB (if needed) → entity → repository → service → controller → frontend API → hook → page/UI.

## Backend (`server/`)

### 1. Database (if new tables/columns)

Use skill `flyway-migration`. Skip if reusing existing tables.

### 2. Entity

`server/src/main/java/com/pharma/clientapp/entity/`

- Match existing Lombok `@Data` style
- UID PK from 1C or generated UUID for app-created records
- Add `isDel`, audit timestamps if table has them

### 3. Repository

`server/src/main/java/com/pharma/clientapp/repository/`

- Spring Data JPA interface
- JPQL projections → `dto/` package if list views need joins

### 4. DTO (if needed)

`server/src/main/java/com/pharma/clientapp/dto/`

For filtered lists, autocomplete, 1C batch payloads.

### 5. Service

`server/src/main/java/com/pharma/clientapp/service/`

Thin CRUD or domain logic. User-scoped queries filter by `@AuthenticationPrincipal Contact`.

### 6. Controller

`server/src/main/java/com/pharma/clientapp/controller/`

- Base path `/api/{resource}`
- Document upsert behavior in JavaDoc for 1C-facing endpoints
- Use constructor injection
- For 1C-only ops: check `exchange_1c` login like `DocUnloadTaskController`

### 7. Security

Public routes only in `SecurityConfig`. Everything else needs JWT.

### 8. Test (remote only)

```bash
docker exec -w /app pharmopt-pa-backend mvn -q -Dtest=YourControllerTest test
```

Verify manually in browser against **remote** URLs. Swagger: `http://REMOTE:8383/v3/api-docs`

## Frontend (`client/`)

### 1. Types

`client/src/types/` — mirror entity/DTO fields, keep `clame`-style naming.

### 2. API module

`client/src/api/{domain}.ts` — thin wrapper around `apiFetch`.

### 3. React Query hook

`client/src/hooks/use{Domain}Query.ts` — `enabled: isAuthenticated`, standard stale/refetch options.

### 4. Page / component

`client/src/pages/` — use MUI, `AddressFilterContext` if client-scoped, `ru-RU` formatting.

### 5. Route + nav

- Route in `client/src/App.tsx`
- Link in `client/src/components/Layout.tsx`

## 1C sync considerations

If 1C pushes data:

- Provide `POST` upsert and/or `POST /add_batch`
- Accept both `.` and `,` in JSON numbers (already handled globally)
- Use string UIDs as PK

If LK creates data for 1C pull:

- 1C polls via `exchange_1c` account
- Document pending/status endpoints

## Checklist

- [ ] Flyway migration tested on remote (dev-dbfull)
- [ ] Swagger annotations if public API docs needed
- [ ] Frontend auth-gated queries
- [ ] Tests run on remote (`docker exec ... mvn test`)
- [ ] Verified on remote (browser / curl / Swagger on REMOTE:8383)
- [ ] No secrets in code
- [ ] UX simple for non-technical users
- [ ] Ask user before scope creep or unrelated refactors
