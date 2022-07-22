import React, { useContext, forwardRef } from "react"
import PropTypes from "prop-types"

import { MapContext } from "./MapProvider"

const Line = forwardRef(
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
    const { path } = useContext(MapContext)

    const lineData = {
      type: "LineString",
      coordinates: coordinates || [from, to],
    }

    return (
      <path
        ref={ref}
        d={path(lineData)}
        className={`rsm-line ${className}`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
        {...restProps}
      />
    )
  }
)

Line.displayName = "Line"

Line.propTypes = {
  from: PropTypes.array,
  to: PropTypes.array,
  coordinates: PropTypes.array,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  fill: PropTypes.string,
  className: PropTypes.string,
}

export default Line
