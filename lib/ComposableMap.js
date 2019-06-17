"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactNative = require("react-native");

var _expo = require("expo");

var _projections = require("./projections");

var _projections2 = _interopRequireDefault(_projections);

var _projectionConfig = require("./projectionConfig");

var _projectionConfig2 = _interopRequireDefault(_projectionConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Defs = _expo.Svg.Defs,
    G = _expo.Svg.G,
    Rect = _expo.Svg.Rect;


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

var ComposableMap = function (_Component) {
  _inherits(ComposableMap, _Component);

  function ComposableMap(props) {
    _classCallCheck(this, ComposableMap);

    var _this = _possibleConstructorReturn(this, (ComposableMap.__proto__ || Object.getPrototypeOf(ComposableMap)).call(this, props));

    _this.projection = _this.projection.bind(_this);
    _this.onLayoutChange = _this.onLayoutChange.bind(_this);
    _this.state = {
      parentWidth: 0,
      parentHeight: 0,
      zoom: 1,
      left: 0,
      top: 0
    };
    return _this;
  }

  _createClass(ComposableMap, [{
    key: "processPinch",
    value: function processPinch(x1, y1, x2, y2) {
      var distance = calcDistance(x1, y1, x2, y2);

      var _calcCenter = calcCenter(x1, y1, x2, y2),
          x = _calcCenter.x,
          y = _calcCenter.y;

      if (!this.state.isZooming) {
        var _state = this.state,
            top = _state.top,
            left = _state.left,
            zoom = _state.zoom;

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
        var _state2 = this.state,
            initialX = _state2.initialX,
            initialY = _state2.initialY,
            initialTop = _state2.initialTop,
            initialLeft = _state2.initialLeft,
            initialZoom = _state2.initialZoom,
            initialDistance = _state2.initialDistance;


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
        var _state3 = this.state,
            top = _state3.top,
            left = _state3.left;

        this.setState({
          isMoving: true,
          isZooming: false,
          initialLeft: left,
          initialTop: top,
          initialX: x,
          initialY: y
        });
      } else {
        var _state4 = this.state,
            initialX = _state4.initialX,
            initialY = _state4.initialY,
            initialLeft = _state4.initialLeft,
            initialTop = _state4.initialTop;

        var dx = x - initialX;
        var dy = y - initialY;
        this.setState({
          left: initialLeft + dx,
          top: initialTop + dy
        });
      }
    }
  }, {
    key: "projection",
    value: function projection() {
      var _props = this.props,
          projection = _props.projection,
          projectionConfig = _props.projectionConfig,
          width = _props.width,
          height = _props.height;


      return typeof projection !== "function" ? (0, _projections2.default)(width, height, projectionConfig, projection) : projection(width, height, projectionConfig);
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
      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height,
          style = _props2.style,
          className = _props2.className,
          showCenter = _props2.showCenter,
          children = _props2.children,
          aspectRatio = _props2.aspectRatio,
          viewBox = _props2.viewBox,
          defs = _props2.defs;
      var _state5 = this.state,
          left = _state5.left,
          top = _state5.top,
          zoom = _state5.zoom;

      var viewBoxSize = 65;
      var resolution = viewBoxSize / Math.min(height, width);

      return _react2.default.createElement(
        _reactNative.View,
        this._panResponder.panHandlers,
        _react2.default.createElement(
          _expo.Svg,
          {
            width: width,
            height: height,
            viewBox: viewBox ? viewBox : "0 0 " + width + " " + height,
            className: "rsm-svg " + (className || ""),
            style: style,
            preserveAspectRatio: aspectRatio
          },
          defs && _react2.default.createElement(
            Defs,
            null,
            defs
          ),
          _react2.default.createElement(
            G,
            {
              transform: {
                translateX: left * resolution,
                translateY: top * resolution,
                scale: zoom
              }
            },
            _react2.default.cloneElement(this.props.children, {
              projection: this.projection(),
              width: width,
              height: height,
              parentHeight: this.state.parentHeight,
              parentWidth: this.state.parentWidth
            })
          ),
          showCenter && _react2.default.createElement(
            G,
            null,
            _react2.default.createElement(Rect, { x: width / 2 - 0.5, y: 0, width: 1, height: height, fill: "#e91e63" }),
            _react2.default.createElement(Rect, { x: 0, y: height / 2 - 0.5, width: width, height: 1, fill: "#e91e63" })
          )
        )
      );
    }
  }]);

  return ComposableMap;
}(_react.Component);

ComposableMap.defaultProps = {
  width: 800,
  height: 450,
  projection: "times",
  projectionConfig: _projectionConfig2.default,
  aspectRatio: "xMidYMid",
  viewBox: null
};

exports.default = ComposableMap;