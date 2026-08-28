import React, { memo, forwardRef } from "react"
import { geoGraticule } from "d3-geo"
import { useMapContext } from "./MapProvider"
import type { GraticuleProps } from "../types"

const Graticule = forwardRef<SVGPathElement, GraticuleProps>(
  (
    {
      fill = "transparent",
      stroke = "currentcolor",
      step = [10, 10],
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { path } = useMapContext()
    return React.createElement("path", {
      ref,
      d: path(geoGraticule().step(step)()),
      fill,
      stroke,
      className: `rsm-graticule ${className}`,
      ...restProps,
    })
  }
)

Graticule.displayName = "Graticule"

export default memo(Graticule)
