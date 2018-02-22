
import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGlobe,
  Geographies,
  Geography,
  Graticule,
  Markers,
  Marker,
} from "react-simple-maps"
import { scaleLinear } from "d3-scale"

import cities from "../static/world-most-populous-cities.json"

const populationScale = scaleLinear()
  .domain([10750000,37843000])
  .range([5,22])

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

class AlbersUSA extends Component {
  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projection="orthographic"
          projectionConfig={{
            scale: 300,
          }}
          width={800}
          height={800}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGlobe center={[96,32]}>
            <circle cx={400} cy={400} r={300} fill="transparent" stroke="#eceff1" />
            <Geographies geography="/static/world-110m.json" disableOptimization>
              {(geographies, projection) =>
                geographies.map((geography, i) => {
                  return (
                    <Geography
                      key={i}
                      round
                      geography={geography}
                      projection={projection}
                      style={{
                        default: {
                          fill: "#eceff1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        hover: {
                          fill: "#eceff1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#eceff1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                      }}
                    />
                  )
                }
              )}
            </Geographies>
            <Markers>
              {
                cities.map(city => {
                  const radius = populationScale(city.population)
                  return (
                    <Marker
                      key={city.name}
                      marker={city}
                      style={{
                        default: { opacity: 0.8 },
                        hidden: { display: "none" },
                      }}>
                      <circle
                        cx={0}
                        cy={0}
                        r={radius}
                        fill="#FF5722"
                        stroke="#FFF"
                      />
                      <circle
                        cx={0}
                        cy={0}
                        r={radius + 2}
                        fill="transparent"
                        stroke="#FF5722"
                      />
                    </Marker>
                  )
                })
              }
            </Markers>
          </ZoomableGlobe>
        </ComposableMap>
      </div>
    )
  }
}

export default AlbersUSA
