# Docker Compose — Complete Teaching Lab

A hands-on lab with **one folder per Docker Compose concept**. Each folder is
self-contained: a `compose.yaml`, any files it needs, and a `README.md` that
explains the concept, gives the exact `docker compose` commands, and shows the
**expected output**.

> Built for teaching. Go folder by folder in order — each one adds a new concept.
> This is the companion to the [`../dockerfile`](../dockerfile) lab: once you can
> build one image, Compose runs and wires **many** together.

## Requirements

- Docker with the Compose v2 plugin (`docker compose version`) — tested on Docker 29.x
- A terminal

> Use `docker compose` (v2, a space) — **not** the old `docker-compose` (v1, a hyphen).

## The concepts covered

| # | Folder | Key | What it does |
|---|--------|-----|--------------|
| 1 | `01-services` | `services` | The unit of Compose — one container spec per service |
| 2 | `02-image` | `image` | Run a prebuilt image pulled from a registry |
| 3 | `03-build` | `build` | Build an image from a Dockerfile (with `args`) |
| 4 | `04-ports` | `ports` | Publish a container port to the host (`HOST:CONTAINER`) |
| 5 | `05-environment` | `environment` | Set env vars in the container (mind the `$$`) |
| 6 | `06-env_file` | `env_file` | Load env vars from a file; the special `.env` |
| 7 | `07-volumes` | `volumes` | Persist & share data — named volumes vs bind mounts |
| 8 | `08-networks` | `networks` | Service-to-service DNS by name; network segmentation |
| 9 | `09-depends_on` | `depends_on` | Startup order + `condition: service_healthy` |
| 10 | `10-healthcheck` | `healthcheck` | Test a service is actually ready, not just running |
| 11 | `11-restart` | `restart` | Restart policies (`unless-stopped`, `on-failure`, …) |
| 12 | `12-command-entrypoint` | `command`/`entrypoint` | Override the image's default command |
| 13 | `13-scale` | `deploy.replicas` | Run many containers of one service |
| 14 | `14-profiles` | `profiles` | Optional services activated on demand |
| 15 | `15-extends-anchors` | `extends` / anchors | Stay DRY — reuse config across services |
| 16 | `16-secrets-configs` | `secrets`/`configs` | Mount sensitive/bulky data as files |
| 99 | `99-all-in-one` | *all* | A realistic 4-service stack using every key feature |

## How to teach with this

For each folder:

```bash
cd 01-services
cat compose.yaml     # read & explain the concept
cat README.md        # notes + commands + expected output
# then run the commands from that README
```

## The Compose command cheat-sheet

```bash
docker compose up            # create & start (foreground)
docker compose up -d         # ...detached (background)
docker compose up --build    # rebuild images first
docker compose ps            # list this project's containers
docker compose logs -f       # follow logs
docker compose exec web sh   # shell into a running service
docker compose run --rm app  # one-off run of a service
docker compose config        # print the fully-resolved config (great for debugging)
docker compose stop          # stop containers (keep them)
docker compose down          # stop & remove containers + networks
docker compose down -v       # ...also remove named volumes
```

## Clean up after the lab

```bash
# from any lesson folder:
docker compose down -v --rmi local

# nuke every lab project at once (from this folder):
for d in */; do (cd "$d" && docker compose down -v 2>/dev/null); done
```

## Compose vs `docker run`

Compose is a **declarative** wrapper over `docker run`. Anything you'd pass on
the command line has a YAML key:

| `docker run` flag | Compose key |
|-------------------|-------------|
| `-e KEY=val` | `environment:` / `env_file:` |
| `-p 8080:80` | `ports:` |
| `-v data:/data` | `volumes:` |
| `--network net` | `networks:` |
| `--restart` | `restart:` |
| `--health-cmd` | `healthcheck:` |
| image + `CMD` | `image:` / `build:` + `command:` |

The win: **many** services, their networks, volumes, and startup order — all in
one version-controlled file, brought up with a single `docker compose up`.
