
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
    } = this.props

    const connectorPath = createConnectorPath(null, [-dx/zoom,-dy/zoom])

    return (
      <g
        className="rsm-annotation"
        style={{ style }}
        transform={ `translate(
          ${ projection()(subject)[0] + dx / zoom }
          ${ projection()(subject)[1] + dy / zoom }
        )`}
        textAnchor={ createTextAnchor(dx) }
        >
        { children }
        <path d={ connectorPath } stroke={ stroke } strokeWidth={ strokeWidth } />
      </g>
    )
  }
}

Annotation.defaultProps = {
  componentIdentifier: "Annotation",
  stroke: "#000000",
  strokeWidth: 1,
  zoom: 1,
}

export default Annotation
