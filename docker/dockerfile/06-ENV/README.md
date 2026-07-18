# 06 — ENV

## What it does
`ENV` sets **environment variables** that exist during build **and persist into
the running container**.

## Syntax
```dockerfile
ENV KEY=value
ENV KEY1=value1 KEY2=value2      # multiple in one line
```

## Notes
- Values **persist at run time** — this is the key difference from `ARG` (see `07`).
- Reference them later with `$KEY` or `${KEY}`.
- Override at run time with `-e`:
  ```bash
  docker run --rm -e GREETING="Hi" lab-env
  ```
- Great for configuration (ports, paths, feature flags).
- **Do not** put secrets (passwords, API keys) in `ENV` — they are baked into the
  image and visible via `docker history` / `docker inspect`.

## Build
```bash
docker build -t lab-env .
```

## Run
```bash
docker run --rm lab-env
```

## Expected output
```
Hello student — running Sunrise Demo v1.0 in /Sunrise Demo
```

## Try it
```bash
# See all env vars baked in:
docker run --rm lab-env env
# Override one at run time:
docker run --rm -e GREETING="Good morning" lab-env
```
