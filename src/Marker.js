
import React, { Component, PropTypes } from "react"
import defaultStyles from "./defaultStyles"

class Marker extends Component {
  constructor() {
    super()

    this.state = {
      hovered: false,
    }

    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  handleMouseEnter(marker, evt) {
    evt.preventDefault()
    this.setState({ hovered: true })
    if(this.props.events.onMouseEnter) {
      this.props.events.onMouseEnter(marker, evt)
    }
  }
  handleMouseLeave(marker, evt) {
    evt.preventDefault()
    this.setState({ hovered: false })
    if(this.props.events.onMouseLeave) {
      this.props.events.onMouseLeave(marker, evt)
    }
  }
  handleMouseMove(marker, evt) {
    evt.preventDefault()
    if(this.props.events.onMouseMove) {
      this.props.events.onMouseMove(marker, evt)
    }
  }
  handleClick(marker, evt) {
    evt.preventDefault()
    if(this.props.events.onClick) {
      this.props.events.onClick(marker, evt)
    }
  }
  render() {
    const {
      marker,
      styles,
      zoom,
      projection,
    } = this.props

    return (
      <circle
        cx={ projection()(marker.coordinates)[0] }
        cy={ projection()(marker.coordinates)[1] }
        r={ marker.radius }
        style={ styles(marker, zoom)[ this.state.hovered ? "hover" : "default" ] || styles(marker, zoom)["default"] }
        className="rsm-marker"
        onMouseEnter={ (evt) => this.handleMouseEnter(marker, evt) }
        onMouseLeave={ (evt) => this.handleMouseLeave(marker, evt) }
        onMouseMove={ (evt) => this.handleMouseMove(marker, evt) }
        onClick={ (evt) => this.handleClick(marker, evt) }
        transform={`
          translate(
            ${ projection()(marker.coordinates)[0] }
            ${ projection()(marker.coordinates)[1] }
          )
          scale(
            ${ 1/zoom }
          )
          translate(
            ${ -projection()(marker.coordinates)[0] }
            ${ -projection()(marker.coordinates)[1] }
          )
        `}
      />
    )
  }
}

Marker.propTypes = {
  marker: PropTypes.object,
  zoom: PropTypes.number,
  events: PropTypes.object,
  projection: PropTypes.func,
  styles: PropTypes.func,
}

Marker.defaultProps = {
  marker: {},
  zoom: 1,
  events: {},
  styles: defaultStyles.marker,
}

export default Marker
