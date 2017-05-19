
import React, { Component } from "react"

import projections from "./projections"
import defaultProjectionConfig from "./projectionConfig"

class ComposableMap extends Component {
  constructor() {
    super()
    this.projection = this.projection.bind(this)
  }
  projection() {
    const {
      projection,
      projectionConfig,
      width,
      height,
    } = this.props

    return typeof projection !== "function" ?
      projections(width, height, projectionConfig, projection) :
      projection(width, height, projectionConfig)
  }
  render() {

    const {
      width,
      height,
      style,
      showCenter,
      children,
    } = this.props

    return (
      <svg width={ width }
           height={ height }
           viewBox={ `0 0 ${width} ${height}` }
           className="rsm-svg"
           style={ style }>
        {
          React.cloneElement(this.props.children, {
            projection: this.projection,
            width,
            height,
          })
        }
        {
          showCenter && (
            <g>
              <rect x={width/2-0.5} y={0} width={ 1 } height={ height } fill="#e91e63" />
              <rect x={0} y={height/2-0.5} width={ width } height={ 1 } fill="#e91e63" />
            </g>
          )
        }
      </svg>
    )
  }
}

ComposableMap.defaultProps = {
  width: 800,
  height: 450,
  projection: "times",
  projectionConfig: defaultProjectionConfig,
}

export default ComposableMap
