
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

export function calculateMousePosition(direction, projection, props, zoom, resizeFactor) {
  const { center, width, height } = props
  const reference = { x: 0, y: 1 }
  return (projection()([-center[0],-center[1]])[reference[direction]] - (reference[direction] === 0 ? width : height) / 2) * zoom * (1/resizeFactor)
}
