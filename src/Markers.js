
import React, { PropTypes } from "react"
import defaultStyles from "./defaultStyles"
import Marker from "./Marker"

class Markers extends React.Component {
  render() {
    return (
      <g className="rsm-markers">
        {
          this.props.markers.map((marker, i) => (
            <Marker
              key={ `${Math.abs(marker.coordinates[0])}-${Math.abs(marker.coordinates[1])}-${i}` }
              projection={ this.props.projection }
              marker={ marker }
              styles={ this.props.styles.marker }
              events={ this.props.events }
              zoom={ this.props.zoom }
            />
          ))
        }
      </g>
    )
  }
}

Markers.propTypes = {
  markers: PropTypes.array,
  projection: PropTypes.func.isRequired,
  zoom: PropTypes.number,
  events: PropTypes.object,
  styles: PropTypes.object,
}

Markers.defaultProps = {
  markers: [],
  zoom: 1,
  events: {},
  styles: defaultStyles,
}

export default Markers
