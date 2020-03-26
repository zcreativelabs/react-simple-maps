
import React, { useContext } from "react"
import PropTypes from "prop-types"

import { MapContext } from "./MapProvider"
import useZoomPan from "./useZoomPan"

const ZoomableGroup = ({
  children,
  minZoom = 1,
  maxZoom = 8,
  translateExtent,
  onMoveStart,
  onMoveEnd,
  center = [0, 0],
  zoom = 1,
  render,
  className,
  ...restProps
}) => {
  const { width, height, projection } = useContext(MapContext)

  const {
    mapRef,
    itemRef,
    position,
    transformString,
  } = useZoomPan({
    width,
    height,
    center,
    onMoveStart,
    onMoveEnd,
    scaleExtent: [minZoom, maxZoom],
    translateExtent,
    projection,
    zoom,
  })

  return (
    <g ref={mapRef} className={`rsm-zoomable-group ${className}`} {...restProps}>
      <rect width={width} height={height} fill="transparent" />
      {
        render
          ? render(position)
          : (
            <g ref={itemRef} transform={transformString}>
              {children}
            </g>
          )
      }
    </g>
  )
}

ZoomableGroup.propTypes = {
  render: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  center: PropTypes.array,
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  onMoveStart: PropTypes.func,
  onMove: PropTypes.func,
  onMoveEnd: PropTypes.func,
  className: PropTypes.string,
}

export default ZoomableGroup
