"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateResizeFactor = calculateResizeFactor;
exports.calculateMousePosition = calculateMousePosition;
exports.isChildOfType = isChildOfType;
exports.createNewChildren = createNewChildren;
exports.roundPath = roundPath;
exports.createConnectorPath = createConnectorPath;
exports.createTextAnchor = createTextAnchor;
exports.computeBackdrop = computeBackdrop;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function calculateResizeFactor(actualDimension, baseDimension) {
  if (actualDimension === 0) return 1;
  return 1 / 100 * (100 / actualDimension * baseDimension);
}

function calculateMousePosition(direction, projection, props, zoom, resizeFactor) {
  var center = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : props.center;
  var width = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : props.width;
  var height = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : props.height;

  var reference = { x: 0, y: 1 };
  var canRotate = !!projection.rotate;
  var reverseRotation = !!canRotate ? projection.rotate().map(function (item) {
    return -item;
  }) : false;
  var point = !!reverseRotation ? projection.rotate(reverseRotation)([-center[0], -center[1]]) : projection([center[0], center[1]]);
  var returner = point ? (point[reference[direction]] - (reference[direction] === 0 ? width : height) / 2) * zoom * (1 / resizeFactor) : 0;
  if (canRotate) projection.rotate([-reverseRotation[0], -reverseRotation[1], -reverseRotation[2]]);
  return !!reverseRotation ? returner : -returner;
}

function isChildOfType(child, expectedTypes) {
  return expectedTypes.indexOf(child.props.componentIdentifier) !== -1;
}

function createNewChildren(children, props) {
  if (!children) return;
  if (!children.length) {
    return isChildOfType(children, ["Geographies"]) ? _react2.default.cloneElement(children, {
      projection: props.projection
    }) : isChildOfType(children, ["Group", "Markers", "Lines", "Annotations", "Annotation", "Graticule"]) ? _react2.default.cloneElement(children, {
      projection: props.projection,
      zoom: props.zoom,
      width: props.width,
      height: props.height,
      groupName: props.groupName,
      itemName: props.itemName
    }) : children;
  } else {
    return children.map(function (child, i) {
      if (!child) return;
      return isChildOfType(child, ["Geographies"]) ? _react2.default.cloneElement(child, {
        key: "zoomable-child-" + i,
        projection: props.projection
      }) : isChildOfType(child, ["Group", "Markers", "Lines", "Annotations", "Annotation", "Graticule"]) ? _react2.default.cloneElement(child, {
        key: "zoomable-child-" + i,
        projection: props.projection,
        zoom: props.zoom,
        width: props.width,
        height: props.height,
        groupName: props.groupName,
        itemName: props.itemName
      }) : child;
    });
  }
}

function roundPath(path, precision) {
  if (!path) return;
  var query = /[\d\.-][\d\.e-]*/g;
  return path.replace(query, function (n) {
    return Math.round(n * (1 / precision)) / (1 / precision);
  });
}

function createConnectorPath(connectorType, endPoint, curve) {
  var e0 = endPoint[0];
  var e1 = endPoint[1];
  return "M0,0 Q " + (curve + 1) / 2 * e0 + "," + (e1 - (curve + 1) / 2 * e1) + " " + e0 + "," + e1;
}

function createTextAnchor(dx) {
  if (dx > 0) return "start";else if (dx < 0) return "end";else return "middle";
}

function computeBackdrop(projection, backdrop) {
  var canRotate = projection.rotate;
  var originalRotation = canRotate ? projection.rotate() : null;

  var tl = canRotate ? projection.rotate([0, 0, 0])([backdrop.x[0], backdrop.y[0]]) : projection([backdrop.x[0], backdrop.y[0]]);

  var br = canRotate ? projection.rotate([0, 0, 0])([backdrop.x[1], backdrop.y[1]]) : projection([backdrop.x[1], backdrop.y[1]]);

  var x = tl ? tl[0] : 0;
  var x0 = br ? br[0] : 0;

  var y = tl ? tl[1] : 0;
  var y0 = br ? br[1] : 0;

  var width = x0 - x;
  var height = y0 - y;

  if (originalRotation) projection.rotate(originalRotation);

  return { x: x, y: y, width: width, height: height };
}