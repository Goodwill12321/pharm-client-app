---
name: flyway-migration
description: Create and apply Flyway database migrations for pharm-client-app. Use when adding/changing DB schema, creating V*.sql files, or switching to dev-dbfull for migrations.
---

# Flyway migration workflow

## When to use

- New table, column, index, constraint
- Data migration in SQL
- Fixing schema drift

## Prerequisites

Migrations run only when Flyway is enabled (`dbfull` profile). Daily dev uses `dev-secure` where Flyway is **disabled**.

## Steps

### 1. Find next version number

```bash
ls server/src/main/resources/db/migration/ | sort -V | tail -1
```

Next file: `V{N+1}__short_snake_case_description.sql`

### 2. Write migration

- Location: `server/src/main/resources/db/migration/`
- Idempotent where possible (check `IF NOT EXISTS`)
- Match existing naming: lowercase columns, `varchar(36)` for UIDs
- Reference `V1__init_schema.sql` for patterns

### 3. Apply on remote server

```bash
# SSH to remote, then:
ENV=dev-dbfull docker compose up -d
docker compose logs -f backend | grep -i flyway
```

Do not run Flyway migrations from a local machine unless it shares the same remote DB (unusual).

### 4. Update JPA entity if needed

Entity in `server/src/main/java/com/pharma/clientapp/entity/`. Keep `ddl-auto=none`.

### 5. Return to secure profile (remote)

```bash
ENV=dev-secure docker compose up -d
```

### 6. Production (two-phase)

See `@DATABASE_INIT.md`:

1. `ENV=prod-dbfull` — run migration
2. `ENV=prod-secure` — normal operation

Optional: `./scripts/migrate.sh safe` or `critical` if script exists.

## DB users

| Profile | User | Flyway |
|---------|------|--------|
| `*dbfull` | postgres | enabled |
| `*secure` | pharm_service | disabled |

## Checklist

- [ ] Migration version is sequential (no gaps/conflicts)
- [ ] Tested on dev-dbfull
- [ ] Entity/repository updated
- [ ] No breaking change for 1C sync without coordination
