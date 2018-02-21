
import React, { Component } from "react"

class Markers extends Component {
  render() {

    const {
      children,
      projection,
      style,
      zoom,
      width,
      height,
    } = this.props
    return (
      <g className="rsm-markers" style={ style }>
        {
          !children ?
            null :
            children.length === undefined ?
              React.cloneElement(children, {
                projection,
                zoom,
                width,
                height,
              }) :
              children.map((child, i) =>
                !child ?
                  null :
                  React.cloneElement(child, {
                    key: child.key || `marker-${i}`,
                    projection,
                    zoom,
                    width,
                    height,
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
