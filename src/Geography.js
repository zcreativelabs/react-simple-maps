
import React, { Component } from "react"
import { geoPath } from "d3-geo"

import { roundPath } from "./utils"

class Geography extends Component {
  constructor() {
    super()

    this.state = {
      hover: false,
      pressed: false,
    }

    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseClick = this.handleMouseClick.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }
  handleMouseClick(evt) {
    evt.persist()
    const { onClick, geography } = this.props
    return onClick && onClick(geography, evt)
  }
  handleMouseEnter(evt) {
    evt.persist()
    const { onMouseEnter, geography } = this.props
    this.setState({
      hover: true,
    }, () => onMouseEnter && onMouseEnter(geography, evt))
  }
  handleMouseMove(evt) {
    evt.persist()
    if (this.state.pressed) return
    const { onMouseMove, geography } = this.props
    if (!this.state.hover) {
      this.setState({
        hover: true,
      }, () => onMouseMove && onMouseMove(geography, evt))
    }
    else if (onMouseMove) onMouseMove(geography, evt)
    else return
  }
  handleMouseLeave(evt) {
    evt.persist()
    const { onMouseLeave, geography } = this.props
    this.setState({
      hover: false,
    }, () => onMouseLeave && onMouseLeave(geography, evt))
  }
  handleMouseDown(evt) {
    evt.persist()
    const { onMouseDown, geography } = this.props
    this.setState({
      pressed: true,
    }, () => onMouseDown && onMouseDown(geography, evt))
  }
  handleMouseUp(evt) {
    evt.persist()
    const { onMouseUp, geography } = this.props
    this.setState({
      pressed: false,
    }, () => onMouseUp && onMouseUp(geography, evt))
  }
  handleFocus(evt) {
    evt.persist()
    const { onFocus, geography } = this.props
    this.setState({
      hover: true,
    }, () => onFocus && onFocus(geography, evt))
  }
  handleBlur(evt) {
    evt.persist()
    const { onBlur, geography } = this.props
    this.setState({
      hover: false,
    }, () => onBlur && onBlur(geography, evt))
  }
  render() {

    const {
      geography,
      projection,
      round,
      precision,
      tabable,
      style,
    } = this.props

    const {
      hover,
      pressed,
    } = this.state

    const pathString = geoPath().projection(projection())(geography)

    return (
      <path
        d={ round ? roundPath(pathString, precision) : pathString }
        className={ `rsm-geography${ pressed && " rsm-geography--pressed" }${ hover && " rsm-geography--hover" }` }
        style={ style[pressed || hover ? (pressed ? "pressed" : "hover") : "default"] }
        onClick={ this.handleMouseClick }
        onMouseEnter={ this.handleMouseEnter }
        onMouseMove={ this.handleMouseMove }
        onMouseLeave={ this.handleMouseLeave }
        onMouseDown={ this.handleMouseDown }
        onMouseUp={ this.handleMouseUp }
        onFocus={ tabable && this.handleFocus }
        onBlur={ tabable && this.handleBlur }
        tabIndex={ tabable ? 0 : -1 }
      />
    )
  }
}

Geography.defaultProps = {
  precision: 0.1,
  round: true,
  tabable: true,
  style: {
    default: {},
    hover: {},
    pressed: {},
  }
}

export default Geography
