import React, { useContext } from "react"
import PropTypes from "prop-types"

import { MapContext } from "./MapProvider"
import useZoomPan from "./useZoomPan"

const CustomZoomableGroup = ({
  center = [0, 0],
  zoom = 1,
  minZoom = 1,
  maxZoom = 8,
  translateExtent,
  filterZoomEvent,
  onMoveStart,
  onMove,
  onMoveEnd,
  className,
  children
}) => {
  const { width, height } = useContext(MapContext)

  const {
    mapRef,
    transformString,
    position
  } = useZoomPan({
    center,
    filterZoomEvent,
    onMoveStart,
    onMove,
    onMoveEnd,
    scaleExtent: [minZoom, maxZoom],
    translateExtent,
    zoom,
  })

  return (
    <g ref={mapRef}>
      <rect width={width} height={height} fill="transparent" />
      <g transform={transformString} className={`rsm-zoomable-group ${className}`}>{children(position)}</g>
    </g>
  )
}

CustomZoomableGroup.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  translateExtent: PropTypes.arrayOf(PropTypes.array),
  onMoveStart: PropTypes.func,
  onMove: PropTypes.func,
  onMoveEnd: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.func.isRequired
}

export default CustomZoomableGroup
