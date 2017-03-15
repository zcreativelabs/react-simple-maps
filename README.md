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

`React-simple-map` exposes a simple component that can be used to create any kind of map. In order to render the map you must provide a reference to a valid topojson file. You can find example topojson files [here](https://github.com/topojson/world-atlas)

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

### License
MIT Licensed. Copyright (c) Richard Zimerman 2017.
