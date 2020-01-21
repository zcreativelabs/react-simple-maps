/***
 * Links: https://snack.expo.io/@msand/svg-pinch-to-pan-and-zoom
 */
import React, { Component } from "react"
import { View, PanResponder } from "react-native"

import Svg, { Defs, G, Rect } from "react-native-svg"

import SvgPanZoom, { SvgPanZoomElement } from "react-native-svg-pan-zoom"

import projections from "./projections"
import defaultProjectionConfig from "./projectionConfig"

function calcDistance(x1, y1, x2, y2) {
  const dx = x1 - x2
  const dy = y1 - y2
  return Math.sqrt(dx * dx + dy * dy)
}

function middle(p1, p2) {
  return (p1 + p2) / 2
}

function calcCenter(x1, y1, x2, y2) {
  return {
    x: middle(x1, x2),
    y: middle(y1, y2),
  }
}

class ZoomableMap extends Component {
  constructor(props) {
    super(props)
    this.projection = this.projection.bind(this)
    this.onLayoutChange = this.onLayoutChange.bind(this)
    this.state = {
      parentWidth: 0,
      parentHeight: 0,
      zoom: 1,
      left: 0,
      top: 0,
    }
  }
  processPinch(x1, y1, x2, y2) {
    const distance = calcDistance(x1, y1, x2, y2)
    const { x, y } = calcCenter(x1, y1, x2, y2)

    if (!this.state.isZooming) {
      const { top, left, zoom } = this.state
      this.setState({
        isZooming: true,
        initialX: x,
        initialY: y,
        initialTop: top,
        initialLeft: left,
        initialZoom: zoom,
        initialDistance: distance,
      })
    } else {
      const { initialX, initialY, initialTop, initialLeft, initialZoom, initialDistance } = this.state

      const touchZoom = distance / initialDistance
      const dx = x - initialX
      const dy = y - initialY

      const left = (initialLeft + dx - x) * touchZoom + x
      const top = (initialTop + dy - y) * touchZoom + y
      const zoom = initialZoom * touchZoom

      this.setState({
        zoom,
        left,
        top,
      })
    }
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onPanResponderGrant: () => {},
      onPanResponderTerminate: () => {},
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onShouldBlockNativeResponder: () => true,
      onPanResponderTerminationRequest: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderMove: evt => {
        const touches = evt.nativeEvent.touches
        const length = touches.length
        if (length === 1) {
          const [{ locationX, locationY }] = touches
          this.processTouch(locationX, locationY)
        } else if (length === 2) {
          const [touch1, touch2] = touches
          this.processPinch(touch1.locationX, touch1.locationY, touch2.locationX, touch2.locationY)
        }
      },
      onPanResponderRelease: () => {
        this.setState({
          isZooming: false,
          isMoving: false,
        })
      },
    })
  }

  processTouch(x, y) {
    if (!this.state.isMoving || this.state.isZooming) {
      const { top, left } = this.state
      this.setState({
        isMoving: true,
        isZooming: false,
        initialLeft: left,
        initialTop: top,
        initialX: x,
        initialY: y,
      })
    } else {
      const { initialX, initialY, initialLeft, initialTop } = this.state
      const dx = x - initialX
      const dy = y - initialY
      console.log("left", initialLeft + dx, x, initialX)
      console.log("top", initialTop + dy, y, initialY)
      this.setState({
        left: initialLeft + dx,
        top: initialTop + dy,
      })
    }
  }

  projection() {
    const { projection, projectionConfig, width, height } = this.props

    return typeof projection !== "function"
      ? projections(width, height, projectionConfig, projection)
      : projection(width, height, projectionConfig)
  }

  onLayoutChange(event) {
    this.setState({
      parentWidth: event.nativeEvent.layout.width,
      parentHeight: event.nativeEvent.layout.height,
    })
  }
  render() {
    const {
      width,
      height,
      resolution,
      style,
      showCenter,
      children,
      aspectRatio,
      viewBox,
      defs,
      ...restProps
    } = this.props
    const { left, top, zoom } = this.state

    return (
      // <View {...this._panResponder.panHandlers}>
      <SvgPanZoom
        canvasHeight={height}
        canvasWidth={width}
        minScale={0.5}
        maxScale={10}
        initialZoom={0.7}
        onZoom={zoom => {
          console.log("onZoom:" + zoom)
        }}
        canvasStyle={{ backgroundColor: "yellow" }}
        viewStyle={{ backgroundColor: "green" }}
        {...restProps}
      >
        {defs && <Defs>{defs}</Defs>}
        {/* <G
          transform={{
            translateX: left * resolution,
            translateY: top * resolution,
            scale: zoom,
          }}
        > */}
        {React.Children.map(Array.isArray(children) ? children : [children], child =>
          React.cloneElement(child, {
            projection: this.projection(),
            width,
            height,
            zoom,
            parentHeight: this.state.parentHeight,
            parentWidth: this.state.parentWidth,
          })
        )}
        {/* </G> */}
        {showCenter && (
          <G>
            <Rect x={width / 2 - 0.5} y={0} width={1} height={height} fill="#e91e63" />
            <Rect x={0} y={height / 2 - 0.5} width={width} height={1} fill="#e91e63" />
          </G>
        )}
      </SvgPanZoom>
      // </View>
    )
  }
}

ZoomableMap.defaultProps = {
  width: 800,
  height: 450,
  projection: "times",
  projectionConfig: defaultProjectionConfig,
  aspectRatio: "xMidYMid",
  viewBox: null,
}

export default ZoomableMap
