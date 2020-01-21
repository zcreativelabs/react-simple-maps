"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _d3Geo = require("d3-geo");

var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));

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

var Line =
/*#__PURE__*/
function (_Component) {
  _inherits(Line, _Component);

  function Line(props) {
    var _this;

    _classCallCheck(this, Line);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Line).call(this, props));
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

  _createClass(Line, [{
    key: "handleMouseEnter",
    value: function handleMouseEnter(evt) {
      evt.persist();
      var _this$props = this.props,
          onMouseEnter = _this$props.onMouseEnter,
          line = _this$props.line;
      this.setState({
        hover: true
      }, function () {
        return onMouseEnter && onMouseEnter(line, evt);
      });
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(evt) {
      evt.persist();
      if (this.state.pressed) return;
      var _this$props2 = this.props,
          onMouseMove = _this$props2.onMouseMove,
          line = _this$props2.line;

      if (!this.state.hover) {
        this.setState({
          hover: true
        }, function () {
          return onMouseMove && onMouseMove(line, evt);
        });
      } else if (onMouseMove) onMouseMove(line, evt);else return;
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave(evt) {
      evt.persist();
      var _this$props3 = this.props,
          onMouseLeave = _this$props3.onMouseLeave,
          line = _this$props3.line;
      this.setState({
        hover: false
      }, function () {
        return onMouseLeave && onMouseLeave(line, evt);
      });
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(evt) {
      evt.persist();
      var _this$props4 = this.props,
          onMouseDown = _this$props4.onMouseDown,
          line = _this$props4.line;
      this.setState({
        pressed: true
      }, function () {
        return onMouseDown && onMouseDown(line, evt);
      });
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(evt) {
      evt.persist();
      var _this$props5 = this.props,
          onMouseUp = _this$props5.onMouseUp,
          line = _this$props5.line;
      this.setState({
        pressed: false
      }, function () {
        return onMouseUp && onMouseUp(line, evt);
      });
    }
  }, {
    key: "handleMouseClick",
    value: function handleMouseClick(evt) {
      if (!this.props.onClick) return;
      evt.persist();
      var _this$props6 = this.props,
          onClick = _this$props6.onClick,
          line = _this$props6.line,
          projection = _this$props6.projection;
      return onClick && onClick(line, [projection(line.coordinates.start), projection(line.coordinates.end)], evt);
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(evt) {
      evt.persist();
      var _this$props7 = this.props,
          onFocus = _this$props7.onFocus,
          line = _this$props7.line;
      this.setState({
        hover: true
      }, function () {
        return onFocus && onFocus(line, evt);
      });
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(evt) {
      evt.persist();
      var _this$props8 = this.props,
          onBlur = _this$props8.onBlur,
          line = _this$props8.line;
      this.setState({
        hover: false
      }, function () {
        return onBlur && onBlur(line, evt);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props9 = this.props,
          className = _this$props9.className,
          projection = _this$props9.projection,
          line = _this$props9.line,
          style = _this$props9.style,
          tabable = _this$props9.tabable,
          zoom = _this$props9.zoom,
          preserveMarkerAspect = _this$props9.preserveMarkerAspect,
          width = _this$props9.width,
          height = _this$props9.height,
          buildPath = _this$props9.buildPath,
          strokeWidth = _this$props9.strokeWidth;
      var _this$state = this.state,
          pressed = _this$state.pressed,
          hover = _this$state.hover;
      var scale = preserveMarkerAspect ? " scale(".concat(1 / zoom, ")") : "";

      var buildLineString = function buildLineString(coordinates) {
        return {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [projection.invert([width / 2, height / 2]), coordinates]
          }
        };
      };

      var startLineString = buildLineString(line.coordinates.start);
      var endLineString = buildLineString(line.coordinates.end);
      var radians = Math.PI / 2,
          degrees = 90;
      var isGlobe = projection.clipAngle && projection.clipAngle() === degrees;
      var isHidden = isGlobe && ((0, _d3Geo.geoLength)(startLineString) > radians || (0, _d3Geo.geoLength)(endLineString) > radians);
      var start = projection(line.coordinates.start);
      var end = projection(line.coordinates.end);
      var path = buildPath ? buildPath(start, end, line) : "M ".concat(start.join(" "), " L ").concat(end.join(" "));
      return _react["default"].createElement(_reactNativeSvg.Path, {
        className: "rsm-line".concat(pressed ? " rsm-line--pressed" : "").concat(hover ? " rsm-line--hover" : "", " ").concat(className),
        transform: "".concat(scale),
        style: style[isHidden ? "hidden" : pressed || hover ? pressed ? "pressed" : "hover" : "default"],
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        onMouseDown: this.handleMouseDown,
        onMouseUp: this.handleMouseUp,
        onClick: this.handleMouseClick,
        onMouseMove: this.handleMouseMove,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        tabIndex: tabable ? 0 : -1,
        d: path,
        strokeWidth: strokeWidth
      });
    }
  }]);

  return Line;
}(_react.Component);

Line.defaultProps = {
  style: {
    "default": {},
    hover: {},
    pressed: {}
  },
  line: {
    coordinates: {
      start: [0, 0],
      end: [-99.1, 19.4]
    }
  },
  tabable: true,
  preserveMarkerAspect: true,
  strokeWidth: 1,
  className: ""
};
var _default = Line;
exports["default"] = _default;