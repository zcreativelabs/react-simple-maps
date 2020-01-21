// @ts-nocheck
import React, { Component } from "react"
import { geoLength } from "d3-geo"

import Svg, { G } from "react-native-svg"

class Marker extends Component {
  constructor() {
    super()

    this.state = {
      pressed: false,
    }
    this.onPress = this.onPress.bind(this)
    this.onPressIn = this.onPressIn.bind(this)
    this.onPressOut = this.onPressOut.bind(this)
    this.onLongPress = this.onLongPress.bind(this)
  }
  onPress(event) {
    const { onPress, geography } = this.props
    onPress && onPress(geography, event)
  }
  onPressIn(event) {
    const { onPressIn, geography } = this.props
    this.setState({ pressed: true }, () => {
      onPressIn && onPressIn(geography, event)
    })
  }
  onPressOut(event) {
    const { onPressOut, geography } = this.props
    this.setState({ pressed: false }, () => {
      onPressOut && onPressOut(geography, event)
    })
  }
  onLongPress(event) {
    const { onLongPress, geography } = this.props
    onLongPress && onLongPress(geography, event)
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

    const { delayPressIn = 0, delayPressOut = 0, delayLongPress = 0 } = this.props
    const translate = `translate(
           ${translation[0]}
           ${translation[1]}
         ) ${scale}`
    const selectedStyle = isHidden ? "hidden" : pressed ? "pressed" : "default"
    return (
      <G
        onPress={this.onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
        onLongPress={this.onLongPress}
        delayPressIn={delayPressIn}
        delayPressOut={delayPressOut}
        delayLongPress={delayLongPress}
        transform={translate}
        style={style[selectedStyle]}
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
