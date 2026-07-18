# 17 — SHELL

## What it does
`SHELL` changes the **default shell** used by the *shell form* of `RUN`, `CMD`,
and `ENTRYPOINT`.

## Syntax
```dockerfile
SHELL ["executable", "parameters"]
```

## Notes
- Default on Linux is `["/bin/sh", "-c"]`. On Windows it's `["cmd", "/S", "/C"]`.
- Common use: switch to `bash` for bash-only features, or add strict flags:
  - `-e` exit on error, `-u` error on unset var, `-x` print each command,
    `-o pipefail` (bash) fail if any part of a pipe fails.
  ```dockerfile
  SHELL ["/bin/bash", "-euo", "pipefail", "-c"]
  ```
- Applies to every shell-form instruction **after** the `SHELL` line.
- Only affects **shell form** — exec form (`RUN ["a","b"]`) never uses a shell.

## Build
```bash
docker build -t lab-shell .
```
Because of `-x`, you'll see the command echoed in the build output:
```
+ echo This RUN uses the custom SHELL
```

## Run
```bash
docker run --rm lab-shell
```

## Expected output
```
This RUN uses the custom SHELL
```

## Try it
Switch to `SHELL ["/bin/bash", "-c"]` — but note plain `alpine` has no bash, so
you'd first `RUN apk add --no-cache bash` (before the SHELL change).
