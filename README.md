# react-simple-maps
An svg map component built with and for React. Please note that this is a work in progress!

#### Why

There is some overlap between what d3 does and what react does in terms of rendering svg. React Simple Map lets react control svg rendering, thus allowing us to eliminate bloat.

#### Basic usage

React Simple Map is available through npm.

```js
$ npm install react-simple-map --save
```

Import `react-simple-map` into your react app.

```js
import ReactSimpleMap from "react-simple-map"
```

`react-simple-map` exposes a simple component that can be used to create any kind of map.

```js
import React, { Component } from "react"
import ReactDOM from "react-dom"
import ReactSimpleMap from "react-simple-map"

class App extends Component {
  render() {
    return(
      <div>̨
        <ReactSimpleMap
          geographyUrl={ "/path/to/topojson-map-file.json" }
        />
      </div>
    )
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App />, document.getElementById("app"))
})
```
