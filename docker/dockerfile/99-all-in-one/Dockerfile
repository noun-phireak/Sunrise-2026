# ==========================================================================
#  ALL-IN-ONE: a realistic Dockerfile using every key instruction.
#  Read each comment — this is the summary of the whole lab.
# ==========================================================================

# ARG before FROM: lets us parameterise the base image tag.
ARG ALPINE_TAG=3.20

# FROM: the base image.
FROM alpine:${ALPINE_TAG}

# LABEL: metadata about the image.
LABEL org.opencontainers.image.title="All-in-one Dockerfile Lab" \
      org.opencontainers.image.version="1.0" \
      maintainer="phireaknoun@gmail.com"

# ARG (build time) -> ENV (run time). APP_VERSION is passable at build.
ARG APP_VERSION=1.0
ENV APP_NAME="Sunrise Container" \
    APP_VERSION=${APP_VERSION} \
    PORT=8080

# WORKDIR: create & switch into /www (also our web root).
WORKDIR /www

# RUN: install what we need, in one layer, no cache left behind.
# busybox-extras provides the httpd applet; wget is already in busybox.
RUN apk add --no-cache busybox-extras

# COPY: bring our files from the build context into the image.
COPY index.html /www/index.html
COPY app.sh /usr/local/bin/app.sh
RUN chmod +x /usr/local/bin/app.sh

# USER: create and switch to a non-root user for security.
RUN addgroup -S app && adduser -S app -G app
USER app

# EXPOSE: document the port the app listens on.
EXPOSE 8080

# VOLUME: declare a mount point for persistent data.
VOLUME ["/data"]

# HEALTHCHECK: how Docker tests the container is alive.
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
    CMD wget -q -O /dev/null http://localhost:8080/ || exit 1

# STOPSIGNAL: signal used to stop the container (app.sh traps it).
STOPSIGNAL SIGTERM

# ENTRYPOINT + CMD: ENTRYPOINT is the fixed startup script;
# CMD could supply default args (kept empty here for simplicity).
ENTRYPOINT ["/usr/local/bin/app.sh"]
