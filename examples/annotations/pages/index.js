
import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Annotation,
} from "react-simple-maps"

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
  fontFamily: "Roboto, sans-serif",
}

class AnnotatedMap extends Component {
  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projectionConfig={{
            scale: 900,
            rotation: [0,0,0],
          }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup center={[-76,13.5]} disablePanning>
            <Geographies geography="/static/world-50m.json">
              {(geographies, projection) =>
                geographies.map((geography, i) => (
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
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      pressed: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                    }}
                  />
              ))}
            </Geographies>
            <Annotation
              dx={ 40 }
              dy={ -30 }
              subject={ [ -61.5, 16.3 ] }
              strokeWidth={ 1 }
              stroke="#607D8B"
              >
              <text>{ "Guadaloupe" }</text>
            </Annotation>
            <Annotation
              dx={ 40 }
              dy={ -18 }
              subject={ [ -61.3, 15.4 ] }
              strokeWidth={ 1 }
              stroke="#607D8B"
              >
              <text>{ "Dominica" }</text>
            </Annotation>
            <Annotation
              dx={ 40 }
              dy={ -4 }
              subject={ [ -61, 14.7 ] }
              strokeWidth={ 1 }
              stroke="#607D8B"
              >
              <text>{ "Matinique" }</text>
            </Annotation>
            <Annotation
              dx={ -40 }
              dy={ -20 }
              subject={ [ -61, 14 ] }
              strokeWidth={ 1 }
              stroke="#607D8B"
              >
              <text>{ "St. Lucia" }</text>
            </Annotation>
            <Annotation
              dx={ 40 }
              dy={ 10 }
              subject={ [ -59.5, 13.2 ] }
              strokeWidth={ 1 }
              stroke="#607D8B"
              >
              <text>{ "Barbados" }</text>
            </Annotation>
            <Annotation
              dx={ 60 }
              dy={ 35 }
              subject={ [ -61.1, 13.2 ] }
              strokeWidth={ 1 }
              stroke="#607D8B"
              >
              <text>{ "St. Vincent and" }</text>
              <text y={18}>{ "the Grenadines" }</text>
            </Annotation>
            <Annotation
              dx={ -35 }
              dy={ -15 }
              subject={ [ -61.7, 12.1 ] }
              strokeWidth={ 1 }
              stroke="#607D8B"
              >
              <text>{ "Grenada" }</text>
            </Annotation>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default AnnotatedMap
