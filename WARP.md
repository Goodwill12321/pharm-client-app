# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Monorepo with two apps and Docker Compose orchestration on a **remote server** (remote-first):
  - client/ — React + Vite + TypeScript PWA (Material UI, React Query). Dev server runs on remote port 5173 and proxies /api and /auth to the backend.
  - server/ — Spring Boot 3 (Java 17), layered architecture (controller → service → repository → entity), JWT auth, JPA/Hibernate, Flyway, Actuator, OpenAPI. **Compiled and run inside Docker on remote** (Maven in container).
  - docker-compose.yml selects an environment via ENV (default dev-secure) and starts: frontend (pharmopt-pa-frontend), backend (pharmopt-pa-backend), db (pharmopt-pa-db).

Remote development model
- Edit code locally; sync with **`./scripts/dev.sh sync`** or **`sync-restart`**.
- Config: `scripts/dev.env` (from `scripts/dev.env.example`) — host `alterserv.ru`, path `/home/projects/pharm-client-app`.
- docker compose, mvn test, swarm deploy: via **`scripts/dev.sh`** (remote by default) or SSH to server.
- Remote debug: **`./scripts/dev.sh tunnel`**, IDE attach to localhost:5005.
- Local OK: `./scripts/dev.sh lint` or `cd client && npm run lint`.

Common commands (from repo root)
- Sync + restart backend: ./scripts/dev.sh sync-restart
- Rsync only: ./scripts/dev.sh sync  (alias: rsync-to-remote)
- Restart backend: ./scripts/dev.sh restart-backend  (alias: remote-docker-rebuild)
- Swarm rebuild: ./scripts/dev.sh swarm-rebuild
- SSH tunnel: ./scripts/dev.sh tunnel
- Backend tests (remote): ./scripts/dev.sh test
- Frontend lint (local): ./scripts/dev.sh lint
- Docker Compose on remote: ./scripts/dev.sh up [ENV]   e.g. ./scripts/dev.sh up dev-dbfull
- Logs: ./scripts/dev.sh logs backend
- Optional local Docker: set DEV_TARGET=local in scripts/dev.env

Key runtime details
- Ports
  - Frontend: host 5173 → container 5173
  - Backend: host 8383 → container 8080 (Actuator exposed at 9080 inside container; health used for healthcheck)
  - DB: host 5333 → container 5432
- Backend auth/security
  - Endpoints /auth/login and /auth/refresh are public; most /api/** require JWT (bearer) configured by SecurityConfig.
  - JWT secret comes from env var JWT_SECRET; Compose sets a development value. Do not hardcode secrets.
- OpenAPI/Swagger
  - Swagger UI and OpenAPI JSON are enabled by springdoc; public paths are permitted in SecurityConfig.
- Dev hot reload (on remote)
  - Frontend: Vite dev server with volumes mounted in docker-compose.dev-dbfull.yml.
  - Backend: Spring DevTools in application-dev.properties; container starts with DEV=true, JDWP on 5005 in dev-dbfull. Maven runs inside container.
- Database/migrations (see DATABASE_INIT.md for full matrix)
  - Two operating modes via profiles:
    - dbfull: uses postgres user; Flyway enabled for schema changes (development/migrations only).
    - secure: uses restricted pharm_service user; Flyway disabled (day-to-day operation).
  - Profiles are combined, e.g. dev,dbfull or dev,secure. docker-compose.* files set SPRING_PROFILES_ACTIVE accordingly.

High-level architecture
- Frontend (client/)
  - Vite + React + TS; PWA via vite-plugin-pwa with auto updates and Workbox; MUI v5 for UI; React Query for data fetching/cache.
  - API base URL defaults to http://localhost:8080/api when running outside Compose; override via VITE_API_BASE_URL.
  - In dev under Compose, Vite proxies /api and /auth to http://backend:8080.
- Backend (server/)
  - Spring Boot 3, Java 17, modules:
    - controller: REST endpoints under /api/** and /auth/**.
    - service: business logic, orchestrates repositories.
    - repository: Spring Data JPA repositories for entities (Client, Goods, Invoices, Claims, etc.).
    - entity: JPA mappings with auditing fields; uses Lombok for boilerplate.
    - security: JwtAuthenticationFilter, JwtUtil (jjwt 0.11.x), SecurityConfig declares public routes and stateless sessions.
    - config: OpenApiConfig; devtools/logging config.
    - logging: logback customization (per-channel appenders for http/sql/hibernate/errors, LevelColorConverter).
  - Actuator exposes health/info; healthcheck polls http://localhost:9080/actuator/health inside the backend container.
  - Tests: WebMvcTest-based controller tests with MockMvc; SpringBootTest + Testcontainers for repository/integration with PostgreSQL.

Important project rules (from .cursor/rules)
- Target users often have slow internet, old hardware/OS, and low technical proficiency. Favor lightweight, compatible, and simple UX in changes.
- Deployment and dev flows are **remote Docker-first**; compile, test, and debug on remote server; local lint only for frontend.
- Communicate changes step-by-step. Before applying changes that were not discussed, ask for confirmation and explain the rationale.
