<img src="https://img.shields.io/bundlephobia/minzip/react-simple-maps?color=%2328cb95&label=gzip" />

# react-simple-maps

Create beautiful SVG maps in react with d3-geo and topojson using a declarative api.

Read the [docs](https://www.react-simple-maps.io/docs/getting-started/), or check out the [examples](https://www.react-simple-maps.io/examples/).

### Why

`React-simple-maps` aims to make working with svg maps in react easier. It handles tasks such as panning, zooming and simple rendering optimization, and takes advantage of parts of [d3-geo](https://github.com/d3/d3-geo) and topojson-client instead of relying on the entire d3 library.

Since `react-simple-maps` leaves DOM work to react, it also plays nicely with other react component libraries.

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
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

// url to a valid topojson file
const geoUrl = "my-topojson-file.json"

const SampleMap = () => {
  return (
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ComposableMap>
  )
}
```

The above will render a world map using the [equal earth projection](https://observablehq.com/@d3/equal-earth). You can read more about this projection on [Shaded Relief](http://shadedrelief.com/ee_proj/) and on [Wikipedia](https://en.wikipedia.org/wiki/Equal_Earth_projection).

### Map files

React-simple-maps does not restrict you to one specific map and relies on custom map files that you can modify in any way necessary for your project. This means that you can visualise countries, regions, and continents at various levels of complexity, as long as they can be represented using geojson/topojson.

In order for this to work properly, you will need to provide these valid map files to react-simple-maps yourself. Luckily, there are decent sources for global map files on github and elsewhere. Here are some you can check out:

- [Eurostat GISCO](https://ec.europa.eu/eurostat/web/gisco/geodata/administrative-units)
- [Natural Earth](https://github.com/nvkelso/natural-earth-vector)

### License

MIT licensed. Copyright (c) Richard Zimerman 2017. See [LICENSE.md](https://github.com/zcreativelabs/react-simple-maps/blob/master/LICENSE) for more details.
