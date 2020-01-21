import React, { Component } from "react"
import { geoPath } from "d3-geo"

import Svg, { Path, G } from "react-native-svg"

import { roundPath } from "./utils"

const pathCache = {}

const renderPath = (cacheId, geography, projection, round, precision) => {
  if (pathCache[cacheId]) return pathCache[cacheId]

  const pathString = cacheId
    ? pathCache[cacheId]
      ? pathCache[cacheId]
      : round
      ? roundPath(geoPath().projection(projection)(geography), precision)
      : geoPath().projection(projection)(geography)
    : round
    ? roundPath(geoPath().projection(projection)(geography), precision)
    : geoPath().projection(projection)(geography)

  if (cacheId) pathCache[cacheId] = pathString

  return pathString
}

class Geography extends Component {
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
    const { geography, projection, round, cacheId, precision, style } = this.props

    const { pressed } = this.state

    const pathString = renderPath(cacheId, geography, projection, round, precision)

    const excludeProps = [
      "geography",
      "projection",
      "round",
      "cacheId",
      "precision",
      "style",
      "delayPressIn",
      "delayPressOut",
      "delayLongPress",
      "onPress",
      "onPressIn",
      "onPressOut",
      "onLongPress",
    ]

    const restProps = Object.keys(this.props)
      .filter(key => excludeProps.indexOf(key) === -1)
      .reduce((obj, key) => {
        obj[key] = this.props[key]
        return obj
      }, {})

    const { delayPressIn = 0, delayPressOut = 0, delayLongPress = 0 } = this.props

    return (
      <G
        onPress={this.onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
        onLongPress={this.onLongPress}
        delayPressIn={delayPressIn}
        delayPressOut={delayPressOut}
        delayLongPress={delayLongPress}
      >
        <Path d={pathString} style={style[pressed ? "pressed" : "default"]} {...restProps} />
      </G>
    )
  }
}

Geography.defaultProps = {
  precision: 0.1,
  cacheId: null,
  round: false,
  tabable: true,
  style: {
    default: {},
    pressed: {},
  },
}

export default Geography
