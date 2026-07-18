# 05 — RUN

## What it does
`RUN` executes a command **at build time**, inside a new layer, and commits the
result. Use it to install packages, compile code, create files, etc.

## Syntax
```dockerfile
RUN <command>                       # shell form: /bin/sh -c "<command>"
RUN ["executable", "arg1", "arg2"]  # exec form: no shell
```

## Notes
- **Build time vs run time:** `RUN` happens when you `docker build`. `CMD`/
  `ENTRYPOINT` happen when you `docker run`. Don't confuse them.
- **Each `RUN` = one layer.** Chain related commands with `&&` and clean up in the
  same `RUN` to keep the image small:
  ```dockerfile
  RUN apk add --no-cache curl && curl --version && rm -rf /var/cache/apk/*
  ```
- `--no-cache` (apk) / `rm -rf /var/lib/apt/lists/*` (apt) avoid shipping package
  caches.
- Shell form supports variables & `&&`; exec form does not (no shell involved).
- Docker **caches** each `RUN`. If nothing above changed, it reuses the cache.
  Change an earlier line and everything below rebuilds.

## Build
```bash
docker build -t lab-run .
```

## Run
```bash
docker run --rm lab-run
```

## Expected output
```
Building the image...
curl 8.x.x ...
done
```

## Try it
```bash
# Rebuild without cache to force every RUN to re-execute:
docker build --no-cache -t lab-run .
```
