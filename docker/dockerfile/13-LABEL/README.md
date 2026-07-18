# 13 — LABEL

## What it does
`LABEL` adds **metadata** to your image as key=value pairs — author, version,
description, source repo, etc.

## Syntax
```dockerfile
LABEL key="value"
LABEL key1="v1" key2="v2"     # multiple in one line = one layer
```

## Notes
- Labels are the modern replacement for the deprecated `MAINTAINER` (see `18`).
- There's a standard set of keys — the **OCI image spec** — worth using:
  - `org.opencontainers.image.title`
  - `org.opencontainers.image.version`
  - `org.opencontainers.image.description`
  - `org.opencontainers.image.source` (repo URL)
- Combine labels into one `LABEL` line to avoid extra layers.
- Read them back with `docker inspect` or filter images by label.

## Build
```bash
docker build -t lab-label .
```

## View the labels
```bash
docker inspect --format '{{json .Config.Labels}}' lab-label
```

## Expected output
```json
{"maintainer":"phireaknoun@gmail.com","org.opencontainers.image.title":"Dockerfile Lab","org.opencontainers.image.version":"1.0","org.opencontainers.image.description":"Teaching every Dockerfile instruction"}
```

## Try it
```bash
# Filter images by a label:
docker images --filter "label=org.opencontainers.image.version=1.0"
```
