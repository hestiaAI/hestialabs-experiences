#!/usr/bin/env bash
# Build digipower.academy and push the static site to the netlify-academy branch.
# Netlify serves the committed experiences/dist as is (see netlify.toml).
# Steps and caveats: experiences/README.md, section "Deployment".
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [[ "$(git branch --show-current)" != netlify-academy ]]; then
  echo "Run this on the netlify-academy branch, after merging master into it." >&2
  exit 1
fi

# The experiences listed in config/digipower-academy.json are linked from this
# monorepo, so they need not be published to npm for the site itself.
export CONFIG_NAME=digipower-academy
scripts/setup.sh --site

cd experiences
rm -rf dist
BASE_URL=https://digipower.academy API_URL=https://bubbles.hestialabs.org npm run build

git add dist
git commit -m rebuilt
git push
