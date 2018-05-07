
import React, { Component } from "react"
import { geoLength } from "d3-geo"

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
      hiddenStyle,
      dx,
      dy,
      zoom,
      stroke,
      strokeWidth,
      children,
      curve,
      markerEnd,
      width,
      height,
    } = this.props

    const connectorPath = createConnectorPath(null, [-dx/zoom,-dy/zoom], curve)
    const translation = projection(subject)

    const lineString = {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          projection.invert([width/2,height/2]),
          subject,
        ],
      },
    }

    const radians = Math.PI/2, degrees = 90
    const isGlobe = projection.clipAngle && projection.clipAngle() === degrees
    const isHidden = isGlobe && geoLength(lineString) > radians

    return (
      <g
        className="rsm-annotation"
        style={isHidden ? {...style, ...hiddenStyle} : style}
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
