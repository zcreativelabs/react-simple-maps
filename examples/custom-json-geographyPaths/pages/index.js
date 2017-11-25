
import React, { Component } from "react"
import { get } from "axios"
import { feature } from "topojson-client"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
  fontFamily: "Roboto, sans-serif",
}

class CustomMap extends Component {
  constructor() {
    super()
    this.state = {
      geographyPaths: [],
    }
    this.loadPaths = this.loadPaths.bind(this)
  }
  componentDidMount() {
    this.loadPaths()
  }
  loadPaths() {
    get("/static/world-50m.json")
      .then(res => {
        if (res.status !== 200) return
        const world = res.data
        // Transform your paths with topojson however you want...
        const countries = feature(world, world.objects[Object.keys(world.objects)[0]]).features
        this.setState({ geographyPaths: countries })
      })
  }
  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projectionConfig={{
            scale: 160,
            rotation: [0,0,0],
          }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup>
            <Geographies geography={this.state.geographyPaths} disableOptimization>
              {(geographies, projection) =>
                geographies.map((geography, i) =>
                  <Geography
                    key={`${geography.properties.ADM0_A3}-${i}`}
                    cacheId={`path-${geography.properties.ADM0_A3}-${i}`}
                    round
                    geography={geography}
                    projection={projection}
                    style={{
                      default: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      hover: {
                        fill: "#607D8B",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      pressed: {
                        fill: "#FF5722",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                    }}
                  />
              )}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default CustomMap
