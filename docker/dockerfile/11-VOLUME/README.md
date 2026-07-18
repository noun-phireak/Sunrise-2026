# 11 — VOLUME

## What it does
`VOLUME` declares a **mount point** whose data lives outside the container's
writable layer — used for data that must **persist** or be **shared**.

## Syntax
```dockerfile
VOLUME ["/data"]
VOLUME /var/lib/mysql
```

## Notes
- Data in a volume **survives** even after the container is removed.
- If you don't attach a named volume, Docker creates an **anonymous** volume.
- Good for databases, uploads, logs — anything that shouldn't die with the container.
- **Gotcha:** any data you `COPY`/`RUN` into the volume path *after* the `VOLUME`
  line may be lost, because the volume is mounted over it. Put files there before
  declaring the VOLUME, or use a bind mount.
- You can attach volumes at run time without a `VOLUME` line too — the instruction
  just documents the intent and forces a volume by default.

## Build
```bash
docker build -t lab-volume .
```

## Run with a NAMED volume (persists across runs)
```bash
docker run --rm -v lab-data:/data lab-volume
docker run --rm -v lab-data:/data lab-volume
```
The second run shows **two** timestamps — proof the data persisted.

## Expected output (second run)
```
--- /data/log.txt ---
Sat Jul 18 ... 2026
Sat Jul 18 ... 2026
```

## Inspect / clean up
```bash
docker volume ls
docker volume inspect lab-data
docker volume rm lab-data
```
