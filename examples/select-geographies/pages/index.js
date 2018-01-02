
import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"

const wrapperStyles = {
  fontFamily: "Roboto, sans-serif",
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

const tagStyles = {
  display: "inline-block",
  background: "#ECEFF1",
  padding: "0.25rem 0.5rem",
  margin: "0 0.125rem 0.125rem 0",
}

class WorldMap extends Component {
  constructor() {
    super()
    this.state = {
      selected: [],
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(geo) {
    const isSelected = this.state.selected.indexOf(geo.properties.ISO_A3) !== -1
    this.setState({
      selected: isSelected
        ? this.state.selected.reduce((acc, cur) => {
            if (geo.properties.ISO_A3 !== cur) acc.push(cur)
            return acc
          }, [])
        : this.state.selected.concat([geo.properties.ISO_A3])
    })
  }
  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projectionConfig={{ scale: 205 }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup>
            <Geographies geography="/static/world-50m-simplified.json" disableOptimization>
              {(geos, proj) =>
                geos.map((geo, i) => {

                  const isSelected = this.state.selected.indexOf(geo.properties.ISO_A3) !== -1

                  return (
                    <Geography
                      key={geo.properties.ISO_A3 + i}
                      cacheId={geo.properties.ISO_A3 + i}
                      geography={geo}
                      projection={proj}
                      onClick={this.handleClick}
                      style={{
                        default: {
                          fill: isSelected ? "#FF5722" : "#ECEFF1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        hover: {
                          fill: isSelected ? "#E64A19" : "#607D8B",
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
        <div>
          {
            this.state.selected.length > 0
            ?
              this.state.selected.map(item =>
                <div key={item} style={tagStyles}>
                  { item }
                </div>
              )
            :
              <div style={{ padding: "0.25rem 0.5rem" }}>
                { "No countries selected." }
              </div>
          }
        </div>
      </div>
    )
  }
}

export default WorldMap
