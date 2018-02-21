
import React, { Component } from "react"

class Annotations extends Component {
  render() {

    const {
      children,
      projection,
      style,
      width,
      height,
    } = this.props

    return (
      <g className="rsm-annotations" style={ style }>
        {
          !children ?
            null :
            children.length === undefined ?
              React.cloneElement(children, {
                projection,
                width,
                height,
              }) :
              children.map((child, i) =>
                !child ?
                  null :
                  React.cloneElement(child, {
                    key: child.key || `annotation-${i}`,
                    projection,
                    width,
                    height,
                  })
              )
        }
      </g>
    )
  }
}

Annotations.defaultProps = {
  componentIdentifier: "Annotations",
}

export default Annotations
