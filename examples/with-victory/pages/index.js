
import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from "react-simple-maps"
import { geoAlbers } from "d3-geo"
import { VictoryPie } from "victory"

import { cantons } from "../data"

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

class MapWithVictory extends Component {
  constructor() {
    super()
    this.state = {
      cantons: [],
    }
  }
  componentDidMount() {
    this.setState({
      cantons: cantons,
    })
  }
  projection(width, height) {
    return geoAlbers()
      .rotate([0,0])
      .center([8.3, 46.8])
      .scale(14000)
      .translate([width / 2, height / 2])
  }
  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projection={this.projection}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup center={[-8.3,-46.8]} disablePanning>
            <Geographies geography="/static/cantons.json">
              {(geographies, projection) =>
                geographies.map((geography, i) =>
                  <Geography
                    key={i}
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
            <Markers>
              {this.state.cantons.map((canton, i) => (
                <Marker
                  key={ `canton-${canton.id}` }
                  marker={ canton }
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      outline: "none",
                    },
                    pressed: {
                      outline: "none",
                    },
                  }}
                >
                  <g transform="translate(-15,-15)">
                    <circle cx={20} cy={20} r={21} fill="transparent" stroke="#607D8B" />
                    <circle cx={20} cy={20} r={9} fill="transparent" stroke="#607D8B" />
                    <VictoryPie
                      standalone={ false }
                      width={ 40 }
                      height={ 40 }
                      padding={ 0 }
                      innerRadius={ 10 }
                      style={{
                        labels: { fill: "transparent" },
                        data: { stroke: "#ECEFF1" },
                      }}
                      data={[
                        { x: null, y: canton.languages[0].value, fill: "#FF5722" },
                        { x: null, y: canton.languages[1].value, fill: "#00BCD4" },
                        { x: null, y: canton.languages[2].value, fill: "#FFC107" },
                        { x: null, y: canton.languages[3].value, fill: "#8BC34A" },
                      ]}
                    />
                  </g>
                </Marker>
              ))}
            </Markers>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default MapWithVictory
