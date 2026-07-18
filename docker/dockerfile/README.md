# Dockerfile Instructions — Complete Teaching Lab

A hands-on lab with **one folder per Dockerfile instruction**. Each folder is
self-contained: a `Dockerfile`, any files it needs, and a `README.md` that
explains the instruction, gives the exact `build` / `run` commands, and shows
the **expected output**.

> Built for teaching. Go folder by folder in order — each one adds a new concept.

## Requirements

- Docker installed (`docker --version`) — tested on Docker 29.x
- A terminal

## The instructions covered

| # | Folder | Instruction | What it does |
|---|--------|-------------|--------------|
| 1 | `01-FROM` | `FROM` | Sets the base image — every Dockerfile starts here |
| 2 | `02-WORKDIR` | `WORKDIR` | Sets the working directory for later instructions |
| 3 | `03-COPY` | `COPY` | Copies files from build context into the image |
| 4 | `04-ADD` | `ADD` | Like COPY, but also unpacks archives & fetches URLs |
| 5 | `05-RUN` | `RUN` | Executes a command at **build** time (creates a layer) |
| 6 | `06-ENV` | `ENV` | Sets environment variables (persist at run time) |
| 7 | `07-ARG` | `ARG` | Build-time variables (do **not** persist at run time) |
| 8 | `08-EXPOSE` | `EXPOSE` | Documents which ports the container listens on |
| 9 | `09-CMD` | `CMD` | Default command/args when the container **runs** |
| 10 | `10-ENTRYPOINT` | `ENTRYPOINT` | The executable that always runs; CMD becomes its args |
| 11 | `11-VOLUME` | `VOLUME` | Declares a mount point for persistent/shared data |
| 12 | `12-USER` | `USER` | Sets the user that RUN/CMD/ENTRYPOINT run as |
| 13 | `13-LABEL` | `LABEL` | Adds metadata (key=value) to the image |
| 14 | `14-HEALTHCHECK` | `HEALTHCHECK` | Tells Docker how to test the container is healthy |
| 15 | `15-SHELL` | `SHELL` | Changes the default shell for shell-form commands |
| 16 | `16-MAINTAINER` | `MAINTAINER` | **Deprecated** — use LABEL instead (shown for history) |
| 17 | `17-multistage-COPY-from` | `COPY --from` | Multi-stage builds — copy artifacts between stages |
| 99 | `99-all-in-one` | *all* | One realistic Dockerfile using every key instruction |

## How to teach with this

For each folder:

```bash
cd 01-FROM
cat Dockerfile        # read & explain the instruction
cat README.md         # notes + commands + expected output
# then run the build/run commands from that README
```

## Clean up after the lab

```bash
# remove all images built during the lab (they are tagged lab-*)
docker rmi -f $(docker images 'lab-*' -q) 2>/dev/null
# remove stopped lab containers
docker rm -f $(docker ps -aq --filter 'name=lab-') 2>/dev/null
```

## Quick reference: shell form vs exec form

Many instructions (`RUN`, `CMD`, `ENTRYPOINT`) accept two forms:

- **Shell form**: `RUN apt-get update` → runs via `/bin/sh -c`
- **Exec form**: `RUN ["apt-get", "update"]` → runs the binary directly (JSON array, no shell)

Prefer **exec form** for `CMD`/`ENTRYPOINT` so signals (like Ctrl-C / SIGTERM)
reach your process correctly.
