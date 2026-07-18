# 12 — USER

## What it does
`USER` sets the user (and optionally group) that subsequent `RUN`, `CMD`, and
`ENTRYPOINT` instructions run as.

## Syntax
```dockerfile
USER <user>[:<group>]
USER <uid>[:<gid>]
```

## Notes
- **Security best practice:** don't run containers as `root`. Create a dedicated
  user and switch to it.
- The user must **exist** — create it first (`adduser`/`useradd`) before `USER`.
- Instructions before `USER` still run as root (needed to install packages,
  create the user, etc.).
- Combine with `COPY --chown=appuser:appgroup ...` so files are owned correctly.
- Override at run time with `docker run --user`.

## Build
```bash
docker build -t lab-user .
```

## Run
```bash
docker run --rm lab-user
```

## Expected output
```
uid=100(appuser) gid=101(appgroup) groups=101(appgroup)
```
(Not `uid=0(root)` — that's the point.)

## Try it
```bash
# Confirm root by overriding the user at run time:
docker run --rm --user root lab-user     # -> uid=0(root)
```
