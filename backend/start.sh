#!/usr/bin/env bash
set -e

# QuoteSnap backend start script for Render / production hosts
# Uses PORT env var if set, otherwise defaults to 8341
# Binds to 0.0.0.0 so the host can route traffic in

export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-8341}"

exec uvicorn main:app --host "$HOST" --port "$PORT"
