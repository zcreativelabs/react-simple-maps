<img src="https://img.shields.io/bundlephobia/minzip/react-simple-maps?color=%2328cb95&label=gzip" />

# react-simple-maps

Create beautiful SVG maps in react with d3-geo and topojson using a declarative api.

Read the [docs](https://www.react-simple-maps.io/docs/getting-started/), or check out the [examples](https://www.react-simple-maps.io/examples/).

### Why

`React-simple-maps` aims to make working with svg maps in react easier. It handles tasks such as panning, zooming and simple rendering optimization, and takes advantage of parts of [d3-geo](https://github.com/d3/d3-geo) and topojson-client instead of relying on the entire d3 library.

Since `react-simple-maps` leaves DOM work to react, it can also easily be used with other libraries, such as [react-spring](https://github.com/react-spring/react-spring) and [react-annotation](https://github.com/susielu/react-annotation/).

### Install

To install `react-simple-maps`

```bash
$ npm install react-simple-maps
```

...or if you use yarn:

```bash
$ yarn add react-simple-maps
```

### Usage

`React-simple-maps` exposes a set of components that can be combined to create svg maps with markers and annotations. In order to render a map you have to provide a reference to a valid topojson file. You can find example topojson files on [here](https://github.com/topojson/world-atlas) or [here](https://github.com/deldersveld/topojson). To learn how to make your own topojson maps from shapefiles, please read ["How to convert and prepare TopoJSON files for interactive mapping with d3"](https://hackernoon.com/how-to-convert-and-prepare-topojson-files-for-interactive-mapping-with-d3-499cf0ced5f) on medium.

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// url to a valid topojson file
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const App = () => {
  return (
    <div>
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App />, document.getElementById("app"));
});
```

Check out the [live example](https://codesandbox.io/s/basic-map-wvlol)

The above will render a world map using the [equal earth projection](https://observablehq.com/@d3/equal-earth). You can read more about this projection on [Shaded Relief](http://shadedrelief.com/ee_proj/) and on [Wikipedia](https://en.wikipedia.org/wiki/Equal_Earth_projection).

For other examples and components, check out the [documentation](https://www.react-simple-maps.io/docs/getting-started).

### Map files

React-simple-maps does not restrict you to one specific map and relies on custom map files that you can modify in any way necessary for the project. This means that you can visualise countries, regions, and continents in various resolutions, as long as they can be represented using geojson/topojson.

In order for this to work properly, you will however need to provide these valid map files to react-simple-maps yourself. Luckily, there are decent sources for map files on github and elsewhere. Here are some you can check out:

* [Natural Earth](https://github.com/nvkelso/natural-earth-vector)
* [Topojson maps by @deldersveld](https://github.com/deldersveld/topojson)
* [Topojson world atlas](https://github.com/topojson/world-atlas)

### License

MIT licensed. Copyright (c) Richard Zimerman 2017. See [LICENSE.md](https://github.com/zcreativelabs/react-simple-maps/blob/master/LICENSE) for more details.
