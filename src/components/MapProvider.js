import React, { createContext, useMemo, useCallback, useContext } from "react"
import PropTypes from "prop-types"
import * as d3Geo from "d3-geo"

const { geoPath, ...projections } = d3Geo

const MapContext = createContext()

const makeProjection = ({
  projectionConfig = {},
  projection = "geoEqualEarth",
  width = 800,
  height = 600,
}) => {
  const isFunc = typeof projection === "function"

  if (isFunc) return projection

  let proj = projections[projection]().translate([width / 2, height / 2])

  const supported = [
    proj.center ? "center" : null,
    proj.rotate ? "rotate" : null,
    proj.scale ? "scale" : null,
    proj.parallels ? "parallels" : null,
  ]

  supported.forEach((d) => {
    if (!d) return
    proj = proj[d](projectionConfig[d] || proj[d]())
  })

  return proj
}

const MapProvider = ({
  width,
  height,
  projection,
  projectionConfig,
  ...restProps
}) => {
  const [cx, cy] = projectionConfig.center || []
  const [rx, ry, rz] = projectionConfig.rotate || []
  const [p1, p2] = projectionConfig.parallels || []
  const s = projectionConfig.scale || null

  const projMemo = useMemo(() => {
    return makeProjection({
      projectionConfig: {
        center: cx || cx === 0 || cy || cy === 0 ? [cx, cy] : null,
        rotate: rx || rx === 0 || ry || ry === 0 ? [rx, ry, rz] : null,
        parallels: p1 || p1 === 0 || p2 || p2 === 0 ? [p1, p2] : null,
        scale: s,
      },
      projection,
      width,
      height,
    })
  }, [width, height, projection, cx, cy, rx, ry, rz, p1, p2, s])

  const proj = useCallback(projMemo, [projMemo])

  const value = useMemo(() => {
    return {
      width,
      height,
      projection: proj,
      path: geoPath().projection(proj),
    }
  }, [width, height, proj])

  return <MapContext.Provider value={value} {...restProps} />
}

MapProvider.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  projection: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  projectionConfig: PropTypes.object,
}

const useMapContext = () => {
  return useContext(MapContext)
}

export { MapProvider, MapContext, useMapContext }
