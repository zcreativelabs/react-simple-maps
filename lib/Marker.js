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

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

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
      hover: false,
      pressed: false
    };
    _this.handleMouseEnter = _this.handleMouseEnter.bind(_assertThisInitialized(_this));
    _this.handleMouseLeave = _this.handleMouseLeave.bind(_assertThisInitialized(_this));
    _this.handleMouseDown = _this.handleMouseDown.bind(_assertThisInitialized(_this));
    _this.handleMouseUp = _this.handleMouseUp.bind(_assertThisInitialized(_this));
    _this.handleMouseClick = _this.handleMouseClick.bind(_assertThisInitialized(_this));
    _this.handleMouseMove = _this.handleMouseMove.bind(_assertThisInitialized(_this));
    _this.handleFocus = _this.handleFocus.bind(_assertThisInitialized(_this));
    _this.handleBlur = _this.handleBlur.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Marker, [{
    key: "handleMouseEnter",
    value: function handleMouseEnter(evt) {
      evt.persist();
      var _this$props = this.props,
          onMouseEnter = _this$props.onMouseEnter,
          marker = _this$props.marker;
      this.setState({
        hover: true
      }, function () {
        return onMouseEnter && onMouseEnter(marker, evt);
      });
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(evt) {
      evt.persist();
      if (this.state.pressed) return;
      var _this$props2 = this.props,
          onMouseMove = _this$props2.onMouseMove,
          marker = _this$props2.marker;

      if (!this.state.hover) {
        this.setState({
          hover: true
        }, function () {
          return onMouseMove && onMouseMove(marker, evt);
        });
      } else if (onMouseMove) onMouseMove(marker, evt);else return;
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave(evt) {
      evt.persist();
      var _this$props3 = this.props,
          onMouseLeave = _this$props3.onMouseLeave,
          marker = _this$props3.marker;
      this.setState({
        hover: false
      }, function () {
        return onMouseLeave && onMouseLeave(marker, evt);
      });
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(evt) {
      evt.persist();
      var _this$props4 = this.props,
          onMouseDown = _this$props4.onMouseDown,
          marker = _this$props4.marker;
      this.setState({
        pressed: true
      }, function () {
        return onMouseDown && onMouseDown(marker, evt);
      });
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(evt) {
      evt.persist();
      var _this$props5 = this.props,
          onMouseUp = _this$props5.onMouseUp,
          marker = _this$props5.marker;
      this.setState({
        pressed: false
      }, function () {
        return onMouseUp && onMouseUp(marker, evt);
      });
    }
  }, {
    key: "handleMouseClick",
    value: function handleMouseClick(evt) {
      if (!this.props.onClick) return;
      evt.persist();
      var _this$props6 = this.props,
          onClick = _this$props6.onClick,
          marker = _this$props6.marker,
          projection = _this$props6.projection;
      return onClick && onClick(marker, projection(marker.coordinates), evt);
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(evt) {
      evt.persist();
      var _this$props7 = this.props,
          onFocus = _this$props7.onFocus,
          marker = _this$props7.marker;
      this.setState({
        hover: true
      }, function () {
        return onFocus && onFocus(marker, evt);
      });
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(evt) {
      evt.persist();
      var _this$props8 = this.props,
          onBlur = _this$props8.onBlur,
          marker = _this$props8.marker;
      this.setState({
        hover: false
      }, function () {
        return onBlur && onBlur(marker, evt);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props9 = this.props,
          projection = _this$props9.projection,
          marker = _this$props9.marker,
          style = _this$props9.style,
          tabable = _this$props9.tabable,
          zoom = _this$props9.zoom,
          children = _this$props9.children,
          preserveMarkerAspect = _this$props9.preserveMarkerAspect,
          width = _this$props9.width,
          height = _this$props9.height;
      var _this$state = this.state,
          pressed = _this$state.pressed,
          hover = _this$state.hover;
      var scale = preserveMarkerAspect ? " scale(".concat(1 / zoom, ")") : "";
      var translation = projection(marker.coordinates);
      var lineString = {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [projection.invert([width / 2, height / 2]), marker.coordinates]
        }
      };
      var radians = Math.PI / 2,
          degrees = 90;
      var isGlobe = projection.clipAngle && projection.clipAngle() === degrees;
      var isHidden = isGlobe && (0, _d3Geo.geoLength)(lineString) > radians;
      return _react["default"].createElement(G, {
        className: "rsm-marker".concat(pressed ? " rsm-marker--pressed" : "").concat(hover ? " rsm-marker--hover" : ""),
        transform: "translate(\n           ".concat(translation[0], "\n           ").concat(translation[1], "\n         ) ").concat(scale),
        style: style[isHidden ? "hidden" : pressed || hover ? pressed ? "pressed" : "hover" : "default"],
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        onMouseDown: this.handleMouseDown,
        onMouseUp: this.handleMouseUp,
        onClick: this.handleMouseClick,
        onMouseMove: this.handleMouseMove,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        tabIndex: tabable ? 0 : -1
      }, children);
    }
  }]);

  return Marker;
}(_react.Component);

Marker.defaultProps = {
  style: {
    "default": {},
    hover: {},
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