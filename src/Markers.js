
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
          !children ?
            null :
            children.length === undefined ?
              React.cloneElement(children, {
                projection,
              }) :
              children.map((child, i) =>
                !child ?
                  null :
                  React.cloneElement(child, {
                    key: child.key || `marker-${i}`,
                    projection,
                  })
              )
        }
      </g>
    )
  }
}

Markers.defaultProps = {
  componentIdentifier: "Markers",
}

export default Markers
