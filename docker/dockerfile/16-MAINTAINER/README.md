# 18 — MAINTAINER (deprecated)

## What it does
`MAINTAINER` set the **author** of the image. It is **deprecated** — shown here
only so students recognize it in older Dockerfiles.

## Syntax (old)
```dockerfile
MAINTAINER Your Name <you@example.com>
```

## The modern replacement
```dockerfile
LABEL maintainer="you@example.com"
```

## Notes
- Deprecated since Docker 1.13 (2017). It still works but prints a warning.
- `LABEL maintainer=...` is more flexible — it's just one of many metadata labels
  and shows up in `docker inspect` alongside the rest.
- If you maintain old images, migrate `MAINTAINER` → `LABEL maintainer`.

## Build
```bash
docker build -t lab-maintainer .
```
You'll see a deprecation notice like:
```
[WARNING]: MAINTAINER instruction is deprecated in favor of LABEL maintainer=
```

## Run
```bash
docker run --rm lab-maintainer
```

## Expected output
```
MAINTAINER is deprecated — use LABEL maintainer= instead.
```

## Verify the label
```bash
docker inspect --format '{{index .Config.Labels "maintainer"}}' lab-maintainer
```
