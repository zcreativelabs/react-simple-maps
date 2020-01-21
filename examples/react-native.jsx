import React from "react"
import PropTypes from "prop-types"
import { View, StyleSheet } from "react-native"
import { ZoomableMap, Geographies, Geography, Marker, Markers } from "react-native-simple-maps"

import Svg from "react-native-svg"

const geoFile = require("./russia-with-crimea.json")

const FILL_COLOR = "#6A717C"
const STROKE_COLOR = "#363E43"

const MARKER_ICON_SIZE = 21
const LONG_PRES_DELAY = 250

const MAX_ZOOM = 1.8
const MIN_ZOOM = 0.9
const DEFAULT_ZOOM = 1.15

const MAP_WIDTH = 2000
const MAP_HEIGHT = MAP_WIDTH * 0.5

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    zIndex: -100,
  },
  mapWrapper: {
    height: "100%",
    width: "100%",
  },
})

export class MapComponent extends React.Component {
  static propTypes = {
    markers: PropTypes.arrayOf(
      PropTypes.shape({
        coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
    enableZoom: PropTypes.bool,
  }

  static defaultProps = {
    markers: [],
    enableZoom: true,
  }
  zoomableProjectionConfig = {
    xOffset: -MAP_WIDTH / 2 - 75,
    yOffset: MAP_HEIGHT - 90,
    precision: 0.001,
    scale: MAP_WIDTH / 2,
    rotation: [-10, 0, -10],
    projection: "geoConicEqualArea",
  }

  staticProjectionConfig = {
    xOffset: -700,
    yOffset: 1000,
    precision: 0.1,
    scale: 950,
    rotation: [-10, 0, 0],
  }

  onLongPress = (id, nativeEvent, geo) => {
    console.log("onLongPress", id, nativeEvent, geo)
  }

  onPressOut = (...args) => console.log("onPressOut", args)

  renderGeographies = (geographies, projection) => {
    return geographies.map(geography => {
      const id = geography.properties.HASC_1
      const style = {
        fill: FILL_COLOR,
        stroke: STROKE_COLOR,
        strokeWidth: 0.75,
        outline: "none",
        fillRule: "evenodd",
      }

      return (
        <Geography
          key={id}
          onLongPress={(geo, event) => this.onLongPress(id, event.nativeEvent, geo)}
          onPressOut={this.onPressOut}
          delayLongPress={LONG_PRES_DELAY}
          geography={geography}
          projection={projection}
          style={{
            default: style,
            pressed: style,
          }}
        />
      )
    })
  }

  renderMarker = (marker, i) => (
    <Marker key={marker.id || i} marker={marker}>
      <Svg
        width={MARKER_ICON_SIZE}
        height={MARKER_ICON_SIZE}
        viewBox={`0 0 ${MARKER_ICON_SIZE} ${MARKER_ICON_SIZE}`}
        fill="none"
      >
        <Svg.Circle cx={MARKER_ICON_SIZE / 2} cy={MARKER_ICON_SIZE / 2} r={MARKER_ICON_SIZE / 2} fill="#FF6464" />
      </Svg>
    </Marker>
  )

  render() {
    const { markers, enableZoom } = this.props

    const projectionConfig = !enableZoom ? this.staticProjectionConfig : this.zoomableProjectionConfig

    return (
      <View style={styles.container}>
        <View style={styles.mapWrapper}>
          <ZoomableMap
            width={MAP_WIDTH - 400}
            height={MAP_HEIGHT - 210}
            projectionConfig={projectionConfig}
            minScale={MIN_ZOOM}
            maxScale={MAX_ZOOM}
            initialZoom={DEFAULT_ZOOM}
            canvasStyle={{ backgroundColor: "transparent" }}
            viewStyle={{ backgroundColor: "transparent" }}
            disabled={!enableZoom}
          >
            <Geographies geography={geoFile} disableOptimization>
              {(geographies, projection) => this.renderGeographies(geographies, projection)}
            </Geographies>

            <Markers>{markers.map(this.renderMarker)}</Markers>
          </ZoomableMap>
        </View>
      </View>
    )
  }
}
