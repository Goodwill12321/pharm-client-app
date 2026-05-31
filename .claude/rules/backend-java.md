---
paths:
  - "server/**/*.java"
  - "server/**/db/migration/*.sql"
  - "server/src/main/resources/application*.properties"
---

# Backend Java conventions

## Stack

Spring Boot 3.2.7, Java 17, Lombok, JPA/Hibernate, Flyway, JJWT 0.11.5, springdoc-openapi, AWS S3 SDK, p6spy (dev).

Package root: `com.pharma.clientapp`

## API patterns

Standard CRUD under `/api/{resource}`:

- `GET` — list or by id
- `POST` — **upsert** by primary key (document in JavaDoc)
- `DELETE` — hard delete

1C sync extras:

- `POST /add_batch` — bulk upsert (goods, series, sert, …)
- `PUT /replace/{parentKey}` — wipe + reload child collection
- `POST /replace-lines/{uid}` — invoice lines full replace

Auth endpoints: `/auth/login`, `/auth/refresh` (public). Most `/api/**` need `Authorization: Bearer`.

## Entities

- PK: string UUID from 1C, or `@GeneratedValue` + `@UuidGenerator` for app-generated (`DocUnloadTask`)
- Soft delete: `isDel` boolean
- Audit: `create_time`, `update_time` (often read-only in JPA)
- Composite PKs: `@Embeddable` ID classes (`SertGoodsId`, `SertSeriesId`, …)
- Naming mirrors DB/1C: `Clame` (not Claim), `docnum`, `sertno`

## Persistence hybrid

- Normal ops: Spring Data JPA repositories
- High-volume 1C upserts: `*BatchRepositoryImpl` with `JdbcTemplate` + `INSERT … ON CONFLICT DO UPDATE`

## Security

- `SecurityConfig`, `JwtAuthenticationFilter`, `JwtUtil`
- `@AuthenticationPrincipal Contact contact` in controllers
- CSRF disabled (stateless API)
- Authorization ad hoc (e.g. `exchange_1c` login check), not role-based Spring Security

## Errors

`GlobalExceptionHandler` → JSON `{timestamp, status, error, message}`. Logs user + IP from `RequestContext`.

## Tests

```
server/src/test/java/com/pharma/clientapp/
  ClientControllerTest.java      @WebMvcTest + MockMvc
  ClientRepositoryIntegrationTest.java  @SpringBootTest + Testcontainers PG 15
  NumberFormatConfigTest.java
```

**Run on remote server** (inside backend container):

```bash
./scripts/dev.sh test
./scripts/dev.sh test -Dtest=ClientControllerTest
```

Testcontainers requires Docker on remote (`/var/run/docker.sock` mounted). Do not assume local `mvn test` works.

## New migration checklist

1. File: `server/src/main/resources/db/migration/V{N}__description.sql`
2. Test with `ENV=dev-dbfull docker compose up -d` **on remote server**
3. Switch back to `dev-secure` for daily work
4. Secure profiles have `spring.flyway.enabled=false`

## Injection style

Prefer constructor injection (newer code). Some legacy controllers still use `@Autowired` fields — match surrounding file when editing.
