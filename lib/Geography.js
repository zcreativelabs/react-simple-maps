"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _expo = require("expo");

var _d3Geo = require("d3-geo");

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

var Path = _expo.Svg.Path;
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
      hover: false,
      pressed: false
    };
    _this.handleMouseEnter = _this.handleMouseEnter.bind(_assertThisInitialized(_this));
    _this.handleMouseMove = _this.handleMouseMove.bind(_assertThisInitialized(_this));
    _this.handleMouseLeave = _this.handleMouseLeave.bind(_assertThisInitialized(_this));
    _this.handleMouseDown = _this.handleMouseDown.bind(_assertThisInitialized(_this));
    _this.handleMouseUp = _this.handleMouseUp.bind(_assertThisInitialized(_this));
    _this.handleMouseClick = _this.handleMouseClick.bind(_assertThisInitialized(_this));
    _this.handleFocus = _this.handleFocus.bind(_assertThisInitialized(_this));
    _this.handleBlur = _this.handleBlur.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Geography, [{
    key: "handleMouseClick",
    value: function handleMouseClick(evt) {
      console.log('onLongPress');
      evt.persist();
      var _this$props = this.props,
          onClick = _this$props.onClick,
          geography = _this$props.geography;
      return onClick && onClick(geography, evt);
    }
  }, {
    key: "handleMouseEnter",
    value: function handleMouseEnter(evt) {
      console.log('onPressIn');
      evt.persist();
      var _this$props2 = this.props,
          onMouseEnter = _this$props2.onMouseEnter,
          geography = _this$props2.geography;
      this.setState({
        hover: true
      }, function () {
        return onMouseEnter && onMouseEnter(geography, evt);
      });
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(evt) {
      evt.persist();
      if (this.state.pressed) return;
      var _this$props3 = this.props,
          onMouseMove = _this$props3.onMouseMove,
          geography = _this$props3.geography;

      if (!this.state.hover) {
        this.setState({
          hover: true
        }, function () {
          return onMouseMove && onMouseMove(geography, evt);
        });
      } else if (onMouseMove) onMouseMove(geography, evt);else return;
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave(evt) {
      console.log('onPressOut');
      evt.persist();
      var _this$props4 = this.props,
          onMouseLeave = _this$props4.onMouseLeave,
          geography = _this$props4.geography;
      this.setState({
        hover: false,
        pressed: false
      }, function () {
        return onMouseLeave && onMouseLeave(geography, evt);
      });
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(evt) {
      evt.persist();
      var _this$props5 = this.props,
          onMouseDown = _this$props5.onMouseDown,
          geography = _this$props5.geography;
      this.setState({
        pressed: true
      }, function () {
        return onMouseDown && onMouseDown(geography, evt);
      });
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(evt) {
      console.log('onPress');
      evt.persist();
      var _this$props6 = this.props,
          onMouseUp = _this$props6.onMouseUp,
          geography = _this$props6.geography;
      this.setState({
        pressed: false
      }, function () {
        return onMouseUp && onMouseUp(geography, evt);
      });
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(evt) {
      evt.persist();
      var _this$props7 = this.props,
          onFocus = _this$props7.onFocus,
          geography = _this$props7.geography;
      this.setState({
        hover: true
      }, function () {
        return onFocus && onFocus(geography, evt);
      });
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(evt) {
      evt.persist();
      var _this$props8 = this.props,
          onBlur = _this$props8.onBlur,
          geography = _this$props8.geography;
      this.setState({
        hover: false
      }, function () {
        return onBlur && onBlur(geography, evt);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props9 = this.props,
          geography = _this$props9.geography,
          projection = _this$props9.projection,
          round = _this$props9.round,
          cacheId = _this$props9.cacheId,
          precision = _this$props9.precision,
          tabable = _this$props9.tabable,
          style = _this$props9.style;
      var _this$state = this.state,
          hover = _this$state.hover,
          pressed = _this$state.pressed;
      var pathString = renderPath(cacheId, geography, projection, round, precision);
      var excludeProps = ["geography", "projection", "round", "cacheId", "precision", "tabable", "style", "onClick", "onMouseEnter", "onMouseMove", "onMouseLeave", "onMouseDown", "onMouseUp", "onFocus", "onBlur"];
      var restProps = Object.keys(this.props).filter(function (key) {
        return excludeProps.indexOf(key) === -1;
      }).reduce(function (obj, key) {
        obj[key] = _this2.props[key];
        return obj;
      }, {});
      return _react["default"].createElement(Path, _extends({
        d: pathString,
        className: "rsm-geography".concat(pressed ? " rsm-geography--pressed" : "").concat(hover ? " rsm-geography--hover" : ""),
        style: style[pressed || hover ? pressed ? "pressed" : "hover" : "default"] // onLongPress={this.handleMouseClick}
        // onPressIn={this.handleMouseEnter}
        // onMouseMove={this.handleMouseMove}
        // onPressOut={this.handleMouseLeave}
        // onMouseDown={this.handleMouseDown}
        // onPress={this.handleMouseUp}
        // onFocus={this.handleFocus}
        // onBlur={this.handleBlur}
        ,
        tabIndex: tabable ? 0 : -1
      }, restProps));
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
    hover: {},
    pressed: {}
  }
};
var _default = Geography;
exports["default"] = _default;