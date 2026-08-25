#!/usr/bin/env bash
# Regenerate the subset TT2020 fonts in public/fonts.
#
# Upstream ships ~1.8MB per weight because each letter carries dozens of
# alternate glyphs that `calt` cycles through to fake typewriter inconsistency.
# Subsetting to Latin-1 keeps that effect while cutting the regular weight to
# roughly 440KB.
#
# Requires: pip install fonttools brotli

set -euo pipefail

BASE="https://raw.githubusercontent.com/ctrlcctrlv/TT2020/master/dist"
OUT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public/fonts"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

UNICODES="U+0020-007E,U+00A0-00FF,U+2010-2015,U+2018-201D,U+2026,U+2032-2033,U+20AC,U+2122"

subset() {
  local upstream="$1" target="$2"
  curl -sSL --fail --max-time 60 "$BASE/$upstream.woff2" -o "$TMP/$upstream.woff2"
  pyftsubset "$TMP/$upstream.woff2" \
    --output-file="$OUT/$target.woff2" \
    --flavor=woff2 \
    --layout-features='calt,rand,liga,kern' \
    --unicodes="$UNICODES" \
    --no-hinting \
    --desubroutinize
  printf '%6s  %s\n' "$(du -h "$OUT/$target.woff2" | cut -f1)" "$target.woff2"
}

mkdir -p "$OUT"
subset TT2020StyleB-Regular tt2020b-regular
subset TT2020StyleB-Italic  tt2020b-italic
subset TT2020StyleE-Regular tt2020e-regular
subset TT2020StyleE-Italic  tt2020e-italic
