import React, { memo, forwardRef } from "react"
import type { GeographyProps } from "../types"

const Geography = forwardRef<SVGPathElement, GeographyProps>(
  ({ geography, className = "", ...restProps }, ref) => {
    return React.createElement("path", {
      ref,
      tabIndex: 0,
      className: `rsm-geography ${className}`,
      d: geography.svgPath,
      ...restProps,
    })
  }
)

Geography.displayName = "Geography"

export default memo(Geography)
