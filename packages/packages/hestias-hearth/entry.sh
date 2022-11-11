# https://stackoverflow.com/questions/68111434/how-to-run-node-js-cli-with-experimental-specifier-resolution-node
# /usr/bin/env node --experimental-specifier-resolution=node $(dirname $0)/index.mjs "$@"
full_path="$(realpath "$0")"
dir_path="$(dirname $full_path)"
script_path="$dir_path/index.mjs"

node_path="$(which node)"

$node_path --experimental-specifier-resolution=node $script_path "$@"
