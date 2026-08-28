
# Changelog

## v5.0.0 2026-08-28

- Rewritten in TypeScript, with full type coverage across the public API
- Restructured as a single package with subpath exports:
  - `import { ComposableMap, ZoomableGroup } from "react-simple-maps"` (everything)
  - `import { ComposableMap } from "react-simple-maps/core"` (core only, no zoom/pan dependencies)
  - `import { ZoomableGroup } from "react-simple-maps/zoom"` (zoom/pan only)
- Bugfixes for `useZoomPan`, `useGeographies`, `Marker`, and `Annotation`
- Added a full automated test suite (145 tests) with near-complete statement/branch coverage

## v3.0.0 2022-07-25

- Added `forwardRef` to mapping components
- Added `ZoomPanContext` and `ZoomPanProvider`
- Added `useZoomPanContext` and `useMapContext` hooks
- Added support for React 18
