---
name: docker-dev
description: Docker Compose on the remote server for pharm-client-app. Use for container lifecycle on remote — not for local-only dev unless user asks. See also skill remote-dev for debug and testing.
---

# Docker on remote server

> Use **`./scripts/dev.sh`** from repo root. Config: `scripts/dev.env`.

## Container names

Prefix from `APP_PREFIX` (default `pharmopt-pa`):

- `pharmopt-pa-frontend` — Vite dev/preview, port 5173
- `pharmopt-pa-backend` — Spring Boot, port 8383 (8080 inside), debug 5005, **Maven compile inside container**
- `pharmopt-pa-db` — PostgreSQL 15, port 5333 (often 127.0.0.1 on server)

## Start environments

```bash
./scripts/dev.sh up              # dev-secure on remote
./scripts/dev.sh up dev-dbfull     # hot-reload + Flyway + JDWP 5005
```

Or directly on server via SSH if needed.

Compose chain: `docker-compose.yml` → `docker-compose.${ENV}.yml` → `docker-compose.base.yml`

## Compile & hot reload (remote)

| Layer | Where | Mechanism |
|-------|-------|-----------|
| Backend compile | Remote container | `mvn spring-boot:run` on start; DevTools when `DEV=true` |
| Backend sources | Volume on remote | `./server/src`, `./server/pom.xml` (not `./server/target`) |
| Frontend HMR | Remote container | Volume `./client:/app` |

After code sync to remote, backend restarts automatically (DevTools) or: `docker compose restart backend`.

## Remote debug

Stack with `DEV=true` (e.g. `ENV=dev-dbfull`) → JDWP on **5005**. Tunnel + IDE attach: skill **`remote-dev`** (`./scripts/dev.sh tunnel`).

## Useful commands (remote)

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose restart backend
docker exec -w /app pharmopt-pa-backend mvn -q test   # tests on remote
docker compose down
docker compose down -v   # ⚠️ destroys DB volume
```

## Health check

Backend healthcheck: `http://localhost:9080/actuator/health` inside container.

## Troubleshooting (remote)

**Backend won't start after schema change:**
→ `ENV=dev-dbfull docker compose up -d`, check Flyway logs.

**Debugger won't attach:**
→ Verify port 5005 published, `DEV=true`, SSH tunnel active.

**Frontend can't reach API:**
→ Inside Docker network Vite uses `http://backend:8080`. From browser use remote host port 5173 (frontend proxies API).

## Volumes (on remote filesystem)

- Postgres: `./server/data/postgres/`
- Certs: `./server/data/certs/`
- Chat images: `./server/data/chat_images/`
- Logs: `./server/logs/`
