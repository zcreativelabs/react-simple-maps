
import React, { Component } from "react"
import {
  geoPath,
  geoGraticule,
} from "d3-geo"

import { roundPath } from "./utils"

const graticuleCache = {}

class Graticule extends Component {
  constructor() {
    super()
    this.state = {
      renderGraticule: false,
    }
    this.renderGraticule = this.renderGraticule.bind(this)
  }
  componentDidMount() {
    this.renderGraticule()
  }
  renderGraticule() {
    this.setState({
      renderGraticule: true,
    })
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.disableOptimization
  }
  render() {

    const {
      zoom,
      projection,
      round,
      precision,
      style,
      step,
      outline,
      fill,
      stroke,
    } = this.props

    const graticulePath = graticuleCache.graticule || geoPath()
      .projection(projection())(geoGraticule().step(step)())
    const graticuleOutline = graticuleCache.outline || geoPath()
      .projection(projection())(geoGraticule().outline())

    if (!graticuleCache.graticule) graticuleCache.graticule = graticulePath
    if (!graticuleCache.outline) graticuleCache.outline = graticuleOutline

    return this.state.renderGraticule && (
      <g className="rsm-graticule">
        <path
          fill={fill}
          stroke={stroke}
          d={round ? roundPath(graticulePath, precision) : graticulePath}
          style={style}
        />
        {
          outline && (
            <path
              fill={fill}
              stroke={stroke}
              d={round ? roundPath(graticuleOutline, precision) : graticuleOutline}
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
