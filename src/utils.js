
import React from "react"

export function calculateResizeFactor(actualDimension, baseDimension) {
  return 1 / 100 * (100 / actualDimension * baseDimension)
}

export function calculateMousePosition(direction, projection, props, zoom, resizeFactor, center = props.center, width = props.width, height = props.height) {
  const reference = { x: 0, y: 1 }
  const canRotate = !!projection().rotate
  const reverseRotation = !!canRotate ? projection().rotate().map(item => -item) : false
  const point = !!reverseRotation
    ? projection().rotate(reverseRotation)([-center[0],-center[1]])
    : projection()([center[0],center[1]])
  const returner = point
    ? (point[reference[direction]] - (reference[direction] === 0 ? width : height) / 2) * zoom * (1/resizeFactor)
    : 0
  return !!reverseRotation ? returner : -returner
}

export function isChildOfType(child, expectedType) {
  return child.props.componentIdentifier === expectedType
}

export function createNewChildren(children, props) {
  if (!children) return
  if (!children.length) {
    return isChildOfType(children, "Geographies") ? React.cloneElement(children, {
      projection: props.projection,
    }) : (isChildOfType(children, "Markers") || isChildOfType(children, "Annotations") || isChildOfType(children, "Annotation") || isChildOfType(child, "Graticule") ?
    React.cloneElement(children, {
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
        }) : (isChildOfType(child, "Markers") || isChildOfType(child, "Annotations") || isChildOfType(child, "Annotation") || isChildOfType(child, "Graticule") ?
        React.cloneElement(child, {
          key: `zoomable-child-${i}`,
          projection: props.projection,
          zoom: props.zoom,
        }) : child)
    })
  }
}

export function roundPath(path, precision) {
  if (!path) return
  const query = /[\d\.-][\d\.e-]*/g
  return path.replace(query, n => Math.round(n * (1/precision)) / (1/precision))
}

export function createConnectorPath(connectorType, endPoint, curve) {
  const e0 = endPoint[0]
  const e1 = endPoint[1]
  return `M0,0 Q ${(curve + 1) / 2 * e0},${e1-((curve + 1) / 2 * e1)} ${e0},${e1}`
}

export function createTextAnchor(dx) {
  if (dx > 0)
    return "start"
  else if (dx < 0 )
    return "end"
  else
    return "middle"
}

export function computeBackdrop(projection, backdrop) {
  const canRotate = projection().rotate

  const tl = canRotate
    ? projection().rotate([0,0,0])([backdrop.x[0],backdrop.y[0]])
    : projection()([backdrop.x[0],backdrop.y[0]])

  const br = canRotate
    ? projection().rotate([0,0,0])([backdrop.x[1],backdrop.y[1]])
    : projection()([backdrop.x[1],backdrop.y[1]])

  const x = tl ? tl[0] : 0
  const x0 = br ? br[0] : 0

  const y = tl ? tl[1] : 0
  const y0 = br ? br[1] : 0

  const width = x0 - x
  const height = y0 - y

  return { x, y, width, height }
}
