#!/usr/bin/env bash
# Compares every tab of the experiences listed in data-experience/e2e/visual/experiences.spec.js
# with the committed screenshots.
#
# The screenshots are taken in the official Playwright Docker image, at the @playwright/test version
# in data-experience/package-lock.json, so they are the same on every machine and in CI.
# The dev app (port 8080) runs on this machine; it is started if it isn't already running.
#
# Needs: npm run setup (packages built, data-experience installed) and Docker.
#
#   scripts/visual-tests.sh                       compare with the committed screenshots
#   scripts/visual-tests.sh --update-snapshots    replace them (explain the change in the PR)
#   scripts/visual-tests.sh -g tracker-control    any other Playwright option
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DE="$ROOT/data-experience"
PORT=8080
VERSION="$(node -p "require('$DE/node_modules/@playwright/test/package.json').version")"
IMAGE="mcr.microsoft.com/playwright:v$VERSION-focal"

server_pid=""
cleanup() {
  if [ -n "$server_pid" ]; then
    # the dev app runs in its own process group: stop npx and the server it started
    kill -- "-$server_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT

if ! curl -sf -o /dev/null "http://localhost:$PORT/"; then
  echo "Starting the dev app on port $PORT…"
  (cd "$DE" && exec setsid npx vue-cli-service serve ./dev/main.js --port "$PORT" > "$DE/visual-dev-app.log" 2>&1) &
  server_pid=$!
  for _ in $(seq 1 180); do
    curl -sf -o /dev/null "http://localhost:$PORT/" && break
    if ! kill -0 "$server_pid" 2>/dev/null; then
      echo "The dev app stopped; see data-experience/visual-dev-app.log" >&2
      exit 1
    fi
    sleep 2
  done
fi

docker run --rm --network host --ipc host \
  --user "$(id -u):$(id -g)" -e HOME=/tmp -e CI="${CI:-}" \
  -v "$ROOT:$ROOT" -w "$DE" \
  "$IMAGE" \
  npx playwright test -c playwright.visual.config.js "$@"
