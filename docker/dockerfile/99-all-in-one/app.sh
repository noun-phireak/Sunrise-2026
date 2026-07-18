#!/bin/sh
# Graceful shutdown handler (see STOPSIGNAL).
trap 'echo "Shutting down gracefully..."; exit 0' TERM

echo "=============================================="
echo " $APP_NAME v$APP_VERSION"
echo " Running as user: $(id -un)"
echo " Working dir:     $(pwd)"
echo " Serving:         http://localhost:$PORT"
echo "=============================================="

# Start the web server in the foreground.
exec httpd -f -p "$PORT" -h /www
