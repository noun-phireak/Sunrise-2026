# See README.md for full notes.
FROM alpine:3.20
WORKDIR /www

RUN echo "<h1>Healthy!</h1>" > index.html
# wget is built into busybox; httpd needs busybox-extras
RUN apk add --no-cache busybox-extras

EXPOSE 80

# HEALTHCHECK tells Docker how to test that the container is working.
# --interval: how often to check   --timeout: max time per check
# --start-period: grace time on startup   --retries: fails before "unhealthy"
HEALTHCHECK --interval=5s --timeout=3s --start-period=2s --retries=3 \
    CMD wget -q -O /dev/null http://localhost:80/ || exit 1

CMD ["httpd", "-f", "-p", "80", "-h", "/www"]
