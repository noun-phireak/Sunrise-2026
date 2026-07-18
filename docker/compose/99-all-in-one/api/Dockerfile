# A tiny built-from-source API image (mirrors the Dockerfile lab).
FROM alpine:3.20
ARG APP_VERSION=1.0
ENV APP_VERSION=${APP_VERSION} \
    PORT=8080
WORKDIR /www
RUN apk add --no-cache busybox-extras
COPY index.html /www/index.html
COPY app.sh /usr/local/bin/app.sh
RUN chmod +x /usr/local/bin/app.sh
EXPOSE 8080
STOPSIGNAL SIGTERM
ENTRYPOINT ["/usr/local/bin/app.sh"]
