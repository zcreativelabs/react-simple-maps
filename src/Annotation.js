
import React, { Component } from "react"

import {
  createConnectorPath,
  createTextAnchor,
} from "./utils"

class Annotation extends Component {
  render() {

    const {
      projection,
      subject,
      style,
      dx,
      dy,
      zoom,
      stroke,
      strokeWidth,
      children,
      curve,
      markerEnd,
    } = this.props

    const connectorPath = createConnectorPath(null, [-dx/zoom,-dy/zoom], curve)
    const translation = projection()(subject)

    return (
      <g
        className="rsm-annotation"
        style={{ style }}
        transform={ `translate(
          ${ translation[0] + dx / zoom }
          ${ translation[1] + dy / zoom }
        )`}
        textAnchor={ createTextAnchor(dx) }
        >
        { children }
        <path
          d={ connectorPath }
          stroke={ stroke }
          strokeWidth={ strokeWidth }
          fill="none"
          markerEnd={ markerEnd }
        />
      </g>
    )
  }
}

Annotation.defaultProps = {
  curve: 0,
  markerEnd: "none",
  componentIdentifier: "Annotation",
  stroke: "#000000",
  strokeWidth: 1,
  zoom: 1,
}

export default Annotation
