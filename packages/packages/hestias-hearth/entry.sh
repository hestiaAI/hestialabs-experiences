#!/usr/bin/env bash

# https://stackoverflow.com/questions/68111434/how-to-run-node-js-cli-with-experimental-specifier-resolution-node

# first attempt:
# /usr/bin/env node --experimental-specifier-resolution=node $(dirname $0)/index.mjs "$@"

# second attempt:
# inspired by https://github.com/21RISK/yargs-autocomplete/blob/main/test-cli.sh
dir_path="$(dirname $(realpath "$0"))" || "$(python -c 'import os, sys; print(os.path.dirname(os.path.realpath(sys.argv[1])))' "$0")"

script_path="$dir_path/index.mjs"
node_path="$(which node)"

"$node_path" --no-warnings --experimental-specifier-resolution=node "$script_path" "$@"
