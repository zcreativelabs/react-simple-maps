
import React, { memo, useContext } from "react"
import PropTypes from "prop-types"
import { geoGraticule } from "d3-geo"

import { MapContext } from "./MapProvider"

const Graticule = ({
  fill = "transparent",
  stroke = "currentcolor",
  step = [10, 10],
  ...restProps
}) => {
  const { path } = useContext(MapContext)
  return (
    <path
      d={path(geoGraticule().step(step)())}
      fill={fill}
      stroke={stroke}
      {...restProps}
    />
  )
}

Graticule.propTypes = {
  fill: PropTypes.string,
  stroke: PropTypes.string,
  step: PropTypes.array,
}

export default memo(Graticule)
