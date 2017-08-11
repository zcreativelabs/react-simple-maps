# react-simple-maps
An svg map component built with and for React. It allows the creation of pure react svg maps.

### Why

`React-simple-maps` aims to make working with svg maps in react easier. It handles tasks such as panning, zooming and simple rendering optimization, and takes advantage of parts of [d3-geo](https://github.com/d3/d3-geo) and topojson-client instead of relying on the entire d3 library.

Since `react-simple-maps` leaves DOM work to react, it can also be easily used with other libraries, such as [react-motion](https://github.com/chenglou/react-motion) and [redux-tooltip](https://github.com/kuy/redux-tooltip).

### API changes from 0.4 to 0.5

`React-simple-maps` has been rewritten to allow more creative freedom and low-level access for developers. The `<ReactSimpleMap />` component has been replaced with a `<ComposableMap />` component and a set of smaller components that define each part of the interactive map.

### Installation

To install `react-simple-maps`

```js
$ npm install react react-dom react-simple-maps --save
```

### Usage

`React-simple-maps` exposes a set of components that can be combined to create svg maps with markers and annotations. In order to render a map you have to provide a reference to a valid topojson file. You can find example topojson files in the [`topojson-maps` folder](https://github.com/zcreativelabs/react-simple-maps/tree/master/topojson-maps) or on [topojson world-atlas](https://github.com/topojson/world-atlas). To learn how to make your own topojson maps from shapefiles, please read ["How to convert and prepare TopoJSON files for interactive mapping with d3"](https://hackernoon.com/how-to-convert-and-prepare-topojson-files-for-interactive-mapping-with-d3-499cf0ced5f) on medium.

```js
import React, { Component } from "react"
import ReactDOM from "react-dom"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"

class App extends Component {
  render() {
    return(
      <div>
        <ComposableMap>
          <ZoomableGroup>
          <Geographies geographyUrl={ "/path/to/your/topojson-map-file.json" }>
            {(geographies, projection) => geographies.map((geography, i) => (
              <Geography
                key={ `geography-${i}` }
                geography={ geography }
                projection={ projection }
                />
            ))}
          </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App />, document.getElementById("app"))
})
```

Here is the complete simplified component structure of any map created with `react-simple-maps`.

```js
<ComposableMap>
  <ZoomableGroup>
    <Geographies geographyUrl={ "/path/to/your/topojson-map-file.json" }>
      {(geographies, projection) => geographies.map((geography, i) => (
        <Geography key={ i } geography={ geography } projection={ projection } />
      ))}
    </Geographies>
    <Markers>
      <Marker />
    </Markers>
    <Annotation />
  </ZoomableGroup>
</ComposableMap>
```

The above results in the following svg structure rendered by react:

```xml
<svg class="rsm-svg">
  <g class="rsm-zoomable-group">
    <g class="rsm-geographies">
      <path class="rsm-geography" />
      <path class="rsm-geography" />
      <path class="rsm-geography" />
      ...
    </g>
    <g class="rsm-markers">
      <g class="rsm-marker"></g>
    </g>
    <g class="rsm-annotation"></g>
  </g>
</svg>
```

### Components

`React-simple-maps` is a set of components that simplify the process of making interactive svg maps with react. The components included are:

- [`<ComposableMap />`](#ComposableMap-component)
- [`<ZoomableGroup />`](#ZoomableGroup-component)
- [`<Geographies />`](#Geographies-component)
- [`<Geography />`](#Geography-component)
- [`<Markers />`](#Markers-component)
- [`<Marker />`](#Marker-component)
- [`<Annotation />`](#Annotation-component)
- [`<Graticule />`](#Graticule-component)


#### <a name="ComposableMap-component"></a> `<ComposableMap />`

`<ComponentMap />` forms the wrapper around your map. It defines the dimensions of the map and sets the projection used by Geographies, Markers, and Annotations, to position elements. By default the maps use the "times" projection, but `react-simple-maps` also supports `robinson`,  `eckert4`, `winkel3`, `mercator`, and `miller` projections out of the box. Additionally you can plug in a custom projection of your choice. All projections from `d3-geo-projections` are supported.

##### Props

| Property         | Type            | Default                        |
| ---------------- |:--------------- | :----------------------------- |
| width            | Number          | 800                            |
| height           | Array           | 450                            |
| projection       | String/Function | "times"                        |
| projectionConfig | Object          | *see examples below            |

##### Configuring projections

The following custom configuration would prevent a visual split of Russia.

```js
...
<ComposableMap
  projectionConfig={{
    scale: 200,
    rotation: [-10,0,0],
  }}
>
...
</ComposableMap>
...
```

The default configuration of the projection:

```js
{
  scale: 160,
  xOffset: 0,
  yOffset: 0,
  rotation: [0,0,0],
  precision: 0.1,
}
```

#### <a name="ZoomableGroup-component"></a> `<ZoomableGroup />`

`<ZoomableGroup />` is a component that allows you to zoom and pan. Check out the zoom example to find out how to work with zoom in `react-simple-maps`.

##### Props

| Property         | Type            | Default                        |
| ---------------- |:--------------- | :----------------------------- |
| zoom             | Number          | 1                              |
| center           | Array           | [0,0]                          |
| disablePanning   | Boolean         | false                          |
| style            | Object          | {}                             |

##### Zooming

The `ZoomableGroup` component exposes a zoom property, which can be updated from a wrapper component via setState.

```js
import React, { Component } from "react"
import ReactDOM from "react-dom"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"

class App extends Component {
  constructor() {
    super()

    this.state = {
      zoom: 1,
    }

    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)
  }
  handleZoomIn() {
    this.setState({
      zoom: this.state.zoom * 2,
    })
  }
  handleZoomOut() {
    this.setState({
      zoom: this.state.zoom / 2,
    })
  }
  render() {
    return(
      <div>
        <button onClick={ this.handleZoomIn }>{ "Zoom in" }</button>
        <button onClick={ this.handleZoomOut }>{ "Zoom out" }</button>
        <hr />
        <ComposableMap>
          <ZoomableGroup zoom={ this.state.zoom }>
          <Geographies geographyUrl={ "/path/to/your/topojson-map-file.json" }>
            {(geographies, projection) => geographies.map((geography, i) => (
              <Geography
                key={ `geography-${i}` }
                geography={ geography }
                projection={ projection }
                />
            ))}
          </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App />, document.getElementById("app"))
})
```

#### <a name="Geographies-component"></a> `<Geographies />`

`<Geographies />` is a group wrapper around the geographies paths. It returns a function that contains the geographies extracted from the geographiesUrl passed in.

React-simple-maps offers a couple of ways to optimise the performance of the map:

1. By default the `<Geographies />` component uses `shouldComponentUpdate` to prevent the paths from being rerendered. This optimisation can be bypassed using the `disableOptimization` prop. This is useful when making choropleth maps that are updated on user interaction.

2. A second way in which react-simple-maps can optimise maps is by setting a `cacheId` on the individual geographies. See the [`<Geography />`](#ComposableMap-component) component for more info. The unique cacheIds help to cache the paths and significantly accelerate rerenders. This second method is the recommended way of optimising maps with react-simple-maps.

If you do not want `react-simple-maps` to load your topojson and pass it down automatically, you can also pass your topojson converted `features` directly into the `Geographies` component.

##### Props

| Property            | Type            | Default                        |
| ------------------- |:--------------- | :----------------------------- |
| disableOptimization | Boolean         | false                          |
| geographyUrl        | String          | ""                             |
| geographyPaths      | Array           | []                             |

##### Choropleth map

The below example uses the [world-50m-with-data.json](https://github.com/zcreativelabs/react-simple-maps/tree/master/topojson-maps) TopoJSON file.

```js
import React, { Component } from "react"
import { scaleLinear } from "d3-scale"

const colorScale = scaleLinear()
  .domain([0, 100000000, 1338612970]) // Max is based on China
  .range(["#FFF176", "#FFC107", "#E65100"])

class ChoroplethMap extends Component {
  render() {
    return (
      <div>
        <ComposableMap style={{ width: "100%" }}>
          <ZoomableGroup>
            <Geographies geographyUrl={ "/path/to/world-50m-with-data.json" }>
              {(geographies, projection) => geographies.map((geography, i) => (
                <Geography
                  key={ `geography-${i}` }
                  geography={ geography }
                  projection={ projection }
                  style={{
                    default: {
                      fill: colorScale(geography.properties.pop_est),
                      stroke: "#FFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
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

export default ChoroplethMap
```

#### <a name="Geography-component"></a> `<Geography />`

The `<Geography />` component represents each shape converted with topojson. The component can be used to assign events to individual shapes on the map, and to specify their hover, focus and click behavior.

##### Props

| Property            | Type            | Default                        |
| ------------------- |:--------------- | :----------------------------- |
| cacheId             | Number/String   | null                           |
| precision           | Number          | 0.1                            |
| round               | Boolean         | false                          |
| geography           | Object          | *see examples below            |
| tabable             | Boolean         | true                           |
| style               | Object          | *see examples below            |

##### Styling

There are no default styles assigned to the `<Geography />` component. Since the geography paths have to be optimized in order to allow for decent performance, the styles have to be handled by the `<Geography />` component internally. The style prop is an object that defines three states for each path.

```js
...
<Geography style={{
  default: { fill: "#666" },
  hover:   { fill: "#999" },
  pressed: { fill: "#000" },
}}/>
...
```

##### Geography events and accessing geography data in events

```js
...
handleClick(geography, evt) {
  console.log("Geography data: ", geography)
}
...
<Geographies geographyUrl={ "/path/to/your/topojson-map-file.json" }>
  {(geographies, projection) => geographies.map((geography, i) => (
    <Geography key={ i } geography={ geography } projection={ projection } />
  ))}
</Geographies>
...
```

Currently supported events are `onMouseEnter`, `onMouseLeave`, `onMouseDown`, `onMouseUp`, `onClick`, `onMouseMove`, `onFocus`, `onBlur`.

#### <a name="Markers-component"></a> `<Markers />`

`<Markers />` is a simple wrapper component for the individual markers.


#### <a name="Marker-component"></a> `<Marker />`

The `<Marker />` component represents each marker and uses coordinates to position the marker on the map. It does not make any assumptions about what your marker looks like, so you have to specify yourself what shape it should have. See the example below for how to make the recommended circular marker. The component can be used to assign events to individual markers on the map, and to specify the hover, focus and click behavior.

##### Props

| Property            | Type            | Default                        |
| ------------------- |:--------------- | :----------------------------- |
| marker              | Object          | *see below examples            |
| tabable             | Boolean         | true                           |
| style               | Object          | *see below examples            |

##### Marker location

Marker data is added to the `marker` prop and should contain the coordinates of the marker.

```js
<Markers>
  <Marker marker={{ coordinates: [ 8.5, 47.3 ] }}>
    <circle cx={ 0 } cy={ 0 } r={ 10 } />
  </Marker>
</Markers>
```

##### Styling and shape

There are no styles assigned to the style prop, and the marker does not have a shape by default.

```js
...
<Marker
  marker={{ coordinates: [ 8.5, 47.3 ] }}
  style={{
    default: { fill: "#666" },
    hover:   { fill: "#999" },
    pressed: { fill: "#000" },
  }
}>
  <circle cx={ 0 } cy={ 0 } r={ 10 } />
</Marker>
...
```

##### Marker events and passing marker data to marker events

In order to allow easy access to marker data when handling events, pass the marker data to the `marker` prop. Below is an example of how to iterate through markers.

```js
...
handleClick(marker, evt) {
  console.log("Marker data: ", marker)
}
...
<Markers>
  { markers.map((marker, i) => (
    <Marker
      key={ i }
      marker={ marker }
      onClick={ this.handleClick }
    />
  ))}
</Markers>
...
```

Currently supported events are `onMouseEnter`, `onMouseLeave`, `onMouseDown`, `onMouseUp`, `onClick`, `onMouseMove`, `onFocus`, `onBlur`.

#### <a name="Annotation-component"></a> `<Annotation />`

`<Annotation />` components can be used to add textual annotations. To position an annotation you have to specify the coordinates of the subject of the annotation, and then pass in numbers for dx and dy to specify the offset of the annotation itself.

##### Props

| Property            | Type            | Default                        |
| ------------------- |:--------------- | :----------------------------- |
| subject             | Array           | [0,0]                          |
| dx                  | Number          | 30                             |
| dy                  | Number          | 30                             |
| zoom                | Number          | 1                              |
| stroke              | String          | "#000000"                      |
| strokeWidth         | Number          | 1                              |
| style               | Object          | {}                             |

##### Example annotation

The following example shows how to add a sample annotation for the city of Zurich on a world map.

```js
...
<Annotation dx={ -30 } dy={ 30 } subject={ [ 8.5, 47.3 ] } strokeWidth={ 1 }>
  <text>
    { "Zurich" }
  </text>
</Annotation>
...
```

#### <a name="Graticule-component"></a> `<Graticule />`

The `<Graticule />` component can be used to add a graticule to the map. Note that you can place the graticule before (behind) or after (on top of) the other elements.

##### Props

| Property            | Type            | Default                        |
| ------------------- |:--------------- | :----------------------------- |
| step                | Array           | [10,10]                        |
| round               | Boolean         | true                           |
| precision           | Nmber           | 0.1                            |
| outline             | Boolean         | true                           |
| stroke              | String          | "#DDDDDD"                      |
| fill                | String          | "transparent"                  |
| style               | Object          | `{ pointerEvents: "none" }`    |
| disableOptimization | Boolean         | true                           |

### License
MIT licensed. Copyright (c) Richard Zimerman 2017. See [LICENSE.md](https://github.com/zcreativelabs/react-simple-maps/blob/master/LICENSE) for more details.
