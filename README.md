# react-simple-maps
An svg map component built with and for React. Please note that this is a work in progress!

### Why

`React-simple-maps` aims to make working with svg maps in react easier. It handles tasks such as panning, zooming and simple rendering optimization, and takes advantage of d3v4 and d3-geo instead of relying on the entire d3 library.

### Prerequisites and installation

Since `react-simple-maps` uses [d3-fetch](https://github.com/d3/d3-fetch) internally to fetch topojson files, you need to install [whatwg-fetch](http://github.github.io/fetch/) and [promise-polyfill](https://github.com/taylorhakes/promise-polyfill) depending on which browsers you need to support.

To install `react-simple-maps`

```js
$ npm install react-simple-maps --save
```

### Usage

`React-simple-map` exposes a simple component that can be used to create any kind of map. In order to render the map you must provide a reference to a valid topojson file. You can find example topojson files in the `topojson-maps` folder or [here](https://github.com/topojson/world-atlas)

```js
import React, { Component } from "react"
import ReactDOM from "react-dom"
import ReactSimpleMap from "react-simple-map"

class App extends Component {
  render() {
    return(
      <div>
        <ReactSimpleMap
          geographyUrl={ "/path/to/your/topojson-map-file.json" }
        />
      </div>
    )
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App />, document.getElementById("app"))
})
```

### Props

| Property         | Type            | Default                        |
| ---------------- |:--------------- | :----------------------------- |
| geographyUrl     | String          | null                           |
| geographyPaths   | Array           | `[]`                           |
| projection       | String/Function | "Times"                        |
| projectionConfig | Object          | [*see projection](#projection) |
| markers          | Array           | `[]`                           |
| choropleth       | Object          | `{}`                           |
| include          | Array           | `[]`                           |
| exclude          | Array           | `[]`                           |
| width            | Number          | 800                            |
| height           | Number          | 450                            |
| center           | Array           | `[0,0]`                        |
| Zoom             | Number          | 1                              |
| minZoom          | Number          | 1                              |
| maxZoom          | Number          | 8                              |
| events           | Object          | [*see events](#events)         |
| styles           | Object          | [*see styles](#styles)         |
| showControls     | Boolean         | false                          |

### <a name="projection"></a> Projection

The projection can be set and configured in a number of ways. Basic projections such as `mercator`, `miller`, and `times` are offered out of the box and can be set via the projection property.

```js
<ReactSimpleMap
  geographyUrl={ "/path/to/your/topojson-map-file.json" }
  projection={ "mercator" }
/>
```

These basic projections can also be customized via the `projectionConfig` property. The following example shows the default settings for the `projectionConfig` property.

```js
<ReactSimpleMap
  geographyUrl={ "/path/to/your/topojson-map-file.json" }
  projection={ "mercator" }
  projectionConfig={{
    scale: 160,
    xOffset: 0,
    yOffset: 0,
    rotation: [0,0,0],
    precision: 0.1,
  }}
/>
```

If another projection is needed, a custom projection function can be passed to the `projection` property. You can also access parameters such as the map width and height, as well as the original projectionConfig options in case you need them.

```js
import { geoEckert1 } from "d3-geo-projections"

...

<ReactSimpleMap
  geographyUrl={ "/path/to/your/topojson-map-file.json" }
  projection={(width, height, projectionConfig) => {
    return geoEckert1()
              .scale(160)
              .translate([ width / 2, height / 2 ])
              .rotate([0,0,0])
              .precision(0.1)
  }}
/>
```

### <a name="events"></a> Events

There are two groups of events, one for the geographies (any country or administrative area paths), and one for the markers. Currently supported events are `onMouseEnter`, `onMouseLeave`, `onMouseMove`, and `onClick`.

```js
<ReactSimpleMap
  geographyUrl={ "/path/to/your/topojson-map-file.json" }
  events={{
    geography: {
      onClick: (geography, evt) => {
        console.log(`Clicked geography: ${geography}`)
      }
    },
    marker: {
      onClick: (marker, evt) => {
        console.log(`Clicked marker: ${marker}`)
      }
    },
  }}
/>
```

### <a name="styles"></a> Styles

The styles object consists of a set of functions, which expose a number of parameters. The following examples also shows the default settings of the map.

```js
<ReactSimpleMap
  geographyUrl={ "/path/to/your/topojson-map-file.json" }
  styles={{
    svg() {
      return {
        width: "100%",
        height: "100%",
      }
    },
    wrapper() {
      return {
        position: "relative",
      }
    },
    loader() {
      return {
        position: "absolute",
        left: 0,
        right: 0,
        top: 20,
        padding: "1rem",
        textAlign: "center",
      }
    },
    geographies(zoom) {
      return {
        strokeWidth: 0.5 / zoom,
        cursor: "all-scroll",
      }
    },
    geography(choroplethValue, geography) {
      return {
        default: {
          stroke: "#ffffff",
          fill: choroplethValue ? choroplethValue.value : "#e9e7e5",
        },
        hover: {
          fill: choroplethValue ? choroplethValue.value : "#d9d7d5",
          stroke: "#ffffff",
          cursor: "pointer",
        },
      }
    },
    marker(marker, zoom) {
      return {
        default: {
          stroke: "#ffffff",
          strokeWidth: 1.5,
          fill: marker.fill || "#F44336",
        },
        hover: {
          stroke: "#ffffff",
          strokeWidth: 1.5,
          fill: "#E53935",
          cursor: "pointer",
        },
      }
    }
  }}
/>
```

### License
MIT licensed. Copyright (c) Richard Zimerman 2017. See [LICENSE.md](https://github.com/zcreativelabs/react-simple-maps/blob/master/LICENSE) for more details.
