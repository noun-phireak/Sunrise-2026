# 01 — services

## What it does
`services:` is the heart of every Compose file. Each key under it is one
**service** — a container Compose will create and manage for you. Instead of a
long `docker run …` line, you describe the container **declaratively** in YAML.

## Syntax
```yaml
services:
  <service-name>:
    image: <image>
    command: <override the image's default command>
```

## Notes
- The file is named `compose.yaml` (modern) or `docker-compose.yml` (legacy).
  `docker compose` finds either automatically.
- Use `docker compose` (v2 plugin, a space) — not the old `docker-compose` (v1 hyphen).
- The **service name** (`hello`) is also the container's DNS hostname on the
  Compose network (see `08-networks`).
- Compose creates a **project** (named after the folder by default) and prefixes
  everything it makes: container `01-services-hello-1`, network `01-services_default`.

## Run
```bash
docker compose up
```

## Expected output
```
 ✔ Container 01-services-hello-1  Created
Attaching to hello-1
hello-1  | Hello from Compose — I am the 'hello' service
hello-1 exited with code 0
```

## Try it
```bash
docker compose up -d          # detached (background)
docker compose ps             # list this project's containers
docker compose logs           # view output
docker compose config         # print the fully-resolved config
docker compose down           # stop & remove containers + network
```
