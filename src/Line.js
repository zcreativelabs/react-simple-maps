import React, { Component } from "react"
import { geoLength } from "d3-geo"

class Line extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false,
      pressed: false
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
    const { onMouseEnter, line } = this.props
    this.setState(
      {
        hover: true
      },
      () => onMouseEnter && onMouseEnter(line, evt)
    )
  }
  handleMouseMove(evt) {
    evt.persist()
    if (this.state.pressed) return
    const { onMouseMove, line } = this.props
    if (!this.state.hover) {
      this.setState(
        {
          hover: true
        },
        () => onMouseMove && onMouseMove(line, evt)
      )
    } else if (onMouseMove) onMouseMove(line, evt)
    else return
  }
  handleMouseLeave(evt) {
    evt.persist()
    const { onMouseLeave, line } = this.props
    this.setState(
      {
        hover: false
      },
      () => onMouseLeave && onMouseLeave(line, evt)
    )
  }
  handleMouseDown(evt) {
    evt.persist()
    const { onMouseDown, line } = this.props
    this.setState(
      {
        pressed: true
      },
      () => onMouseDown && onMouseDown(line, evt)
    )
  }
  handleMouseUp(evt) {
    evt.persist()
    const { onMouseUp, line } = this.props
    this.setState(
      {
        pressed: false
      },
      () => onMouseUp && onMouseUp(line, evt)
    )
  }
  handleMouseClick(evt) {
    if (!this.props.onClick) return
    evt.persist()
    const { onClick, line, projection } = this.props
    return (
      onClick &&
      onClick(
        line,
        [projection(line.coordinates.start), projection(line.coordinates.end)],
        evt
      )
    )
  }
  handleFocus(evt) {
    evt.persist()
    const { onFocus, line } = this.props
    this.setState(
      {
        hover: true
      },
      () => onFocus && onFocus(line, evt)
    )
  }
  handleBlur(evt) {
    evt.persist()
    const { onBlur, line } = this.props
    this.setState(
      {
        hover: false
      },
      () => onBlur && onBlur(line, evt)
    )
  }
  render() {
    const {
      className,
      projection,
      line,
      style,
      tabable,
      zoom,
      preserveMarkerAspect,
      width,
      height,
      buildPath,
      strokeWidth
    } = this.props

    const { pressed, hover } = this.state

    const scale = preserveMarkerAspect ? ` scale(${1 / zoom})` : ""

    const buildLineString = coordinates => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [projection.invert([width / 2, height / 2]), coordinates]
      }
    })
    const startLineString = buildLineString(line.coordinates.start)
    const endLineString = buildLineString(line.coordinates.end)

    const radians = Math.PI/2, degrees = 90
    const isGlobe = projection.clipAngle && projection.clipAngle() === degrees
    const isHidden = isGlobe && (geoLength(startLineString) > radians || geoLength(endLineString) > radians)

    const start = projection(line.coordinates.start)
    const end = projection(line.coordinates.end)

    const path = buildPath
      ? buildPath(start, end, line)
      : `M ${start.join(" ")} L ${end.join(" ")}`

    return (
      <path
        className={`rsm-line${pressed ? " rsm-line--pressed" : ""}${
          hover ? " rsm-line--hover" : ""
          } ${className}`}
        transform={`${scale}`}
        style={
          style[
            isHidden
              ? "hidden"
              : pressed || hover ? (pressed ? "pressed" : "hover") : "default"
            ]
        }
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onClick={this.handleMouseClick}
        onMouseMove={this.handleMouseMove}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        tabIndex={tabable ? 0 : -1}
        d={path}
        strokeWidth={strokeWidth}
      />
    )
  }
}

Line.defaultProps = {
  style: {
    default: {},
    hover: {},
    pressed: {}
  },
  line: {
    coordinates: {
      start: [0, 0],
      end: [-99.1, 19.4]
    }
  },
  tabable: true,
  preserveMarkerAspect: true,
  strokeWidth: 1,
  className: "",
}

export default Line
