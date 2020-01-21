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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var pathCache = {};

var renderPath = function renderPath(cacheId, geography, projection, round, precision) {
  if (pathCache[cacheId]) return pathCache[cacheId];
  var pathString = cacheId ? pathCache[cacheId] ? pathCache[cacheId] : round ? (0, _utils.roundPath)((0, _d3Geo.geoPath)().projection(projection)(geography), precision) : (0, _d3Geo.geoPath)().projection(projection)(geography) : round ? (0, _utils.roundPath)((0, _d3Geo.geoPath)().projection(projection)(geography), precision) : (0, _d3Geo.geoPath)().projection(projection)(geography);
  if (cacheId) pathCache[cacheId] = pathString;
  return pathString;
};

var Geography =
/*#__PURE__*/
function (_Component) {
  _inherits(Geography, _Component);

  function Geography() {
    var _this;

    _classCallCheck(this, Geography);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Geography).call(this));
    _this.state = {
      pressed: false
    };
    _this.onPress = _this.onPress.bind(_assertThisInitialized(_this));
    _this.onPressIn = _this.onPressIn.bind(_assertThisInitialized(_this));
    _this.onPressOut = _this.onPressOut.bind(_assertThisInitialized(_this));
    _this.onLongPress = _this.onLongPress.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Geography, [{
    key: "onPress",
    value: function onPress(event) {
      var _this$props = this.props,
          onPress = _this$props.onPress,
          geography = _this$props.geography;
      onPress && onPress(geography, event);
    }
  }, {
    key: "onPressIn",
    value: function onPressIn(event) {
      var _this$props2 = this.props,
          onPressIn = _this$props2.onPressIn,
          geography = _this$props2.geography;
      this.setState({
        pressed: true
      }, function () {
        onPressIn && onPressIn(geography, event);
      });
    }
  }, {
    key: "onPressOut",
    value: function onPressOut(event) {
      var _this$props3 = this.props,
          onPressOut = _this$props3.onPressOut,
          geography = _this$props3.geography;
      this.setState({
        pressed: false
      }, function () {
        onPressOut && onPressOut(geography, event);
      });
    }
  }, {
    key: "onLongPress",
    value: function onLongPress(event) {
      var _this$props4 = this.props,
          onLongPress = _this$props4.onLongPress,
          geography = _this$props4.geography;
      onLongPress && onLongPress(geography, event);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props5 = this.props,
          geography = _this$props5.geography,
          projection = _this$props5.projection,
          round = _this$props5.round,
          cacheId = _this$props5.cacheId,
          precision = _this$props5.precision,
          style = _this$props5.style;
      var pressed = this.state.pressed;
      var pathString = renderPath(cacheId, geography, projection, round, precision);
      var excludeProps = ["geography", "projection", "round", "cacheId", "precision", "style", "delayPressIn", "delayPressOut", "delayLongPress", "onPress", "onPressIn", "onPressOut", "onLongPress"];
      var restProps = Object.keys(this.props).filter(function (key) {
        return excludeProps.indexOf(key) === -1;
      }).reduce(function (obj, key) {
        obj[key] = _this2.props[key];
        return obj;
      }, {});
      var _this$props6 = this.props,
          _this$props6$delayPre = _this$props6.delayPressIn,
          delayPressIn = _this$props6$delayPre === void 0 ? 0 : _this$props6$delayPre,
          _this$props6$delayPre2 = _this$props6.delayPressOut,
          delayPressOut = _this$props6$delayPre2 === void 0 ? 0 : _this$props6$delayPre2,
          _this$props6$delayLon = _this$props6.delayLongPress,
          delayLongPress = _this$props6$delayLon === void 0 ? 0 : _this$props6$delayLon;
      return _react["default"].createElement(_reactNativeSvg.G, {
        onPress: this.onPress,
        onPressIn: this.onPressIn,
        onPressOut: this.onPressOut,
        onLongPress: this.onLongPress,
        delayPressIn: delayPressIn,
        delayPressOut: delayPressOut,
        delayLongPress: delayLongPress
      }, _react["default"].createElement(_reactNativeSvg.Path, _extends({
        d: pathString,
        style: style[pressed ? "pressed" : "default"]
      }, restProps)));
    }
  }]);

  return Geography;
}(_react.Component);

Geography.defaultProps = {
  precision: 0.1,
  cacheId: null,
  round: false,
  tabable: true,
  style: {
    "default": {},
    pressed: {}
  }
};
var _default = Geography;
exports["default"] = _default;