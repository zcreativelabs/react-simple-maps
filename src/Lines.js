
import React, { Component } from "react"

class Lines extends Component {
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
      <g className="rsm-lines" style={ style }>
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
                    key: child.key || `line-${i}`,
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

Lines.defaultProps = {
  componentIdentifier: "Lines",
}

export default Lines
