# See README.md for full notes.
FROM alpine:3.20

# ENV sets environment variables that PERSIST into the running container.
ENV APP_NAME="Sunrise Demo"
ENV APP_VERSION=1.0 \
    GREETING="Hello student"

# ENV values are usable in later instructions too:
WORKDIR /$APP_NAME

CMD ["sh", "-c", "echo \"$GREETING — running $APP_NAME v$APP_VERSION in $(pwd)\""]
