
import React, { Component } from "react"
import { geoPath } from "d3-geo"

import {
  calculateResizeFactor,
  calculateMousePosition,
  isChildOfType,
  createNewChildren,
} from "./utils"

class ZoomableGroup extends Component {
  constructor(props) {
    super(props)

    const backdropX = props.projection().rotate([0,0,0])([props.backdrop.x[0],0])[0]
    const backdropY = props.projection().rotate([0,0,0])([0,props.backdrop.y[0]])[1]
    const backdropWidth = props.projection().rotate([0,0,0])([props.backdrop.x[1],0])[0] - props.projection().rotate([0,0,0])([props.backdrop.x[0],0])[0]
    const backdropHeight = props.projection().rotate([0,0,0])([0,props.backdrop.y[1]])[1] - props.projection().rotate([0,0,0])([0,props.backdrop.y[0]])[1]

    this.state = {
      mouseX: calculateMousePosition("x", props.projection, props, props.zoom, 1),
      mouseY: calculateMousePosition("y", props.projection, props, props.zoom, 1),
      mouseXStart: 0,
      mouseYStart: 0,
      isPressed: false,
      resizeFactorX: 1,
      resizeFactorY: 1,
      backdrop: {
        width: Math.round(backdropWidth),
        height: Math.round(backdropHeight),
        x: Math.round(backdropX),
        y: Math.round(backdropY),
      },
    }

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleResize = this.handleResize.bind(this)

  }
  handleMouseMove({ pageX, pageY }) {
    if (this.props.disablePanning) return
    if (!this.state.isPressed) return
    this.setState({
      mouseX: pageX - this.state.mouseXStart,
      mouseY: pageY - this.state.mouseYStart,
    })
  }
  handleTouchMove({ touches }) {
    this.handleMouseMove(touches[0])
  }
  handleMouseUp() {
    if (this.props.disablePanning) return
    if (!this.state.isPressed) return
    this.setState({
      isPressed: false,
    })
    if (!this.props.onMoveEnd) return
    const { mouseX, mouseY, resizeFactorX, resizeFactorY } = this.state
    const { zoom, width, height, projection, onMoveEnd } = this.props
    const x = width / 2 - (mouseX * resizeFactorX / zoom)
    const y = height / 2 - (mouseY * resizeFactorY / zoom)
    const newCenter = projection().invert([ x, y ])
    onMoveEnd(newCenter)
  }
  handleMouseDown({ pageX, pageY }) {
    if (this.props.disablePanning) return
    const { mouseX, mouseY, resizeFactorX, resizeFactorY } = this.state
    const { zoom, width, height, projection, onMoveStart } = this.props
    this.setState({
      isPressed: true,
      mouseXStart: pageX - mouseX,
      mouseYStart: pageY - mouseY,
    })
    if (!onMoveStart) return
    const x = width / 2 - (mouseX * resizeFactorX / zoom)
    const y = height / 2 - (mouseY * resizeFactorY / zoom)
    const currentCenter = projection().invert([ x, y ])
    onMoveStart(currentCenter)
  }
  handleTouchStart({ touches }) {
    this.handleMouseDown(touches[0])
  }
  preventTouchScroll(evt) {
    evt.preventDefault()
  }
  componentWillReceiveProps(nextProps) {
    const { mouseX, mouseY, resizeFactorX, resizeFactorY } = this.state
    const { projection, center, zoom } = this.props

    const zoomFactor = nextProps.zoom / zoom
    const centerChanged = JSON.stringify(nextProps.center) !== JSON.stringify(center)

    this.setState({
      zoom: nextProps.zoom,
      mouseX: centerChanged ? calculateMousePosition("x", projection, nextProps, nextProps.zoom, resizeFactorX) : mouseX * zoomFactor,
      mouseY: centerChanged ? calculateMousePosition("y", projection, nextProps, nextProps.zoom, resizeFactorY) : mouseY * zoomFactor,
    })
  }
  handleResize() {
    const { width, height, projection, zoom } = this.props

    const resizeFactorX = calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().width, width)
    const resizeFactorY = calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().height, height)

    const xPercentageChange = 1 / resizeFactorX * this.state.resizeFactorX
    const yPercentageChange = 1 / resizeFactorY * this.state.resizeFactorY

    this.setState({
      resizeFactorX: resizeFactorX,
      resizeFactorY: resizeFactorY,
      mouseX: this.state.mouseX * xPercentageChange,
      mouseY: this.state.mouseY * yPercentageChange,
    })
  }
  componentDidMount() {
    const { width, height, projection, zoom } = this.props

    const resizeFactorX = calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().width, width)
    const resizeFactorY = calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().height, height)

    this.setState({
      resizeFactorX: resizeFactorX,
      resizeFactorY: resizeFactorY,
      mouseX: calculateMousePosition("x", projection, this.props, zoom, resizeFactorX),
      mouseY: calculateMousePosition("y", projection, this.props, zoom, resizeFactorY),
    })

    window.addEventListener("resize", this.handleResize)
    window.addEventListener('mouseup', this.handleMouseUp)
    this.zoomableGroupNode.addEventListener("touchmove", this.preventTouchScroll)
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
    window.removeEventListener("mouseup", this.handleMouseUp)
    this.zoomableGroupNode.removeEventListener("touchmove", this.preventTouchScroll)
  }
  render() {
    const {
      width,
      height,
      zoom,
      style,
      projection,
      children,
    } = this.props

    const {
      mouseX,
      mouseY,
      resizeFactorX,
      resizeFactorY,
    } = this.state

    return (
      <g className="rsm-zoomable-group"
         ref={ zoomableGroupNode => this.zoomableGroupNode = zoomableGroupNode }
         transform={`
           translate(
             ${ Math.round((width / 2 + resizeFactorX * mouseX) * 100) / 100 }
             ${ Math.round((height / 2 + resizeFactorY * mouseY) * 100) / 100 }
           )
           scale(${ zoom })
           translate(${ -width / 2 } ${ -height / 2 })
         `}
         onMouseMove={ this.handleMouseMove }
         onMouseUp={ this.handleMouseUp }
         onMouseDown={ this.handleMouseDown }
         onTouchStart={ this.handleTouchStart }
         onTouchMove={ this.handleTouchMove }
         onTouchEnd={ this.handleMouseUp }
         style={ style }
      >
        <rect
          x={ this.state.backdrop.x }
          y={ this.state.backdrop.y }
          width={ this.state.backdrop.width }
          height={ this.state.backdrop.height }
          fill="transparent"
          style={{ strokeWidth: 0 }}
        />
        { createNewChildren(children, this.props) }
      </g>
    )
  }
}

ZoomableGroup.defaultProps = {
  center: [ 0, 0 ],
  backdrop: {
    x: [-179.9, 179.9],
    y: [89.9, -89.9],
  },
  zoom: 1,
  disablePanning: false,
}

export default ZoomableGroup
