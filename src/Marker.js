import React, { Component } from "react"
import { geoLength } from "d3-geo"

import { Svg } from "expo"
const { G } = Svg

class Marker extends Component {
  constructor() {
    super()

    this.state = {
      pressed: false,
    }
  }

  render() {
    const { projection, marker, style, tabable, zoom, children, preserveMarkerAspect, width, height } = this.props

    const { pressed, hover } = this.state

    const scale = preserveMarkerAspect ? ` scale(${1 / zoom})` : ""
    const translation = projection(marker.coordinates)

    const lineString = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [projection.invert([width / 2, height / 2]), marker.coordinates],
      },
    }

    const radians = Math.PI / 2,
      degrees = 90
    const isGlobe = projection.clipAngle && projection.clipAngle() === degrees
    const isHidden = isGlobe && geoLength(lineString) > radians

    return (
      <G
        transform={`translate(
           ${translation[0]}
           ${translation[1]}
         ) ${scale}`}
        style={style[isHidden ? "hidden" : pressed ? "pressed" : "default"]}
      >
        {children}
      </G>
    )
  }
}

Marker.defaultProps = {
  style: {
    default: {},
    pressed: {},
    hidden: {},
  },
  marker: {
    coordinates: [0, 0],
  },
  tabable: true,
  preserveMarkerAspect: true,
}

export default Marker
