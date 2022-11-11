#!/usr/bin/env bash
# https://stackoverflow.com/questions/68111434/how-to-run-node-js-cli-with-experimental-specifier-resolution-node
/usr/bin/env node --experimental-specifier-resolution=node $(dirname $0)/index.mjs "$@"
