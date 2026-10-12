#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLIC_DIR="$ROOT_DIR/data-experience/public"
EXPERIENCES_DIR="$ROOT_DIR/packages/packages/experiences"
ALLOWLIST_FILE="$ROOT_DIR/.viewer-sync-allowlist"

if [[ ! -d "$PUBLIC_DIR" ]]; then
  echo "ERROR: Missing directory: $PUBLIC_DIR"
  exit 2
fi

if [[ ! -d "$EXPERIENCES_DIR" ]]; then
  echo "ERROR: Missing directory: $EXPERIENCES_DIR"
  exit 2
fi

allowlist=()
if [[ -f "$ALLOWLIST_FILE" ]]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%%#*}"
    line="$(echo "$line" | tr -d '[:space:]')"
    [[ -z "$line" ]] && continue
    allowlist+=("$line")
  done < "$ALLOWLIST_FILE"
fi

contains() {
  local needle="$1"
  shift
  local item
  for item in "$@"; do
    if [[ "$item" == "$needle" ]]; then
      return 0
    fi
  done
  return 1
}

public_files=()
while IFS= read -r file; do
  public_files+=("$file")
done < <(find "$PUBLIC_DIR" -maxdepth 1 -type f -name '*-viewer.json' | sort)

if [[ ${#public_files[@]} -eq 0 ]]; then
  echo "ERROR: No *-viewer.json files found in $PUBLIC_DIR"
  exit 2
fi

failures=()
warnings=()
allowed=()
matched_count=0

for public_file in "${public_files[@]}"; do
  base="$(basename "$public_file")"

  matches=()
  while IFS= read -r match; do
    matches+=("$match")
  done < <(find "$EXPERIENCES_DIR" -type f -path '*/src/*' -name "$base" | sort)
  match_count="${#matches[@]}"

  if [[ "$match_count" -eq 0 ]]; then
    failures+=("MISSING counterpart for $base")
    continue
  fi

  if [[ "$match_count" -gt 1 ]]; then
    failures+=("AMBIGUOUS counterpart for $base (${match_count} matches)")
    continue
  fi

  package_file="${matches[0]}"
  matched_count=$((matched_count + 1))

  if cmp -s "$public_file" "$package_file"; then
    continue
  fi

  if contains "$base" "${allowlist[@]}"; then
    allowed+=("$base")
  else
    rel_package="${package_file#$ROOT_DIR/}"
    failures+=("DIFF $base (vs $rel_package)")
  fi
done

for allow in "${allowlist[@]}"; do
  local_path="$PUBLIC_DIR/$allow"
  if [[ ! -f "$local_path" ]]; then
    warnings+=("UNUSED allowlist entry: $allow")
  fi
done

echo "Viewer sync check summary"
echo "- Public viewer files checked: ${#public_files[@]}"
echo "- Matched package counterparts: $matched_count"
echo "- Allowed diffs: ${#allowed[@]}"
echo "- Failures: ${#failures[@]}"

if [[ ${#allowed[@]} -gt 0 ]]; then
  echo
  echo "Allowed differences:"
  printf '  - %s\n' "${allowed[@]}"
fi

if [[ ${#warnings[@]} -gt 0 ]]; then
  echo
  echo "Warnings:"
  printf '  - %s\n' "${warnings[@]}"
fi

if [[ ${#failures[@]} -gt 0 ]]; then
  echo
  echo "Failures:"
  printf '  - %s\n' "${failures[@]}"
  echo
  echo "Result: FAILED"
  exit 1
fi

echo
echo "Result: OK"