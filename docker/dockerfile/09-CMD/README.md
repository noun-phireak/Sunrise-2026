# 09 — CMD

## What it does
`CMD` sets the **default command/arguments** run when the container starts. It is
easily **overridden** by arguments you pass to `docker run`.

## Syntax
```dockerfile
CMD ["executable", "arg1", "arg2"]   # exec form (preferred)
CMD ["arg1", "arg2"]                 # default args FOR an ENTRYPOINT
CMD command arg1 arg2                # shell form: /bin/sh -c "..."
```

## Notes
- **Only the last `CMD`** in the Dockerfile is used.
- `CMD` is **overridden** whenever you supply a command on `docker run`:
  ```bash
  docker run --rm lab-cmd echo "overridden!"
  ```
- Difference from `RUN`: `RUN` runs at **build** time; `CMD` runs at
  **container start** time.
- Difference from `ENTRYPOINT`: `CMD` is a default that's easy to replace;
  `ENTRYPOINT` is the fixed executable (see `10`). Often used together:
  `ENTRYPOINT` = the program, `CMD` = its default arguments.
- Prefer **exec form** so signals reach your process (see `16-STOPSIGNAL`).

## Build
```bash
docker build -t lab-cmd .
```

## Run (default)
```bash
docker run --rm lab-cmd
```

## Expected output
```
Hello from the default CMD
```

## Run (override)
```bash
docker run --rm lab-cmd echo "overridden!"
```
Output:
```
overridden!
```
