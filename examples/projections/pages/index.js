
import React, { Component } from "react"
import WorldMap from "../components/WorldMap"

const projections = [
  {
    id: "times",
    name: "Times Projection",
    scale: 200,
    url: "https://github.com/d3/d3-geo-projection#geoTimes",
  },
  {
    id: "robinson",
    name: "Robinson Projection",
    scale: 160,
    url: "https://github.com/d3/d3-geo-projection#geoRobinson",
  },
  {
    id: "eckert4",
    name: "Eckert IV Projection",
    scale: 190,
    url: "https://github.com/d3/d3-geo-projection#geoEckert4",
  },
  {
    id: "winkel3",
    name: "Winkel Tripel Projection",
    scale: 190,
    url: "https://github.com/d3/d3-geo-projection#geoWinkel3",
  },
  {
    id: "miller",
    name: "Miller Projection",
    scale: 150,
    url: "https://github.com/d3/d3-geo-projection#geoMiller",
  },
  {
    id: "mercator",
    name: "Mercator Projection",
    scale: 120,
    url: "https://github.com/d3/d3-geo-projection#geoMercator",
  },
]

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
  fontFamily: "Roboto, sans-serif",
  textAlign: "center",
}

class BasicMap extends Component {
  render() {
    return (
      <div style={wrapperStyles}>
        {
          projections.map(projection => (
            <div key={projection.id} style={{ padding: "2rem 0" }}>
              <WorldMap
                projection={projection.id}
                scale={projection.scale}
              />
              <div>
                <h1 style={{ fontSize: "1rem", margin: "1rem 0" }}>
                  <a href={projection.url} target="_blank">
                    { projection.name }
                  </a>
                </h1>
              </div>
            </div>
          ))
        }

      </div>
    )
  }
}

export default BasicMap
