# 07 — ARG

## What it does
`ARG` defines a **build-time variable** you can pass with `--build-arg`. Unlike
`ENV`, an `ARG` does **not** persist into the running container.

## Syntax
```dockerfile
ARG NAME[=default]
```

## Notes
- Pass a value at build time:
  ```bash
  docker build --build-arg BUILD_USER=phireak -t lab-arg .
  ```
- `ARG` **does not persist** to run time. To keep a value, assign it to an `ENV`:
  ```dockerfile
  ARG APP_VERSION
  ENV APP_VERSION=${APP_VERSION}
  ```
- An `ARG` declared **before** `FROM` can be used in the `FROM` line itself
  (e.g. `ARG TAG=3.20` then `FROM alpine:${TAG}`), but is out of scope after
  `FROM` unless re-declared.
- `ARG` vs `ENV`: **ARG = build only**, **ENV = build + run**.
- Don't use `ARG`/`ENV` for secrets — values are visible in `docker history`.
  Use BuildKit secrets (`RUN --mount=type=secret`) instead.

## Build (with default)
```bash
docker build -t lab-arg .
```

## Build (overriding args)
```bash
docker build --build-arg BUILD_USER=phireak --build-arg APP_VERSION=2.5 -t lab-arg .
```

## Run
```bash
docker run --rm lab-arg
```

## Expected output (with overrides above)
```
Built by phireak, version 2.5
Runtime APP_VERSION=2.5
```

## Try it
Run `env` inside a container built WITHOUT copying ARG→ENV and confirm the ARG is
not present at run time.
