#!/bin/sh
# Graceful shutdown handler (see STOPSIGNAL in the Dockerfile lab).
trap 'echo "Shutting down gracefully..."; exit 0' TERM

echo "=============================================="
echo " $APP_NAME v$APP_VERSION (api)"
echo " DB host:    $DB_HOST"
echo " Redis host: $REDIS_HOST"
echo " DB secret:  $(cat /run/secrets/db_password 2>/dev/null | sed 's/./*/g')"
echo " Serving:    http://localhost:$PORT"
echo "=============================================="

# Start the web server in the foreground.
exec httpd -f -p "$PORT" -h /www
