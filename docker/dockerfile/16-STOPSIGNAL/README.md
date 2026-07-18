# 16 — STOPSIGNAL

## What it does
`STOPSIGNAL` sets the **system signal** Docker sends to your container's main
process to ask it to stop.

## Syntax
```dockerfile
STOPSIGNAL SIGTERM
STOPSIGNAL 15         # by number
```

## Notes
- Default signal is **SIGTERM** (15). If the process doesn't exit within the
  grace period (`docker stop -t`, default 10s), Docker sends **SIGKILL** (9).
- **Exec form matters:** with `ENTRYPOINT ["/app.sh"]` (exec form), your process
  is **PID 1** and receives the signal. With shell form, `/bin/sh` is PID 1 and
  often **swallows** the signal — your app never shuts down cleanly.
- Handle the signal in your app (a `trap`) to flush data, close connections, etc.
- Some images override this (e.g. nginx uses `SIGQUIT` for graceful shutdown).

## Build
```bash
docker build -t lab-stopsignal .
```

## Run (detached — note: NO --rm, so logs survive the stop)
```bash
docker run -d --name lab-stop lab-stopsignal
```

## Stop it and watch the graceful shutdown
```bash
docker stop lab-stop     # returns in ~1s, not ~10s
docker logs lab-stop
docker rm lab-stop       # clean up when done
```

## Expected output
```
App started (PID 1). Waiting... (docker stop me)
Received SIGTERM — shutting down gracefully.
```
The container stops **immediately** (not after the 10s SIGKILL timeout) because
the app handled the signal.

## Try it (see the difference)
Change the ENTRYPOINT to shell form (`ENTRYPOINT /app.sh`), rebuild, and
`docker stop` — it now takes ~10 seconds because the signal is swallowed and
Docker falls back to SIGKILL.
