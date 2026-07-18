# 01 — FROM

## What it does
`FROM` sets the **base image** your image is built on top of. Every Dockerfile
must begin with `FROM` (the only thing allowed before it is `ARG`).

## Syntax
```dockerfile
FROM <image>[:<tag>] [AS <name>]
```

## Notes
- The **tag** (`:3.20`) pins a version. **Always pin a tag** — never rely on the
  moving `:latest`, or your builds stop being reproducible.
- `alpine` is a tiny (~5 MB) Linux distro, perfect for labs.
- `AS <name>` names a build stage — used later in multi-stage builds (see `19-`).
- You can have multiple `FROM` lines in one file (multi-stage builds).
- Docker downloads the base image from a registry (Docker Hub by default) the
  first time, then caches it locally.

## Build
```bash
docker build -t lab-from .
```

## Run
```bash
docker run --rm lab-from
```

## Expected output
```
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.20.x
PRETTY_NAME="Alpine Linux v3.20"
...
```

## Try it
- Change `alpine:3.20` to `ubuntu:22.04`, rebuild, and see the output change.
- Remove the tag entirely (`FROM alpine`) and note it defaults to `:latest`.
