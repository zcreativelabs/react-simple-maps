
import React, { Component } from "react"

class Annotations extends Component {
  render() {

    const {
      children,
      projection,
      style,
    } = this.props

    return (
      <g className="rsm-annotations" style={ style }>
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
                    key: child.key || `annotation-${i}`,
                    projection,
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
