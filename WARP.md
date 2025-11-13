# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Monorepo with two apps and Docker Compose orchestration:
  - client/ — React + Vite + TypeScript PWA (Material UI, React Query). Dev server runs on 5173 and proxies /api and /auth to the backend.
  - server/ — Spring Boot 3 (Java 17), layered architecture (controller → service → repository → entity), JWT auth, JPA/Hibernate, Flyway, Actuator, OpenAPI.
  - docker-compose.yml selects an environment via ENV (default dev-secure) and starts: frontend (pharmopt-pa-frontend), backend (pharmopt-pa-backend), db (pharmopt-pa-db).

Common commands
- Frontend (run from client/)
  - Install deps: npm ci
  - Dev (Vite, PWA, proxy to backend): npm run dev
  - Build: npm run build
  - Preview built app: npm run preview
  - Lint (ESLint): npm run lint
- Backend (run from server/)
  - Build JAR and run tests: mvn -q clean package
  - Run app (local, uses your env/profiles): mvn spring-boot:run
  - Run with profiles (example dev,secure): SPRING_PROFILES_ACTIVE=dev,secure mvn spring-boot:run
  - Run all tests: mvn -q test
  - Run a single test class: mvn -q -Dtest=ClientControllerTest test
  - Run a single test method: mvn -q -Dtest=ClientControllerTest#testCreateClient test
  - From repo root, target server module: mvn -q -pl server -Dtest=... test
  - Integration tests use Testcontainers (Docker must be available)
- Docker Compose (from repo root)
  - Start default dev-secure stack: docker-compose up -d
  - Switch environment (examples):
    - ENV=dev-dbfull docker-compose up -d      # full DB rights for migrations (dev)
    - ENV=prod-secure docker-compose up -d     # prod-like, limited DB rights
  - Stop: docker-compose down

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
- Dev hot reload
  - Frontend: Vite dev server with volumes mounted in docker-compose.dev-dbfull.yml.
  - Backend: Spring DevTools enabled in application-dev.properties; dockerized backend starts with DEV=true for hot reload and debug port 5005 in dev-dbfull.
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
- Deployment and dev flows are Docker-first; three containers (frontend/backend/db) with volumes; hot reload enabled in dev.
- Communicate changes step-by-step. Before applying changes that were not discussed, ask for confirmation and explain the rationale.
