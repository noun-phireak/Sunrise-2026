# 09 — depends_on

## What it does
`depends_on` sets **startup order** between services. On its own it only waits
for the dependency to *start*. Combined with `condition: service_healthy`, it
waits until the dependency is actually **ready to serve** (its healthcheck passes).

## Syntax
```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy   # or: service_started / service_completed_successfully
```

## Notes
- Plain `depends_on: [db]` waits only for the container to *launch* — the
  database process may still be booting. That's rarely enough.
- `condition: service_healthy` requires the dependency to define a
  `healthcheck:` (see `10-healthcheck`).
- `depends_on` affects **ordering only** — it does not restart `app` if `db`
  later crashes. Your app must still handle reconnects.
- Conditions: `service_started`, `service_healthy`,
  `service_completed_successfully`.

## Run
```bash
docker compose up
```

## Expected output
```
 ✔ Container 09-depends_on-db-1   Healthy
app-1  | DB is healthy — app starting now
```

## Try it
```bash
docker compose up -d
docker compose ps            # db shows (healthy) before app runs
docker compose down -v
```
