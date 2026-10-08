#!/bin/bash
# uso: api-run.sh CTxx METODO ROTA [corpo-json]  -> grava a evidência em Evidencias/api/CTxx.txt
B=https://verzel-store.qa-test-verzel-store.workers.dev
ct=$1; m=$2; r=$3; body=$4
out="$(dirname "$0")/api/$ct.txt"
h=$(mktemp)
if [ -n "$body" ]; then resp=$(curl -s -D "$h" -X $m "$B$r" -H 'Content-Type: application/json' -d "$body")
else resp=$(curl -s -D "$h" -X $m "$B$r"); fi
st=$(head -1 "$h" | tr -d '\r'); ctype=$(grep -i '^content-type' "$h" | tr -d '\r')
{ echo "# $ct"; echo "Requisição: $m $r"; [ -n "$body" ] && echo "Corpo: $body"; echo "Resposta: $st | $ctype"; echo "$resp"; echo; } | tee "$out"
rm -f "$h"
