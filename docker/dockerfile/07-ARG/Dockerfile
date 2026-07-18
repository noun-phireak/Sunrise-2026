# See README.md for full notes.
FROM alpine:3.20

# ARG defines a BUILD-TIME variable. It does NOT persist into the container.
ARG BUILD_USER=anonymous
ARG APP_VERSION=0.0.1

# Use ARG values during the build:
RUN echo "Built by ${BUILD_USER}, version ${APP_VERSION}" > /build-info.txt

# To make an ARG survive into run time, copy it into an ENV:
ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION}

CMD ["sh", "-c", "cat /build-info.txt && echo \"Runtime APP_VERSION=$APP_VERSION\""]
