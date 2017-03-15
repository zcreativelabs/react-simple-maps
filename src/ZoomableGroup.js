
import React, { PropTypes } from "react"
import defaultStyles from "./defaultStyles"

class ZoomableGroup extends React.Component {
  render() {

    const {
      zoom,
      mouseX,
      mouseY,
      width,
      height,
      isPressed,
      center,
    } = this.props

    return (
      <g
        transform={`
          translate(
            ${ (width / 2) + this.props.resizeFactorX * mouseX }
            ${ (height / 2) + this.props.resizeFactorY * mouseY }
          )
          scale(${ zoom })
          translate(${ -width / 2 } ${ -height / 2 })
        `}
        style={ this.props.styles.geographies ? this.props.styles.geographies(zoom) : defaultStyles.geographies(zoom) }
        onMouseMove={ this.props.handleMouseMove }
        onMouseUp={ this.props.handleMouseUp }
        onMouseDown={ this.props.handleMouseDown }
        className="rsm-zoomable-group"
      >
        <rect x={0} y={0} width={width} height={height} fill="transparent" />
        { this.props.children }
      </g>
    )
  }
}

ZoomableGroup.propTypes = {
  zoom: PropTypes.number.isRequired,
  mouseX: PropTypes.number.isRequired,
  mouseY: PropTypes.number.isRequired,
  isPressed: PropTypes.bool.isRequired,
  styles: PropTypes.object,
  center: PropTypes.array,
}

ZoomableGroup.defaultProps = {
  styles: defaultStyles,
  center: [0,0],
}

export default ZoomableGroup
