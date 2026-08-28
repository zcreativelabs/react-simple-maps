import React, {
  createContext,
  useMemo,
  useCallback,
  useContext,
  ReactNode,
} from "react"
import * as d3Geo from "d3-geo"
import type { GeoProjection, GeoConicProjection } from "d3-geo"
import type { MapContextType, ProjectionName, ProjectionConfig } from "../types"

const { geoPath, ...projections } = d3Geo
const projectionFactories = projections as Record<
  ProjectionName,
  () => GeoProjection | GeoConicProjection
>

function isConicProjection(
  proj: GeoProjection | GeoConicProjection
): proj is GeoConicProjection {
  return "parallels" in proj
}

export const MapContext = createContext<MapContextType | undefined>(undefined)

interface MakeProjectionProps {
  projectionConfig?: ProjectionConfig
  projection?: ProjectionName | GeoProjection
  width?: number
  height?: number
}

const makeProjection = ({
  projectionConfig = {},
  projection = "geoEqualEarth",
  width = 800,
  height = 600,
}: MakeProjectionProps) => {
  const isFunc = typeof projection === "function"

  if (isFunc) return projection

  const proj = projectionFactories[projection]().translate([
    width / 2,
    height / 2,
  ])

  if (projectionConfig.center) proj.center(projectionConfig.center)
  if (projectionConfig.rotate) {
    const [lambda, phi, gamma] = projectionConfig.rotate
    proj.rotate(
      gamma === undefined ? [lambda, phi] : [lambda, phi, gamma]
    )
  }
  if (projectionConfig.scale) proj.scale(projectionConfig.scale)
  if (projectionConfig.parallels && isConicProjection(proj)) {
    proj.parallels(projectionConfig.parallels)
  }

  return proj
}

interface MapProviderProps {
  width?: number
  height?: number
  projection?: ProjectionName | GeoProjection
  projectionConfig?: ProjectionConfig
  children?: ReactNode
}

const MapProvider = ({
  width = 800,
  height = 600,
  projection = "geoEqualEarth",
  projectionConfig = {},
  children,
}: MapProviderProps) => {
  const [cx, cy] = projectionConfig.center || []
  const [rx, ry, rz] = projectionConfig.rotate || []
  const [p1, p2] = projectionConfig.parallels || []
  const s = projectionConfig.scale || null

  const projMemo = useMemo(() => {
    return makeProjection({
      projectionConfig: {
        center:
          typeof cx === "number" && typeof cy === "number"
            ? [cx, cy]
            : undefined,
        rotate:
          typeof rx === "number" && typeof ry === "number"
            ? [rx, ry, rz]
            : undefined,
        parallels:
          typeof p1 === "number" && typeof p2 === "number"
            ? [p1, p2]
            : undefined,
        scale: s || undefined,
      },
      projection,
      width,
      height,
    })
  }, [width, height, projection, cx, cy, rx, ry, rz, p1, p2, s])

  const proj = useCallback(projMemo, [projMemo])

  const value: MapContextType = useMemo(() => {
    return {
      width,
      height,
      projection: proj,
      path: geoPath().projection(proj),
    }
  }, [width, height, proj])

  return React.createElement(MapContext.Provider, { value }, children)
}

const useMapContext = (): MapContextType => {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error("useMapContext must be used within MapProvider")
  }
  return context
}

export { MapProvider, useMapContext }
