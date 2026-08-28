import React, { forwardRef } from "react"
import { useMapContext } from "./MapProvider"
import type { LineProps } from "../types"

const Line = forwardRef<SVGPathElement, LineProps>(
  (
    {
      from = [0, 0],
      to = [0, 0],
      coordinates,
      stroke = "currentcolor",
      strokeWidth = 3,
      fill = "transparent",
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { path } = useMapContext()

    const lineData = {
      type: "LineString" as const,
      coordinates: coordinates || [from, to],
    }

    return React.createElement("path", {
      ref,
      d: path(lineData),
      className: `rsm-line ${className}`,
      stroke,
      strokeWidth,
      fill,
      ...restProps,
    })
  }
)

Line.displayName = "Line"

export default Line
