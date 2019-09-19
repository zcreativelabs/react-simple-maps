
import React, { useContext } from "react"
import PropTypes from "prop-types"

import { MapContext } from "./MapProvider"
import useGeographies from "./useGeographies"

const Geographies = ({
  geography,
  children,
  parseGeographies,
  ...restProps
}) => {
  const { path, projection } = useContext(MapContext)
  const { geographies } = useGeographies({ geography, parseGeographies })

  return (
    <g {...restProps}>
      {
        geographies && geographies.length > 0 &&
        children({ geographies, path, projection })
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
}

export default Geographies
