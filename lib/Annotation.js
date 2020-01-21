"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _d3Geo = require("d3-geo");

var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Annotation =
/*#__PURE__*/
function (_Component) {
  _inherits(Annotation, _Component);

  function Annotation() {
    _classCallCheck(this, Annotation);

    return _possibleConstructorReturn(this, _getPrototypeOf(Annotation).apply(this, arguments));
  }

  _createClass(Annotation, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          projection = _this$props.projection,
          subject = _this$props.subject,
          style = _this$props.style,
          hiddenStyle = _this$props.hiddenStyle,
          dx = _this$props.dx,
          dy = _this$props.dy,
          zoom = _this$props.zoom,
          stroke = _this$props.stroke,
          strokeWidth = _this$props.strokeWidth,
          children = _this$props.children,
          curve = _this$props.curve,
          markerEnd = _this$props.markerEnd,
          width = _this$props.width,
          height = _this$props.height;
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
      return _react["default"].createElement(_reactNativeSvg.G, {
        className: "rsm-annotation",
        style: isHidden ? _objectSpread({}, style, hiddenStyle) : style,
        transform: "translate(\n          ".concat(translation[0] + dx / zoom, "\n          ").concat(translation[1] + dy / zoom, "\n        )"),
        textAnchor: (0, _utils.createTextAnchor)(dx)
      }, children, _react["default"].createElement(_reactNativeSvg.Path, {
        d: connectorPath,
        stroke: stroke,
        strokeWidth: strokeWidth,
        fill: "none",
        markerEnd: markerEnd
      }));
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
var _default = Annotation;
exports["default"] = _default;