
import React, { PropTypes } from "react"
import { geoPath } from "d3-geo"
import defaultStyles from "./defaultStyles"
import { createChoroplethStyles } from "./utils"

class Geography extends React.Component {
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
  handleMouseEnter(geography, evt) {
    evt.preventDefault()
    this.setState({ hovered: true })
    if(this.props.events.onMouseEnter) {
      this.props.events.onMouseEnter(geography, evt)
    }
  }
  handleMouseLeave(geography, evt) {
    evt.preventDefault()
    this.setState({ hovered: false })
    if(this.props.events.onMouseLeave) {
      this.props.events.onMouseLeave(geography, evt)
    }
  }
  handleMouseMove(geography, evt) {
    evt.preventDefault()
    if(this.props.events.onMouseMove) {
      this.props.events.onMouseMove(geography, evt)
    }
  }
  handleClick(geography, evt) {
    evt.preventDefault()
    if(this.props.events.onClick) {
      this.props.events.onClick(geography, evt)
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const changedHoverState = this.state.hovered !== nextState.hovered
    const changedChoroplethValue = this.props.choroplethValue !== nextProps.choroplethValue
    const changedGeography = this.props.geography !== nextProps.geography
    return changedGeography || changedChoroplethValue || changedHoverState
  }
  render() {

    const {
      geography,
      projection,
      styles,
      choroplethValue,
    } = this.props

    return (
      <path
        d={ geoPath().projection(projection())(geography) }
        onMouseEnter={(evt) => this.handleMouseEnter(geography, evt) }
        onMouseLeave={(evt) => this.handleMouseLeave(geography, evt) }
        onMouseMove={(evt) => this.handleMouseMove(geography, evt) }
        onClick={(evt) => this.handleClick(geography, evt) }
        style={ styles(choroplethValue, geography)[ this.state.hovered ? "hover" : "default" ] || styles(choroplethValue, geography)["default"] }
        className="rsm-geography"
      />
    )
  }
}

Geography.propTypes = {
  geography: PropTypes.object.isRequired,
  projection: PropTypes.func.isRequired,
  choroplethValue: PropTypes.object,
  events: PropTypes.object,
}

Geography.defaultProps = {
  styles: defaultStyles.geography,
  events: {},
}

export default Geography
