
import React, { useContext } from "react"
import PropTypes from "prop-types"

import { MapContext } from "./MapProvider"
import { createConnectorPath } from "../utils"

const Annotation = ({
  subject,
  children,
  connectorProps,
  dx = 30,
  dy = 30,
  curve = 0,
  className = "",
  ...restProps
}) => {
  const { projection } = useContext(MapContext)
  const [x, y] = projection(subject)
  const connectorPath = createConnectorPath(dx, dy, curve)

  return (
    <g
      transform={`translate(${x + dx}, ${y + dy})`}
      className={`rsm-annotation ${className}`}
      {...restProps}
    >
      <path d={connectorPath} fill="transparent" stroke="#000" {...connectorProps} />
      {children}
    </g>
  )
}

Annotation.propTypes = {
  subject: PropTypes.array,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  dx: PropTypes.number,
  dy: PropTypes.number,
  curve: PropTypes.number,
  connectorProps: PropTypes.object,
  className: PropTypes.string,
}

export default Annotation
