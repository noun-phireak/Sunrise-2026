# 10 — ENTRYPOINT

## What it does
`ENTRYPOINT` sets the executable that **always runs** when the container starts.
Combined with `CMD`, `ENTRYPOINT` is the program and `CMD` is its default args.

## Syntax
```dockerfile
ENTRYPOINT ["executable", "arg"]   # exec form (preferred)
ENTRYPOINT command arg             # shell form
```

## How ENTRYPOINT + CMD combine
With `ENTRYPOINT ["echo", "Hello,"]` and `CMD ["world"]`:

| Command | Runs |
|---------|------|
| `docker run img` | `echo Hello, world` |
| `docker run img there` | `echo Hello, there` |
| `docker run img a b c` | `echo Hello, a b c` |

The `docker run` args **replace CMD** but keep the ENTRYPOINT.

## Notes
- Makes an image behave like a single command / tool (e.g. a CLI).
- To replace the ENTRYPOINT itself, use `--entrypoint`:
  ```bash
  docker run --rm --entrypoint ls lab-entrypoint -l /
  ```
- Prefer **exec form**. Shell-form ENTRYPOINT swallows CMD and blocks signals.
- Common pattern: `ENTRYPOINT ["docker-entrypoint.sh"]` — a startup script that
  sets things up then `exec "$@"` to run the CMD.

## Build
```bash
docker build -t lab-entrypoint .
```

## Run (default)
```bash
docker run --rm lab-entrypoint
```
Output:
```
Hello, world
```

## Run (override the CMD args only)
```bash
docker run --rm lab-entrypoint students
```
Output:
```
Hello, students
```
