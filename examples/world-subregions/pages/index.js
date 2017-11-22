
import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"
import chroma from "chroma-js"

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

const colorScale = chroma
  .scale([
    '#FF6E40',
    'FFD740',
    '#00B8D4',
  ])
  .mode('lch')
  .colors(24)

  const subregions = [
    "Southern Asia",
    "Polynesia",
    "Micronesia",
    "Southern Africa",
    "Central Asia",
    "Melanesia",
    "Western Europe",
    "Central America",
    "Seven seas (open ocean)",
    "Northern Africa",
    "Caribbean",
    "South-Eastern Asia",
    "Eastern Africa",
    "Australia and New Zealand",
    "Eastern Europe",
    "Western Africa",
    "Southern Europe",
    "Eastern Asia",
    "South America",
    "Middle Africa",
    "Antarctica",
    "Northern Europe",
    "Northern America",
    "Western Asia",
  ]

class SubregionsMap extends Component {
  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projectionConfig={{
            scale: 205,
            rotation: [-11,0,0],
          }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup center={[0,20]}>
            <Geographies geography={ "/static/world-50m-with-population.json" }>
              {(geographies, projection) =>
                geographies.map((geography, i) => (
                  <Geography
                    key={ i }
                    geography={ geography }
                    projection={ projection }
                    onClick={ this.handleClick }
                    style={{
                      default: {
                        fill: colorScale[subregions.indexOf(geography.properties.subregion)],
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      hover: {
                        fill: chroma(colorScale[subregions.indexOf(geography.properties.subregion)]).darken(0.5),
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      pressed: {
                        fill: chroma(colorScale[subregions.indexOf(geography.properties.subregion)]).brighten(0.5),
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      }
                    }}
                  />
              ))}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default SubregionsMap
