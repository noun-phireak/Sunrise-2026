# 14 — profiles

## What it does
`profiles` let one Compose file describe **optional** services that stay dormant
until you opt in. Perfect for dev-only tools, one-off seeders, or a `debug`
stack you don't want running by default.

## Syntax
```yaml
services:
  debug-tools:
    profiles: ["debug"]        # only starts when the "debug" profile is active
```

## Notes
- A service with **no** `profiles` is always in the default set.
- Activate profiles with `--profile NAME` (repeatable) or the env var
  `COMPOSE_PROFILES=debug,setup`.
- Naming a profiled service directly (`docker compose up seed`) also starts it.
- `docker compose down` stops **all** started services regardless of profile.

## Run
```bash
docker compose up                       # only `app` starts
docker compose --profile debug up       # app + debug-tools
docker compose --profile debug --profile setup up   # all three
```

## Expected output (default `up`)
```
app-1  | core app — always starts
```

## Expected output (`--profile debug up`)
```
app-1          | core app — always starts
debug-tools-1  | debug tools — only with --profile debug
```

## Try it
```bash
COMPOSE_PROFILES=setup docker compose up seed
docker compose down
```
