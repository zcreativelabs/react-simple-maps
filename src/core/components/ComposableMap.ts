import React, { forwardRef } from "react"
import { MapProvider } from "./MapProvider"
import type { ComposableMapProps } from "../types"

const ComposableMap = forwardRef<SVGSVGElement, ComposableMapProps>(
  (
    {
      width = 800,
      height = 600,
      projection = "geoEqualEarth",
      projectionConfig = {},
      className = "",
      children,
      ...restProps
    },
    ref
  ) => {
    return React.createElement(
      MapProvider,
      {
        width,
        height,
        projection,
        projectionConfig,
      },
      React.createElement("svg", {
        ref,
        viewBox: `0 0 ${width} ${height}`,
        className: `rsm-svg ${className}`,
        ...restProps,
        children,
      })
    )
  }
)

ComposableMap.displayName = "ComposableMap"

export default ComposableMap
