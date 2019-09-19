
import React, {
  createContext,
  useMemo,
} from "react"
import PropTypes from "prop-types"
import {
  geoPath,
  geoEqualEarth,
  geoMercator,
  geoTransverseMercator,
  geoAlbers,
  geoAlbersUsa,
  geoAzimuthalEqualArea,
  geoAzimuthalEquidistant,
  geoOrthographic,
  geoConicConformal,
  geoConicEqualArea,
  geoConicEquidistant,
} from "d3-geo"

const MapContext = createContext()

const projections = {
  geoEqualEarth,
  geoMercator,
  geoTransverseMercator,
  geoAlbers,
  geoAlbersUsa,
  geoAzimuthalEqualArea,
  geoAzimuthalEquidistant,
  geoOrthographic,
  geoConicConformal,
  geoConicEqualArea,
  geoConicEquidistant,
}

const makeProjection = ({
  projectionConfig = {},
  projection = "geoEqualEarth",
  width = 800,
  height = 500,
}) => {
  const isFunc = typeof projection === "function"

  if (isFunc) return projection

  let proj = projections[projection]()
    .translate([width / 2, height / 2])

  const supported = [
    proj.center ? "center" : null,
    proj.rotate ? "rotate" : null,
    proj.scale ? "scale" : null,
    proj.parallels ? "parallels" : null,
  ]

  supported.forEach(d => {
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
  const c = projectionConfig.center || []
  const r = projectionConfig.rotate || []
  const p = projectionConfig.parallels || []
  const s = projectionConfig.scale || null

  const value = useMemo(() => {
    const proj = makeProjection({
      projectionConfig,
      projection,
      width,
      height,
    })
    return {
      width,
      height,
      projection: proj,
      path: geoPath().projection(proj),
    }
  }, [
    width,
    height,
    projection,
    c[0],
    c[1],
    r[0],
    r[1],
    r[2],
    p[0],
    p[1],
    s,
  ])

  return (<MapContext.Provider value={value} {...restProps} />)
}

MapProvider.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  projection: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  projectionConfig: PropTypes.object,
}

export { MapProvider, MapContext }
