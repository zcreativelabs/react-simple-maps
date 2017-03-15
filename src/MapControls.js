
import React from "react"

class MapControls extends React.Component {
  render() {
    return (
      <div className="rsm-controls">
        <button onClick={ this.props.handleZoomIn } className="rsm-controls__zoom-in">Zoom in</button>
        <button onClick={ this.props.handleZoomOut } className="rsm-controls__zoom-out">Zoom out</button>
        <button onClick={ this.props.handleZoomReset } className="rsm-controls__zoom-reset">Zoom Reset</button>
      </div>
    )
  }
}

export default MapControls
