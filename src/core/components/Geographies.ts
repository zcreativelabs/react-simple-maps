import React, { forwardRef } from "react"
import { useMapContext } from "./MapProvider"
import useGeographies from "../hooks/useGeographies"
import type { GeographiesProps } from "../types"

const Geographies = forwardRef<SVGGElement, GeographiesProps>(
  (
    { geography, children, parseGeographies, className = "", ...restProps },
    ref
  ) => {
    const { path, projection } = useMapContext()
    const { geographies, outline, borders } = useGeographies({
      geography,
      parseGeographies,
    })

    return React.createElement(
      "g",
      {
        ref,
        className: `rsm-geographies ${className}`,
        ...restProps,
      },
      geographies &&
        geographies.length > 0 &&
        children({ geographies, outline, borders, path, projection })
    )
  }
)

Geographies.displayName = "Geographies"

export default Geographies
