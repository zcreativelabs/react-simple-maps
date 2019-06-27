
import React, { Component } from "react"
import {
  geoPath,
  geoGraticule,
} from "d3-geo"

import { roundPath } from "./utils"

const computeGraticule = (projection, step) =>
  geoPath().projection(projection)(geoGraticule().step(step)())

const computeOutline = (projection) =>
  geoPath().projection(projection)(geoGraticule().outline())

class Graticule extends Component {
  constructor() {
    super()
    this.state = {
      renderGraticule: false,
      graticulePath: "",
      outlinePath: "",
    }
    this.renderGraticule = this.renderGraticule.bind(this)
  }
  componentDidMount() {
    this.renderGraticule()
  }
  renderGraticule() {

    const {
      step,
      projection,
      round,
      precision,
    } = this.props

    this.setState({
      renderGraticule: true,
      graticulePath: round
        ? roundPath(computeGraticule(projection, step), precision)
        : computeGraticule(projection, step),
      outlinePath: round
        ? roundPath(computeOutline(projection), precision)
        : computeOutline(projection),
    })
  }
  componentDidUpdate(prevProps) {
    const {
      step,
      projection,
      round,
      precision,
      globe,
    } = this.props

    if (prevProps.round !== round || prevProps.precision !== precision || globe) {
      this.setState({
        graticulePath: prevProps.round
          ? roundPath(computeGraticule(projection, step), precision)
          : computeGraticule(projection, step),
        outlinePath: prevProps.round
          ? roundPath(computeOutline(projection), precision)
          : computeOutline(projection),
      })
    }
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.disableOptimization
  }
  render() {

    const {
      zoom,
      style,
      outline,
      fill,
      stroke,
    } = this.props

    return this.state.renderGraticule && (
      <g className="rsm-graticule">
        <path
          fill={fill}
          stroke={stroke}
          d={this.state.graticulePath}
          style={style}
        />
        {
          outline && (
            <path
              fill={fill}
              stroke={stroke}
              d={this.state.outlinePath}
              style={style}
            />
          )
        }
      </g>
    )
  }
}

Graticule.defaultProps = {
  componentIdentifier: "Graticule",
  disableOptimization: true,
  globe: false,
  round: true,
  precision: 0.1,
  step: [10,10],
  outline: true,
  stroke: "#DDDDDD",
  fill: "transparent",
  style: {
    pointerEvents: "none",
  },
}

export default Graticule
