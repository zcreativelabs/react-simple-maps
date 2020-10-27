
import React, { useContext } from "react"
import PropTypes from "prop-types"

import { MapContext } from "./MapProvider"
import useGeographies from "./useGeographies"

const Geographies = ({
  geography,
  children,
  parseGeographies,
  className = "",
  ...restProps
}) => {
  const { path, projection } = useContext(MapContext)
  const { geographies, outline, borders } = useGeographies({ geography, parseGeographies })

  return (
    <g className={`rsm-geographies ${className}`} {...restProps}>
      {
        geographies && geographies.length > 0 &&
        children({ geographies, outline, borders, path, projection })
      }
    </g>
  )
}

Geographies.propTypes = {
  geography: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  children: PropTypes.func,
  parseGeographies: PropTypes.func,
  className: PropTypes.string,
}

export default Geographies
