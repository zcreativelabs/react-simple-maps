import React, { useContext, forwardRef } from "react"
import PropTypes from "prop-types"

import { MapContext } from "./MapProvider"
import { ZoomPanProvider } from "./ZoomPanProvider"
import useZoomPan from "./useZoomPan"

const ZoomableGroup = forwardRef(
  (
    {
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
      ...restProps
    },
    ref
  ) => {
    const { width, height } = useContext(MapContext)

    const { mapRef, transformString, position } = useZoomPan({
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
      <ZoomPanProvider
        value={{ x: position.x, y: position.y, k: position.k, transformString }}
      >
        <g ref={mapRef}>
          <rect width={width} height={height} fill="transparent" />
          <g
            ref={ref}
            transform={transformString}
            className={`rsm-zoomable-group ${className}`}
            {...restProps}
          />
        </g>
      </ZoomPanProvider>
    )
  }
)

ZoomableGroup.displayName = "ZoomableGroup"

ZoomableGroup.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  translateExtent: PropTypes.arrayOf(PropTypes.array),
  onMoveStart: PropTypes.func,
  onMove: PropTypes.func,
  onMoveEnd: PropTypes.func,
  className: PropTypes.string,
}

export default ZoomableGroup
