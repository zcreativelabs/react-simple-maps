
import React from "react"
import PropTypes from "prop-types"

import useZoomPan from "./useZoomPan"

const ZoomableGroup = ({
  render,
  children,
  center = [0, 0],
  zoom = 1,
  minZoom = 1,
  maxZoom = 5,
  zoomSensitivity = 0.025,
  onZoomStart,
  onZoomEnd,
  onMoveStart,
  onMoveEnd,
  disablePanning = false,
  disableZooming = false,
  className = "",
  ...restProps
}) => {
  const {elRef, position, transformString} = useZoomPan({
    center,
    zoom,
    minZoom,
    maxZoom,
    zoomSensitivity,
    onZoomStart,
    onZoomEnd,
    onMoveStart,
    onMoveEnd,
    disablePanning,
    disableZooming,
  })

  return (
    <g
      ref={elRef}
      className={`rsm-zoomable-group ${className}`}
      {...restProps}
    >
      {
        render
          ? render(position)
          : <g transform={transformString}>{children}</g>
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
  zoomSensitivity: PropTypes.number,
  onZoomStart: PropTypes.func,
  onZoomEnd: PropTypes.func,
  onMoveStart: PropTypes.func,
  onMoveEnd: PropTypes.func,
  disablePanning: PropTypes.bool,
  disableZooming: PropTypes.bool,
  className: PropTypes.string,
}

export default ZoomableGroup
