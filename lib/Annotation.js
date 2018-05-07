"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Geo = require("d3-geo");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Annotation = function (_Component) {
  _inherits(Annotation, _Component);

  function Annotation() {
    _classCallCheck(this, Annotation);

    return _possibleConstructorReturn(this, (Annotation.__proto__ || Object.getPrototypeOf(Annotation)).apply(this, arguments));
  }

  _createClass(Annotation, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          projection = _props.projection,
          subject = _props.subject,
          style = _props.style,
          hiddenStyle = _props.hiddenStyle,
          dx = _props.dx,
          dy = _props.dy,
          zoom = _props.zoom,
          stroke = _props.stroke,
          strokeWidth = _props.strokeWidth,
          children = _props.children,
          curve = _props.curve,
          markerEnd = _props.markerEnd,
          width = _props.width,
          height = _props.height;


      var connectorPath = (0, _utils.createConnectorPath)(null, [-dx / zoom, -dy / zoom], curve);
      var translation = projection(subject);

      var lineString = {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [projection.invert([width / 2, height / 2]), subject]
        }
      };

      var radians = Math.PI / 2,
          degrees = 90;
      var isGlobe = projection.clipAngle && projection.clipAngle() === degrees;
      var isHidden = isGlobe && (0, _d3Geo.geoLength)(lineString) > radians;

      return _react2.default.createElement(
        "g",
        {
          className: "rsm-annotation",
          style: isHidden ? _extends({}, style, hiddenStyle) : style,
          transform: "translate(\n          " + (translation[0] + dx / zoom) + "\n          " + (translation[1] + dy / zoom) + "\n        )",
          textAnchor: (0, _utils.createTextAnchor)(dx)
        },
        children,
        _react2.default.createElement("path", {
          d: connectorPath,
          stroke: stroke,
          strokeWidth: strokeWidth,
          fill: "none",
          markerEnd: markerEnd
        })
      );
    }
  }]);

  return Annotation;
}(_react.Component);

Annotation.defaultProps = {
  curve: 0,
  markerEnd: "none",
  componentIdentifier: "Annotation",
  stroke: "#000000",
  strokeWidth: 1,
  zoom: 1
};

exports.default = Annotation;