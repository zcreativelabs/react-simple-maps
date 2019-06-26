"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _d3Geo = require("d3-geo");

var _expo = require("expo");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var G = _expo.Svg.G;

var Marker =
/*#__PURE__*/
function (_Component) {
  _inherits(Marker, _Component);

  function Marker() {
    var _this;

    _classCallCheck(this, Marker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Marker).call(this));
    _this.state = {
      pressed: false
    };
    return _this;
  }

  _createClass(Marker, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          projection = _this$props.projection,
          marker = _this$props.marker,
          style = _this$props.style,
          tabable = _this$props.tabable,
          zoom = _this$props.zoom,
          children = _this$props.children,
          preserveMarkerAspect = _this$props.preserveMarkerAspect,
          width = _this$props.width,
          height = _this$props.height;
      var _this$state = this.state,
          pressed = _this$state.pressed,
          hover = _this$state.hover;
      var scale = preserveMarkerAspect ? " scale(".concat(1 / zoom, ")") : "";
      var translation = projection(marker.coordinates);
      var lineString = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [projection.invert([width / 2, height / 2]), marker.coordinates]
        }
      };
      var radians = Math.PI / 2,
          degrees = 90;
      var isGlobe = projection.clipAngle && projection.clipAngle() === degrees;
      var isHidden = isGlobe && (0, _d3Geo.geoLength)(lineString) > radians;
      return _react["default"].createElement(G, {
        transform: "translate(\n           ".concat(translation[0], "\n           ").concat(translation[1], "\n         ) ").concat(scale),
        style: style[isHidden ? "hidden" : pressed || hover ? pressed ? "pressed" : "hover" : "default"]
      }, children);
    }
  }]);

  return Marker;
}(_react.Component);

Marker.defaultProps = {
  style: {
    "default": {},
    pressed: {}
  },
  marker: {
    coordinates: [0, 0]
  },
  tabable: true,
  preserveMarkerAspect: true
};
var _default = Marker;
exports["default"] = _default;