# See README.md for full notes.
FROM alpine:3.20

# RUN executes a command at BUILD time and commits the result as a new layer.

# Shell form: runs via /bin/sh -c "..."
RUN echo "Building the image..." > /build.log

# Chain commands with && and clean up in the SAME RUN to keep layers small.
RUN apk add --no-cache curl \
    && curl --version | head -n 1 >> /build.log

# Exec form: no shell, so no variable expansion or && (JSON array)
RUN ["/bin/sh", "-c", "echo done >> /build.log"]

CMD ["cat", "/build.log"]
