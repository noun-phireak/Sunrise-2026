# 19 — Multi-stage builds (`COPY --from`)

## What it does
A **multi-stage build** uses several `FROM` lines. Each `FROM` starts a new stage.
`COPY --from=<stage>` pulls artifacts from an earlier stage into a later one — so
your **final image contains only what it needs to run**, not the whole build
toolchain.

## Key instructions
```dockerfile
FROM <image> AS builder      # name a stage
COPY --from=builder /src/app /app/app   # copy from that stage
COPY --from=nginx:latest /etc/nginx/nginx.conf .  # or from any external image
```

## Notes
- The classic use: **compile in a fat image, ship in a slim one.** No compilers,
  headers, or source code in the final image → smaller and more secure.
- Stages can be referenced by name (`AS builder`) or index (`--from=0`).
- Build a specific stage only with `--target`:
  ```bash
  docker build --target builder -t lab-multistage-builder .
  ```
- Anything not `COPY`ed out of a stage is discarded — build caches, temp files,
  secrets used during build all stay behind.

## Build
```bash
docker build -t lab-multistage .
```

## Run
```bash
docker run --rm lab-multistage
```

## Expected output
```
Hello from a statically-compiled binary in a multi-stage build!
```

## Prove the final image is clean & small
```bash
# gcc is NOT in the final image:
docker run --rm lab-multistage which gcc || echo "no gcc — good!"

# Compare it to the builder stage size:
docker build --target builder -t lab-multistage-builder .
docker images "lab-multistage*"
```
The final image is much smaller than the builder because it dropped the toolchain.
