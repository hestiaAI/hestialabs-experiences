#!/usr/bin/env bash
# One-command setup. Safe to re-run.
#   scripts/setup.sh          packages + data-experience (enough for `scripts/test.sh`)
#   scripts/setup.sh --site   also dc-dashboard, the data-experience library and the Nuxt site
#   scripts/setup.sh --all    also the bubble server, if checked out next to this repo
#   scripts/setup.sh --clean  reinstall dependencies even if the lockfiles haven't changed
# A folder's `npm ci` is skipped when its lockfile and the Node version are the
# same as at its last install, and a build is skipped when no source file in the
# folder changed since its last build (stamps in node_modules/.setup-*).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUBBLE_SERVER_DIR="$ROOT_DIR/../hestialabs-bubble-server"
SITE=false
BUBBLE=false
CLEAN=false
for arg in "$@"; do
  case "$arg" in
    --site) SITE=true ;;
    --all) SITE=true; BUBBLE=true ;;
    --clean) CLEAN=true ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

step() { echo; echo "==> $*"; }
npm_ci() {
  local stamp="node_modules/.setup-stamp" want
  want="$(node -v) ${CONFIG_NAME:-dev} $(sha256sum package-lock.json | cut -d' ' -f1)"
  if ! $CLEAN && [[ -f "$stamp" && "$(cat "$stamp")" == "$want" ]]; then
    echo "(dependencies unchanged since the last install; skipping npm ci, use --clean to force)"
    return
  fi
  npm ci --no-audit --no-fund --loglevel=error
  echo "$want" > "$stamp"
}

# build_if_changed <command...>: run a build unless the folder's tracked and
# untracked source files (dist excluded) are the same as at the last build.
build_if_changed() {
  local stamp="node_modules/.setup-build-stamp" want
  want="$(git ls-files -co --exclude-standard -z -- . ':!:dist' ':!:**/dist/**' \
    | xargs -0 sha256sum | sha256sum | cut -d' ' -f1)"
  if ! $CLEAN && [[ -f "$stamp" && "$(cat "$stamp")" == "$want" ]]; then
    echo "(sources unchanged since the last build; skipping, use --clean to force)"
    return
  fi
  "$@"
  echo "$want" > "$stamp"
}

required_major="$(cat "$ROOT_DIR/.nvmrc")"
if [[ "$(node -p 'process.versions.node.split(".")[0]')" -lt "$required_major" ]]; then
  echo "Node $required_major or later is required (found $(node -v)); run 'nvm install && nvm use'." >&2
  exit 1
fi

step "packages: install and build"
cd "$ROOT_DIR/packages" && npm_ci && build_if_changed npx webpack --mode=production --stats=errors-warnings

step "data-experience: install"
cd "$ROOT_DIR/data-experience" && npm_ci

if $SITE; then
  step "dc-dashboard: install and build"
  cd "$ROOT_DIR/dc-dashboard" && npm_ci && build_if_changed npm run build --silent
  step "data-experience: build library"
  cd "$ROOT_DIR/data-experience" && build_if_changed npm run build --silent
  step "experiences: install (links the experiences listed in config/${CONFIG_NAME:-dev}.json)"
  cd "$ROOT_DIR/experiences" && npm_ci
fi

if $BUBBLE; then
  if [[ -d "$BUBBLE_SERVER_DIR" ]]; then
    step "bubble server: poetry install"
    cd "$BUBBLE_SERVER_DIR" && poetry install --no-root
  else
    echo "Bubble server not found at $BUBBLE_SERVER_DIR; skipping" >&2
  fi
fi

echo; echo "Setup complete."
