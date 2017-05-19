
import React, { Component } from "react"

class Markers extends Component {
  render() {

    const {
      children,
      projection,
      style,
    } = this.props

    return (
      <g className="rsm-markers" style={ style }>
        {
          !children.length ?
            React.cloneElement(children, {
              projection,
            }) :
            children.map((child, i) => (
              React.cloneElement(child, {
                key: child.key || `marker-${i}`,
                projection,
              })
            ))
        }
      </g>
    )
  }
}

Markers.defaultProps = {
  componentIdentifier: "Markers",
}

export default Markers
