
import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import { csv } from "d3-fetch"

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

const colorScale = scaleLinear()
  .domain([500000,40000000])
  .range(["#FBE9E7","#FF5722"])

class AlbersUSA extends Component {
  constructor() {
    super()
    this.state = {
      population: [],
    }
  }
  componentDidMount() {
    csv("/static/population.csv")
      .then(population => {
        this.setState({ population })
      })
  }
  render() {

    const { population } = this.state

    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projection="albersUsa"
          projectionConfig={{
            scale: 1000,
          }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup disablePanning>
            <Geographies geography="/static/states.json" disableOptimization>
              {(geographies, projection) =>
                geographies.map((geography, i) => {
                  const statePopulation = population.find(s =>
                    s.name === geography.properties.NAME_1
                  ) || {}
                  return (
                    <Geography
                      key={`state-${geography.properties.ID_1}`}
                      cacheId={`state-${geography.properties.ID_1}`}
                      round
                      geography={geography}
                      projection={projection}
                      style={{
                        default: {
                          fill: colorScale(+statePopulation.pop),
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
                  )
                }
              )}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default AlbersUSA
