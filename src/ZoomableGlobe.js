
import React, { Component } from "react"
import { geoPath } from "d3-geo"

import { createNewChildren } from "./utils"

class ZoomableGlobe extends Component {
  constructor(props) {
    super(props)

    const initialRotation = props.projection.rotate()

    this.state = {
      mouseX: 0,
      mouseY: 0,
      mouseXStart: 0,
      mouseYStart: 0,
      isPressed: false,
      rotation: [
        initialRotation[0] - props.center[0],
        initialRotation[1] - props.center[1],
        initialRotation[2],
      ],
    }

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
  }
  handleMouseMove({ pageX, pageY, clientX, clientY }) {
    if (this.props.disablePanning) return
    if (!this.state.isPressed) return

    const differenceX = clientX - this.state.mouseXStart
    const differenceY = clientY - this.state.mouseYStart

    this.setState({
      mouseX: clientX,
      mouseY: clientY,
      mouseXStart: clientX,
      mouseYStart: clientY,
      rotation: [
        this.state.rotation[0] + (differenceX * this.props.sensitivity),
        this.state.rotation[1] - (differenceY * this.props.sensitivity),
        this.state.rotation[2],
      ],
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
    const newCenter = this.props.projection.invert([this.props.width/2,this.props.height/2])
    this.props.onMoveEnd(newCenter)
  }
  handleMouseDown({ pageX, pageY, clientX, clientY }) {
    if (this.props.disablePanning) return
    this.setState({
      isPressed: true,
      mouseXStart: clientX,
      mouseYStart: clientY,
    })
    if (!this.props.onMoveStart) return
    const currentCenter = this.props.projection.invert([this.props.width/2,this.props.height/2])
    this.props.onMoveStart(currentCenter)
  }
  handleTouchStart({ touches }) {
    if (touches.length > 1) {
      this.handleMouseDown(touches[0])
    }
    else {
      this.handleMouseUp()
    }
  }
  preventTouchScroll(evt) {
    if (evt.touches.length > 1) {
      evt.preventDefault()
    }
  }
  componentWillReceiveProps(nextProps) {
    const { mouseX, mouseY } = this.state
    const { projection, center, zoom } = this.props

    const zoomFactor = nextProps.zoom / zoom
    const centerChanged = JSON.stringify(nextProps.center) !== JSON.stringify(center)

    this.setState({
      zoom: nextProps.zoom,
      rotation: centerChanged ? [-nextProps.center[0], -nextProps.center[1], this.state.rotation[2]] : this.state.rotation,
    })
  }
  componentDidMount() {
    const { width, height, projection, zoom } = this.props

    window.addEventListener("resize", this.handleResize)
    window.addEventListener("mouseup", this.handleMouseUp)
    this.zoomableGlobeNode.addEventListener("touchmove", this.preventTouchScroll)
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
    window.removeEventListener("mouseup", this.handleMouseUp)
    this.zoomableGlobeNode.removeEventListener("touchmove", this.preventTouchScroll)
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
    } = this.state

    return (
      <g className="rsm-zoomable-globe"
         ref={ zoomableGlobeNode => this.zoomableGlobeNode = zoomableGlobeNode }
         transform={`
           translate(${ width / 2 } ${ height / 2 })
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
        { createNewChildren(children, {
            width,
            height,
            center: this.center,
            backdrop: this.backdrop,
            zoom: this.props.zoom,
            disablePanning: this.props.disablePanning,
            children,
            projection: projection.rotate(this.state.rotation),
          }) }
      </g>
    )
  }
}

ZoomableGlobe.defaultProps = {
  center: [ 0, 0 ],
  zoom: 1,
  disablePanning: false,
  sensitivity: 0.25,
}

export default ZoomableGlobe
