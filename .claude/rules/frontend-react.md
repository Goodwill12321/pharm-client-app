---
paths:
  - "client/**/*.tsx"
  - "client/**/*.ts"
  - "client/vite.config.ts"
---

# Frontend React conventions

## Stack

React 18, TypeScript 5 (strict), Vite 5, MUI v5 + Emotion, TanStack Query v5, react-router-dom v6, vite-plugin-pwa.

Entry: `client/src/main.tsx` → `App.tsx` (routes).

## Folder layout

```
src/api/         REST wrappers (domain modules)
src/hooks/       React Query hooks
src/pages/       Route screens
src/components/  Shared UI (Layout, filters, tables)
src/context/     AuthContext, AddressFilterContext
src/types/       TS models (clame.ts, invoice.ts, …)
src/theme/       MUI theme + debtColors
```

## API client

`src/api/index.ts`:

- `API_BASE_URL = '/api'`
- `apiFetch()` adds JWT, handles 401 → `/auth/refresh` → retry once → logout event
- Auth paths without `/api` prefix: `/auth/login`, `/auth/refresh`, `/auth/me`

Add new endpoint: create/update file in `src/api/`, then hook in `src/hooks/`.

## State

- Server data: React Query (`staleTime: 30_000`, `refetchInterval: 600_000`, `enabled: isAuthenticated`)
- Auth: JWT in `localStorage`, refresh cookie
- Address filter: `selectedAddresses` in localStorage via `AddressFilterContext`
- No Redux/Zustand

## Styling

- MUI theme in `src/theme/theme.ts` (green pharmacy palette `#2E7D32`)
- Primary styling: MUI `sx` prop
- Global helpers: `src/styles/global.css`
- No Tailwind, no CSS Modules

## Naming

Keep backend spellings: `clame`, `debitorka`, `sert`, `invoiceh`/`invoicet`.

## UX patterns

- `Layout.tsx`: nav shell, auth gate, version footer (`__APP_VERSION__`, `__BUILD_NUMBER__`)
- Many pages filter by `selectedAddresses` from context
- Locale: `ru-RU`, Moscow timezone
- Large page components OK — match existing style in the file you edit

## Dev / remote workflow

App runs on **remote server** in Docker. Vite HMR in `pharmopt-pa-frontend`; proxy `/api` and `/auth` to `http://backend:8080`. Port **5173** on server.

**Local (OK):** `cd client && npm run lint`

**Remote:** browser testing, `npm run build` inside container, HMR after editing synced `./client` sources.

Do not assume local `npm run dev` unless user explicitly uses local stack.

## Adding a new page

1. Component in `src/pages/`
2. Route in `App.tsx`
3. Nav link in `Layout.tsx` if needed
4. API module + hook + types

## Note

`axios` is in package.json but unused — use `apiFetch` (native fetch). Certificates page uses local `useState` instead of React Query — exception, not the default pattern.
