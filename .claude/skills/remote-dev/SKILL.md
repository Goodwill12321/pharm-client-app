---
name: remote-dev
description: Remote server development workflow for pharm-client-app — Docker compile/run, remote debug attach, testing on remote. Use when building, testing, debugging, or running docker compose; do NOT assume local Maven/npm runtime for backend tests.
---

# Remote development workflow

## Default assumption

**The app runs on a remote server in Docker.** Local machine is mainly for editing code and (optionally) frontend lint.

| Action | Where |
|--------|--------|
| Edit source | Local IDE / synced repo on remote |
| **Compile backend** | **Remote** — Maven inside `pharmopt-pa-backend` container (`mvn spring-boot:run` on start, DevTools reload) |
| **Run / restart stack** | **Remote** — `docker compose` from project root on server |
| **JUnit / integration tests** | **Remote only** — inside backend container or on remote host with Docker |
| **Manual / API testing** | **Remote** — browser or curl against remote host ports |
| **Remote debug** | IDE locally → attach to remote JDWP port **5005** (via SSH tunnel) |
| **Frontend lint** | **Local OK** — `cd client && npm run lint` (no backend needed) |
| **Frontend build / HMR** | **Remote** — Vite in `pharmopt-pa-frontend` container |

Do **not** suggest raw `mvn test` or `ssh root@...` — use **`./scripts/dev.sh`** (whitelist commands).

## Dev script (`scripts/dev.sh`)

Config: copy `scripts/dev.env.example` → `scripts/dev.env` (gitignored).

Default server: `root@alterserv.ru:/home/projects/pharm-client-app`

| Command | Purpose |
|---------|---------|
| `./scripts/dev.sh sync` | rsync local → remote (excludes node_modules, .git, server/data, …) |
| `./scripts/dev.sh restart-backend` | remote `docker compose restart backend` |
| `./scripts/dev.sh sync-restart` | **typical workflow** after code edits |
| `./scripts/dev.sh swarm-rebuild` | `docker compose build` + `docker stack deploy pharmopt` |
| `./scripts/dev.sh tunnel` | SSH port-forward 5005, 8383, 5173 |
| `./scripts/dev.sh test` | `mvn test` in backend container on remote |
| `./scripts/dev.sh lint` | local `npm run lint` |
| `./scripts/dev.sh up dev-dbfull` | start stack with Flyway + debug |
| `./scripts/dev.sh logs backend` | follow backend logs |

Set `DEV_TARGET=local` in `dev.env` to run docker compose locally instead of SSH.

Legacy Run Script task names are aliases: `rsync-to-remote`, `remote-docker-rebuild`, `remote-swarm-rebuild`.

## Remote Docker stack

Containers (prefix `pharmopt-pa`):

- `pharmopt-pa-backend` — port **8383**→8080, debug **5005**, hot-reload when `DEV=true`
- `pharmopt-pa-frontend` — port **5173**
- `pharmopt-pa-db` — PostgreSQL **5333**→5432 (often bound to 127.0.0.1 on server)

Source volumes (on remote): `./server/src`, `./server/pom.xml`, `./client/` — changes trigger reload without local compile.

### Start on remote (SSH session)

```bash
cd /path/to/pharm-client-app
docker compose up -d                                    # dev-secure
ENV=dev-dbfull docker compose up -d                     # dev + Flyway + debug + HMR
docker compose logs -f backend
docker compose restart backend
```

## Remote debug attach

Backend exposes JDWP on port **5005** when `DEV=true` (see `server/Dockerfile`).

### 1. SSH tunnel (from local machine)

```bash
ssh -L 5005:127.0.0.1:5005 -L 8383:127.0.0.1:8383 user@REMOTE_HOST
```

Adjust ports if remote `.env` overrides `BACK_PORT` / `BACK_DEBUG_PORT`.

### 2. IDE configuration

- Type: **Remote JVM Debug** / **Attach**
- Host: `localhost`
- Port: `5005`
- Ensure dev profile stack is running (`ENV=dev-dbfull` or dev compose with `DEV=true`)

### 3. Verify debug port on remote

```bash
docker compose ps
ss -tlnp | grep 5005   # or: docker port pharmopt-pa-backend 5005
```

## Testing on remote

### Backend unit/integration tests

Run **inside** backend container (has Maven + Docker socket for Testcontainers):

```bash
docker exec -w /app pharmopt-pa-backend mvn -q test
docker exec -w /app pharmopt-pa-backend mvn -q -Dtest=ClientControllerTest test
```

Or SSH to remote and run from mounted `server/` if Maven installed on host — prefer container for consistency.

Testcontainers needs Docker on remote (`/var/run/docker.sock` is mounted in `docker-compose.base.yml`).

### Manual / API testing

- App UI: `http://REMOTE_HOST:5173`
- API: `http://REMOTE_HOST:8383/api/...`
- Swagger: `http://REMOTE_HOST:8383/swagger-ui/`
- OpenAPI JSON: `http://REMOTE_HOST:8383/v3/api-docs`

Use SSH tunnel or VPN if ports are not public.

### Frontend

- Functional testing in browser against **remote** frontend URL.
- Lint locally before push:

```bash
cd client && npm run lint
```

Do not assume `npm run dev` locally unless user requests it.

## Typical change workflow

1. Edit code **locally** in IDE.
2. **`./scripts/dev.sh sync-restart`** — rsync to remote + restart backend.
3. Frontend: Vite HMR on remote picks up synced `./client` (may need `restart-frontend` if no volume).
4. **`./scripts/dev.sh tunnel`** — attach debugger to `localhost:5005`.
5. **`./scripts/dev.sh test`** — run tests on remote.
6. Verify via tunnel (`localhost:8383`, `localhost:5173`) or direct remote URL.

## Flyway migrations

Only on remote with full DB rights:

```bash
ENV=dev-dbfull docker compose up -d
# watch Flyway in logs, then switch back:
ENV=dev-secure docker compose up -d
```

See skill `flyway-migration`.

## Logs on remote

```bash
docker compose logs -f backend
docker compose logs -f frontend
tail -f server/logs/*.log    # if mounted on remote filesystem
```

## What Claude should avoid

- Running `mvn test` / `mvn package` locally as default verification step.
- Raw `ssh root@alterserv.ru "..."` — use **`./scripts/dev.sh <command>`** instead.
- `docker compose down -v` without explicit user confirmation.
- Assuming `localhost:8383` works without **`./scripts/dev.sh tunnel`**.
- Starting local Docker stack unless `DEV_TARGET=local` or user asks.
