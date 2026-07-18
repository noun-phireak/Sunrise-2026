# See README.md for full notes.
FROM alpine:3.20

# STOPSIGNAL sets which signal Docker sends to stop the container.
# Default is SIGTERM. Here we demonstrate handling it.
STOPSIGNAL SIGTERM

# A tiny app that catches SIGTERM and exits cleanly.
# NOTE: exec form + a real signal handler = graceful shutdown.
COPY app.sh /app.sh
RUN chmod +x /app.sh

ENTRYPOINT ["/app.sh"]
