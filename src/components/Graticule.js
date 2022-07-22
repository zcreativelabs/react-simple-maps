import React, { memo, useContext, forwardRef } from "react"
import PropTypes from "prop-types"
import { geoGraticule } from "d3-geo"

import { MapContext } from "./MapProvider"

const Graticule = forwardRef(
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
    const { path } = useContext(MapContext)
    return (
      <path
        ref={ref}
        d={path(geoGraticule().step(step)())}
        fill={fill}
        stroke={stroke}
        className={`rsm-graticule ${className}`}
        {...restProps}
      />
    )
  }
)

Graticule.displayName = "Graticule"

Graticule.propTypes = {
  fill: PropTypes.string,
  stroke: PropTypes.string,
  step: PropTypes.array,
  className: PropTypes.string,
}

export default memo(Graticule)
