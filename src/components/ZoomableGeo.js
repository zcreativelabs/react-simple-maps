
import React, { useContext } from "react"
import PropTypes from "prop-types"

import { MapContext } from "./MapProvider"
import useZoomGeo from "./useZoomGeo"

const ZoomableGeo = ({
  bounds = null,
  boundsMargin = 0.1,
  duration = 750,
  minZoom = 1,
  maxZoom = 8,
  onMoveStart,
  onMove,
  onMoveEnd,
  className,
  ...restProps
}) => {
  const { width, height } = useContext(MapContext)
  
  const { 
    mapRef, 
    transformString, 
    style 
  } = useZoomGeo({
    bounds,
    boundsMargin,
    duration,
    onMoveStart,
    onMove,
    onMoveEnd,
    scaleExtent: [minZoom, maxZoom],
  });
  
  return (
    <g ref={mapRef}>
      <rect width={width} height={height} fill="transparent" />
      <g transform={transformString} style={style} className={`rsm-zoomable-geo ${className}`} {...restProps} />
    </g>
  )
}

ZoomableGeo.propTypes = {
  bounds: PropTypes.object,
  boundsMargin: PropTypes.number,
  duration: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  onMoveStart: PropTypes.func,
  onMove: PropTypes.func,
  onMoveEnd: PropTypes.func,
  className: PropTypes.string,
}

export default ZoomableGeo
