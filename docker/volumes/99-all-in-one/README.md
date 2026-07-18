# 99 — All-in-one (all three mount types at once)

## What it does
One container using **every mount type** the way real apps do — so students can
see them side by side:

| Mount | Type | Purpose | Survives stop? |
|-------|------|---------|:---:|
| `/data`   | **named volume** | persistent app data | ✅ yes |
| `/etc/app`| **bind mount (ro)** | host-supplied config | ✅ (it's the host's) |
| `/scratch`| **tmpfs** | in-memory scratch | ❌ gone |

## Run
```bash
cd 99-all-in-one
docker volume create app-data

docker run --rm \
  -v app-data:/data \
  -v "$(pwd)/config:/etc/app:ro" \
  --tmpfs /scratch \
  alpine sh -c '
    echo "persisted at $(date)" >> /data/history.txt
    echo "=== /data (named volume, persists) ===";  cat /data/history.txt
    echo "=== /etc/app (bind mount, from host) ==="; cat /etc/app/app.conf
    echo "=== /scratch (tmpfs, in RAM) ===";         echo temp > /scratch/x; ls /scratch'
```

## Expected output
```
=== /data (named volume, persists) ===
persisted at Sat Jul 18 ... 2026
=== /etc/app (bind mount, from host) ===
# Config injected via a read-only BIND mount — edit on the host, no rebuild.
app_name = Sunrise
log_level = info
=== /scratch (tmpfs, in RAM) ===
x
```

## The lesson
Run it **twice**: `/data/history.txt` grows each run (**named volume persists**),
`/etc/app` always reflects the host file (**bind mount**), and `/scratch` starts
empty every time (**tmpfs is ephemeral**).

## Clean up
```bash
docker volume rm app-data
```
