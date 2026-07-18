#!/bin/sh
# Trap SIGTERM so we can shut down gracefully.
trap 'echo "Received SIGTERM — shutting down gracefully."; exit 0' TERM

echo "App started (PID $$). Waiting... (docker stop me)"
# Keep running until a signal arrives.
while true; do
  sleep 1
done
