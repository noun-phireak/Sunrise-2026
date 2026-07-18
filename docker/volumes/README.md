# Docker Volumes & Mounts — Fundamentals Lab

A hands-on lab on **how containers store data** — taught with plain `docker`
commands, **before** you ever write a Dockerfile. One folder per mount type,
each with a `README.md`: what it is, the exact commands, and the expected output.

> A container's own filesystem is **temporary** — delete the container and its
> writes are gone. **Mounts** are how data lives somewhere it can survive or be
> shared. This lab shows the three kinds and how they differ.

## Requirements
- Docker installed (`docker --version`) — tested on Docker 29.x
- A terminal

## The three mount types (this is the whole point)

| Type | Where the data lives | Survives container delete? | Edit from host? | Use it for |
|------|----------------------|:---:|:---:|-----------|
| **Named volume** | Docker-managed area | ✅ yes | ✗ no (Docker owns it) | databases, app data |
| **Bind mount** | a folder **on your host** | ✅ (it's your file) | ✅ yes, live | dev code, config |
| **tmpfs** | host **RAM** | ❌ no — vanishes | ✗ no | scratch, secrets |

Everything else below is a variation on these three.

## The lessons

| # | Folder | Concept | One-liner |
|---|--------|---------|-----------|
| 1 | `01-named-volume` | Named volume | Docker-managed storage that **persists** |
| 2 | `02-anonymous-volume` | Anonymous volume | A volume with no name — usually **junk to avoid** |
| 3 | `03-bind-mount` | Bind mount | Map a **host folder** in — live edits, no rebuild |
| 4 | `04-tmpfs` | tmpfs | **In-memory**, ephemeral scratch space |
| 5 | `05-read-only` | Read-only | `:ro` mounts & `--read-only` root for hardening |
| 6 | `06-share-between-containers` | Sharing | One volume, **two containers**, shared files |
| 99 | `99-all-in-one` | All three | One container using volume + bind + tmpfs together |

## How to teach with this
```bash
cd 01-named-volume
cat README.md          # notes + commands + expected output
# run the commands, watch the data behave
```
Best teaching move: run `01` (named volume) and `04` (tmpfs) back to back — the
named volume **remembers**, the tmpfs **forgets**. That contrast is the lesson.

## `-v` vs `--mount`

Two syntaxes do the same job:

```bash
-v app-data:/data                                    # short, terse
--mount type=volume,src=app-data,dst=/data           # explicit, self-documenting
```

`--mount` spells out the **type** (`volume` / `bind` / `tmpfs`), which is why
it's great for teaching. `-v` is what you'll see most in the wild.

## Clean up after the lab
```bash
docker volume prune                 # remove unused volumes
docker rm -f $(docker ps -aq) 2>/dev/null   # remove leftover lab containers
```

## Where this fits
`docker run` basics → **this (volumes)** → **networking** → Dockerfile → Compose.
Data (volumes) and connectivity (networking) are the two things a container
needs from the outside world — learn them before building images.
