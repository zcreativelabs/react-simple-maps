
import React, { Component } from "react"
import { geoPath } from "d3-geo"

import { roundPath } from "./utils"

const pathCache = {}

const renderPath = (cacheId, geography, projection, round, precision) => {
  if (pathCache[cacheId]) return pathCache[cacheId]

  const pathString = cacheId
    ? pathCache[cacheId]
      ? pathCache[cacheId]
      : round
        ? roundPath(geoPath().projection(projection())(geography), precision)
        : geoPath().projection(projection())(geography)
    : round
      ? roundPath(geoPath().projection(projection())(geography), precision)
      : geoPath().projection(projection())(geography)

  if (cacheId) pathCache[cacheId] = pathString

  return pathString
}

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
      pressed: false,
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
      cacheId,
      precision,
      tabable,
      style,
    } = this.props

    const {
      hover,
      pressed,
    } = this.state

    const pathString = renderPath(cacheId, geography, projection, round, precision)

    const excludeProps = [
      "geography",
      "projection",
      "round",
      "cacheId",
      "precision",
      "tabable",
      "style",
      "onClick",
      "onMouseEnter",
      "onMouseMove",
      "onMouseLeave",
      "onMouseDown",
      "onMouseUp",
      "onFocus",
      "onBlur",
    ]

    const restProps = Object.keys(this.props)
      .filter(key => excludeProps.indexOf(key) === -1)
      .reduce((obj, key) => {
        obj[key] = this.props[key]
        return obj
      }, {})

    return (
      <path
        d={ pathString }
        className={ `rsm-geography${ pressed ? " rsm-geography--pressed" : "" }${ hover ? " rsm-geography--hover" : "" }` }
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
        { ...restProps }
      />
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
    hover: {},
    pressed: {},
  }
}

export default Geography
