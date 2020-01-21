"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));

var _reactNativeSvgPanZoom = _interopRequireWildcard(require("react-native-svg-pan-zoom"));

var _projections = _interopRequireDefault(require("./projections"));

var _projectionConfig = _interopRequireDefault(require("./projectionConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function calcDistance(x1, y1, x2, y2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function middle(p1, p2) {
  return (p1 + p2) / 2;
}

function calcCenter(x1, y1, x2, y2) {
  return {
    x: middle(x1, x2),
    y: middle(y1, y2)
  };
}

var ZoomableMap =
/*#__PURE__*/
function (_Component) {
  _inherits(ZoomableMap, _Component);

  function ZoomableMap(props) {
    var _this;

    _classCallCheck(this, ZoomableMap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ZoomableMap).call(this, props));
    _this.projection = _this.projection.bind(_assertThisInitialized(_this));
    _this.onLayoutChange = _this.onLayoutChange.bind(_assertThisInitialized(_this));
    _this.state = {
      parentWidth: 0,
      parentHeight: 0,
      zoom: 1,
      left: 0,
      top: 0
    };
    return _this;
  }

  _createClass(ZoomableMap, [{
    key: "processPinch",
    value: function processPinch(x1, y1, x2, y2) {
      var distance = calcDistance(x1, y1, x2, y2);

      var _calcCenter = calcCenter(x1, y1, x2, y2),
          x = _calcCenter.x,
          y = _calcCenter.y;

      if (!this.state.isZooming) {
        var _this$state = this.state,
            top = _this$state.top,
            left = _this$state.left,
            zoom = _this$state.zoom;
        this.setState({
          isZooming: true,
          initialX: x,
          initialY: y,
          initialTop: top,
          initialLeft: left,
          initialZoom: zoom,
          initialDistance: distance
        });
      } else {
        var _this$state2 = this.state,
            initialX = _this$state2.initialX,
            initialY = _this$state2.initialY,
            initialTop = _this$state2.initialTop,
            initialLeft = _this$state2.initialLeft,
            initialZoom = _this$state2.initialZoom,
            initialDistance = _this$state2.initialDistance;
        var touchZoom = distance / initialDistance;
        var dx = x - initialX;
        var dy = y - initialY;

        var _left = (initialLeft + dx - x) * touchZoom + x;

        var _top = (initialTop + dy - y) * touchZoom + y;

        var _zoom = initialZoom * touchZoom;

        this.setState({
          zoom: _zoom,
          left: _left,
          top: _top
        });
      }
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      this._panResponder = _reactNative.PanResponder.create({
        onPanResponderGrant: function onPanResponderGrant() {},
        onPanResponderTerminate: function onPanResponderTerminate() {},
        onMoveShouldSetPanResponder: function onMoveShouldSetPanResponder() {
          return true;
        },
        onStartShouldSetPanResponder: function onStartShouldSetPanResponder() {
          return true;
        },
        onShouldBlockNativeResponder: function onShouldBlockNativeResponder() {
          return true;
        },
        onPanResponderTerminationRequest: function onPanResponderTerminationRequest() {
          return true;
        },
        onMoveShouldSetPanResponderCapture: function onMoveShouldSetPanResponderCapture() {
          return true;
        },
        onStartShouldSetPanResponderCapture: function onStartShouldSetPanResponderCapture() {
          return true;
        },
        onPanResponderMove: function onPanResponderMove(evt) {
          var touches = evt.nativeEvent.touches;
          var length = touches.length;

          if (length === 1) {
            var _touches = _slicedToArray(touches, 1),
                _touches$ = _touches[0],
                locationX = _touches$.locationX,
                locationY = _touches$.locationY;

            _this2.processTouch(locationX, locationY);
          } else if (length === 2) {
            var _touches2 = _slicedToArray(touches, 2),
                touch1 = _touches2[0],
                touch2 = _touches2[1];

            _this2.processPinch(touch1.locationX, touch1.locationY, touch2.locationX, touch2.locationY);
          }
        },
        onPanResponderRelease: function onPanResponderRelease() {
          _this2.setState({
            isZooming: false,
            isMoving: false
          });
        }
      });
    }
  }, {
    key: "processTouch",
    value: function processTouch(x, y) {
      if (!this.state.isMoving || this.state.isZooming) {
        var _this$state3 = this.state,
            top = _this$state3.top,
            left = _this$state3.left;
        this.setState({
          isMoving: true,
          isZooming: false,
          initialLeft: left,
          initialTop: top,
          initialX: x,
          initialY: y
        });
      } else {
        var _this$state4 = this.state,
            initialX = _this$state4.initialX,
            initialY = _this$state4.initialY,
            initialLeft = _this$state4.initialLeft,
            initialTop = _this$state4.initialTop;
        var dx = x - initialX;
        var dy = y - initialY;
        console.log("left", initialLeft + dx, x, initialX);
        console.log("top", initialTop + dy, y, initialY);
        this.setState({
          left: initialLeft + dx,
          top: initialTop + dy
        });
      }
    }
  }, {
    key: "projection",
    value: function projection() {
      var _this$props = this.props,
          projection = _this$props.projection,
          projectionConfig = _this$props.projectionConfig,
          width = _this$props.width,
          height = _this$props.height;
      return typeof projection !== "function" ? (0, _projections["default"])(width, height, projectionConfig, projection) : projection(width, height, projectionConfig);
    }
  }, {
    key: "onLayoutChange",
    value: function onLayoutChange(event) {
      this.setState({
        parentWidth: event.nativeEvent.layout.width,
        parentHeight: event.nativeEvent.layout.height
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          width = _this$props2.width,
          height = _this$props2.height,
          resolution = _this$props2.resolution,
          style = _this$props2.style,
          showCenter = _this$props2.showCenter,
          children = _this$props2.children,
          aspectRatio = _this$props2.aspectRatio,
          viewBox = _this$props2.viewBox,
          defs = _this$props2.defs,
          restProps = _objectWithoutProperties(_this$props2, ["width", "height", "resolution", "style", "showCenter", "children", "aspectRatio", "viewBox", "defs"]);

      var _this$state5 = this.state,
          left = _this$state5.left,
          top = _this$state5.top,
          zoom = _this$state5.zoom;
      return (// <View {...this._panResponder.panHandlers}>
        _react["default"].createElement(_reactNativeSvgPanZoom["default"], _extends({
          canvasHeight: height,
          canvasWidth: width,
          minScale: 0.5,
          maxScale: 10,
          initialZoom: 0.7,
          onZoom: function onZoom(zoom) {
            console.log("onZoom:" + zoom);
          },
          canvasStyle: {
            backgroundColor: "yellow"
          },
          viewStyle: {
            backgroundColor: "green"
          }
        }, restProps), defs && _react["default"].createElement(_reactNativeSvg.Defs, null, defs), _react["default"].Children.map(Array.isArray(children) ? children : [children], function (child) {
          return _react["default"].cloneElement(child, {
            projection: _this3.projection(),
            width: width,
            height: height,
            zoom: zoom,
            parentHeight: _this3.state.parentHeight,
            parentWidth: _this3.state.parentWidth
          });
        }), showCenter && _react["default"].createElement(_reactNativeSvg.G, null, _react["default"].createElement(_reactNativeSvg.Rect, {
          x: width / 2 - 0.5,
          y: 0,
          width: 1,
          height: height,
          fill: "#e91e63"
        }), _react["default"].createElement(_reactNativeSvg.Rect, {
          x: 0,
          y: height / 2 - 0.5,
          width: width,
          height: 1,
          fill: "#e91e63"
        }))) // </View>

      );
    }
  }]);

  return ZoomableMap;
}(_react.Component);

ZoomableMap.defaultProps = {
  width: 800,
  height: 450,
  projection: "times",
  projectionConfig: _projectionConfig["default"],
  aspectRatio: "xMidYMid",
  viewBox: null
};
var _default = ZoomableMap;
exports["default"] = _default;