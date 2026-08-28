import React, { forwardRef } from "react"
import { useMapContext } from "./MapProvider"
import type { MarkerProps } from "../types"

const Marker = forwardRef<SVGGElement, MarkerProps>(
  ({ coordinates, children, className = "", ...restProps }, ref) => {
    const { projection } = useMapContext()
    const projected = projection(coordinates)

    if (!projected) return null

    const [x, y] = projected

    return React.createElement(
      "g",
      {
        ref,
        transform: `translate(${x}, ${y})`,
        className: `rsm-marker ${className}`,
        ...restProps,
      },
      children
    )
  }
)

Marker.displayName = "Marker"

export default Marker
