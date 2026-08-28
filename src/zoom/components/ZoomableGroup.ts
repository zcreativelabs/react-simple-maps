import React, { forwardRef } from "react"
import { useMapContext } from "../../core/index"
import { ZoomPanProvider } from "./ZoomPanProvider"
import useZoomPan from "../hooks/useZoomPan"
import type { ZoomableGroupProps } from "../types"

const ZoomableGroup = forwardRef<SVGGElement, ZoomableGroupProps>(
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
      className = "",
      children,
      ...restProps
    },
    ref
  ) => {
    const { width, height } = useMapContext()

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

    return React.createElement(
      ZoomPanProvider,
      {
        value: { x: position.x, y: position.y, k: position.k, transformString },
      },
      React.createElement(
        "g",
        { ref: mapRef },
        React.createElement("rect", { width, height, fill: "transparent" }),
        React.createElement(
          "g",
          {
            ref,
            transform: transformString,
            className: `rsm-zoomable-group ${className}`,
            ...restProps,
          },
          children
        )
      )
    )
  }
)

ZoomableGroup.displayName = "ZoomableGroup"

export default ZoomableGroup
