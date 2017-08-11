
import React from "react"

export function replaceStrokeWidth(styles) {
  let newStyles = {}
  Object.keys(styles).map((key, i) => {
    if(key === "strokeWidth") newStyles[key] = "inherit"
    else newStyles[key] = styles[key]
  })
  return newStyles
}

export function createChoroplethStyles(styles, choroplethValue) {
  if(choroplethValue) {
    let newStyles = {}
    Object.keys(styles).map((key, i) => {
      if(key === "fill") newStyles[key] = choroplethValue.value
      else newStyles[key] = styles[key]
    })
    return newStyles
  }
  else {
    return styles
  }
}

export function calculateResizeFactor(actualDimension, baseDimension) {
  return 1 / 100 * (100 / actualDimension * baseDimension)
}

export function calculateMousePosition(direction, projection, props, zoom, resizeFactor, center = props.center, width = props.width, height = props.height) {
  const reference = { x: 0, y: 1 }
  const reverseRotation = projection().rotate().map(item => -item)
  return (projection().rotate(reverseRotation)([-center[0],-center[1]])[reference[direction]] - (reference[direction] === 0 ? width : height) / 2) * zoom * (1/resizeFactor)
}

export function isChildOfType(child, expectedType) {
  return child.props.componentIdentifier === expectedType
}

export function createNewChildren(children, props) {
  if (!children) return
  if (!children.length) {
    return isChildOfType(children, "Geographies") ? React.cloneElement(children, {
      projection: props.projection,
    }) : (isChildOfType(children, "Markers") || isChildOfType(children, "Annotation") || isChildOfType(child, "Graticule") ? React.cloneElement(children, {
      projection: props.projection,
      zoom: props.zoom,
    }) : children)
  }
  else {
    return children.map((child, i) => {
      if (!child) return
      return isChildOfType(child, "Geographies") ?
        React.cloneElement(child, {
          key: `zoomable-child-${i}`,
          projection: props.projection,
        }) : (isChildOfType(child, "Markers") || isChildOfType(child, "Annotation") || isChildOfType(child, "Graticule") ?
        React.cloneElement(child, {
          key: `zoomable-child-${i}`,
          projection: props.projection,
          zoom: props.zoom,
        }): child)
    })
  }
}

export function roundPath(path, precision) {
  if (!path) return
  const query = /[\d\.-][\d\.e-]*/g
  return path.replace(query, n => Math.round(n * (1/precision)) / (1/precision))
}

export function createConnectorPath(connectorType, endPoint) {
  return `M0,0 L${endPoint[0]},${endPoint[1]}`
}

export function createTextAnchor(dx) {
  if (dx > 0)
    return "start"
  else if (dx < 0 )
    return "end"
  else
    return "middle"
}
