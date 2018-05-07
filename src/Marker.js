
import React, { Component } from "react"
import { geoLength } from "d3-geo"

class Marker extends Component {
  constructor() {
    super()

    this.state = {
      hover: false,
      pressed: false,
    }

    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseClick = this.handleMouseClick.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }
  handleMouseEnter(evt) {
    evt.persist()
    const { onMouseEnter, marker } = this.props
    this.setState({
      hover: true,
    }, () => onMouseEnter && onMouseEnter(marker, evt))
  }
  handleMouseMove(evt) {
    evt.persist()
    if (this.state.pressed) return
    const { onMouseMove, marker } = this.props
    if (!this.state.hover) {
      this.setState({
        hover: true
      }, () => onMouseMove && onMouseMove(marker, evt))
    }
    else if (onMouseMove) onMouseMove(marker, evt)
    else return
  }
  handleMouseLeave(evt) {
    evt.persist()
    const { onMouseLeave, marker } = this.props
    this.setState({
      hover: false,
    }, () => onMouseLeave && onMouseLeave(marker, evt))
  }
  handleMouseDown(evt) {
    evt.persist()
    const { onMouseDown, marker } = this.props
    this.setState({
      pressed: true,
    }, () => onMouseDown && onMouseDown(marker, evt))
  }
  handleMouseUp(evt) {
    evt.persist()
    const { onMouseUp, marker } = this.props
    this.setState({
      pressed: false,
    }, () => onMouseUp && onMouseUp(marker, evt))
  }
  handleMouseClick(evt) {
    if (!this.props.onClick) return
    evt.persist()
    const { onClick, marker, projection } = this.props
    return onClick && onClick(marker, projection(marker.coordinates), evt)
  }
  handleFocus(evt) {
    evt.persist()
    const { onFocus, marker } = this.props
    this.setState({
      hover: true,
    }, () => onFocus && onFocus(marker, evt))
  }
  handleBlur(evt) {
    evt.persist()
    const { onBlur, marker } = this.props
    this.setState({
      hover: false,
    }, () => onBlur && onBlur(marker, evt))
  }
  render() {

    const {
      projection,
      marker,
      style,
      tabable,
      zoom,
      children,
      preserveMarkerAspect,
      width,
      height,
    } = this.props

    const {
      pressed,
      hover,
    } = this.state

    const scale = preserveMarkerAspect ? ` scale(${1/zoom})` : ""
    const translation = projection(marker.coordinates)

    const lineString = {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          projection.invert([width/2,height/2]),
          marker.coordinates,
        ],
      },
    }

    const radians = Math.PI/2, degrees = 90
    const isGlobe = projection.clipAngle && projection.clipAngle() === degrees
    const isHidden = isGlobe && geoLength(lineString) > radians

    return (
      <g className={ `rsm-marker${ pressed ? " rsm-marker--pressed" : "" }${ hover ? " rsm-marker--hover" : "" }` }
         transform={ `translate(
           ${ translation[0] }
           ${ translation[1] }
         ) ${scale}`}
         style={ style[isHidden ? "hidden" : (pressed || hover ? (pressed ? "pressed" : "hover") : "default")] }
         onMouseEnter={ this.handleMouseEnter }
         onMouseLeave={ this.handleMouseLeave }
         onMouseDown={ this.handleMouseDown }
         onMouseUp={ this.handleMouseUp }
         onClick={ this.handleMouseClick }
         onMouseMove={ this.handleMouseMove }
         onFocus={ this.handleFocus }
         onBlur={ this.handleBlur }
         tabIndex={ tabable ? 0 : -1 }
       >
        { children }
      </g>
    )
  }
}

Marker.defaultProps = {
  style: {
    default: {},
    hover: {},
    pressed: {},
  },
  marker: {
    coordinates: [0,0],
  },
  tabable: true,
  preserveMarkerAspect: true,
}

export default Marker
