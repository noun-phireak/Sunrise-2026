# 99 — All-in-one

## What it does
A single **realistic** Dockerfile that combines the key instructions from the
whole lab into one working web-server image. Use it as the capstone / summary.

## Instructions used
`ARG` (before & after FROM) · `FROM` · `LABEL` · `ENV` · `WORKDIR` · `RUN` ·
`COPY` · `USER` · `EXPOSE` · `VOLUME` · `HEALTHCHECK` · `STOPSIGNAL` ·
`ENTRYPOINT` (+ `CMD` concept).

## Build
```bash
docker build -t lab-all .
```

## Build with a custom version (ARG)
```bash
docker build --build-arg APP_VERSION=2.0 -t lab-all .
```

## Run
```bash
docker run --rm -d -p 8080:8080 -v lab-all-data:/data --name lab-all lab-all
```

## Test it
```bash
docker logs lab-all          # see the startup banner
curl http://localhost:8080   # see the HTML page
docker ps                    # STATUS eventually shows (healthy)
```

## Expected log output
```
==============================================
 Sunrise Container v1.0
 Running as user: app
 Working dir:     /www
 Serving:         http://localhost:8080
==============================================
```

## Graceful stop (STOPSIGNAL)
```bash
docker stop lab-all
docker logs lab-all          # ends with "Shutting down gracefully..."
```

## Clean up
```bash
docker rm -f lab-all
docker volume rm lab-all-data
```
