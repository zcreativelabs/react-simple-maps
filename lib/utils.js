"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceStrokeWidth = replaceStrokeWidth;
exports.createChoroplethStyles = createChoroplethStyles;
exports.calculateResizeFactor = calculateResizeFactor;
exports.calculateMousePosition = calculateMousePosition;
function replaceStrokeWidth(styles) {
  var newStyles = {};
  Object.keys(styles).map(function (key, i) {
    if (key === "strokeWidth") newStyles[key] = "inherit";else newStyles[key] = styles[key];
  });
  return newStyles;
}

function createChoroplethStyles(styles, choroplethValue) {
  if (choroplethValue) {
    var newStyles = {};
    Object.keys(styles).map(function (key, i) {
      if (key === "fill") newStyles[key] = choroplethValue.value;else newStyles[key] = styles[key];
    });
    return newStyles;
  } else {
    return styles;
  }
}

function calculateResizeFactor(actualDimension, baseDimension) {
  return 1 / 100 * (100 / actualDimension * baseDimension);
}

function calculateMousePosition(direction, projection, props, zoom, resizeFactor) {
  var center = props.center,
      width = props.width,
      height = props.height;

  var reference = { x: 0, y: 1 };
  return (projection()(center)[reference[direction]] - (reference[direction] === 0 ? width : height) / 2) * zoom * (1 / resizeFactor);
}