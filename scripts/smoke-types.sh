#!/usr/bin/env bash
#
# Verifies that the published package's public types resolve in a consuming
# project that has NO @types/* packages of its own.
#
# This exists because the library's .d.ts files re-export types from `geojson`,
# `d3-geo`, `d3-zoom` and `topojson-specification`. If those type packages are
# not real `dependencies`, consumers can't resolve them and TypeScript silently
# degrades the affected props to `any` (e.g. ComposableMap's `projection`).
# `skipLibCheck: true` hides this, so only an install-and-check catches it.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "==> Building package"
npm --prefix "$ROOT" run build >/dev/null

echo "==> Packing tarball"
TARBALL="$(cd "$ROOT" && npm pack --pack-destination "$WORK" --silent | tail -1)"

echo "==> Creating consumer project in $WORK"
cd "$WORK"

cat > package.json <<'JSON'
{
  "name": "rsm-types-smoke",
  "private": true,
  "version": "0.0.0"
}
JSON

# Only react types — deliberately NO @types/geojson, @types/d3-*,
# @types/topojson-specification. The library must supply those itself.
npm install --silent --no-audit --no-fund \
  "$WORK/$TARBALL" react react-dom @types/react @types/react-dom typescript

cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "react",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": false,
    "noEmit": true
  },
  "include": ["smoke.ts"]
}
JSON

cat > smoke.ts <<'TS'
import type {
  ComposableMapProps,
  GeographiesProps,
  ProjectionName,
} from "react-simple-maps"
import type { ZoomableGroupProps, ZoomGestureEvent } from "react-simple-maps"

// If `GeoProjection` fails to resolve, `projection` collapses to `any` and
// these assignments all pass — so assert the negative case too, below.
const named: ComposableMapProps["projection"] = "geoMercator"
// @ts-expect-error not a valid ProjectionName
const badName: ComposableMapProps["projection"] = "geoNotARealProjection"

const proj: ProjectionName = "geoOrthographic"

// `geography` must not be `any` — it comes from the `geojson` package.
const geo: GeographiesProps["geography"] = "/world.json"
// @ts-expect-error geography is not a number
const badGeo: GeographiesProps["geography"] = 42

// `d3-zoom` types must resolve for the zoom entrypoint. ZoomGestureEvent is
// the alias that actually depends on d3-zoom, so exercise its shape.
const zoomProps: ZoomableGroupProps = {
  zoom: 1,
  onMove: (_props, event: ZoomGestureEvent) => {
    const k: number = event.transform.k
    void k
  },
}

void [named, badName, proj, geo, badGeo, zoomProps]
TS

echo "==> Type-checking consumer (skipLibCheck: false)"
npx tsc --noEmit -p tsconfig.json

echo ""
echo "PASS: public types resolve without consumer-installed @types/*"
