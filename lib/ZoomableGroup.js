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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ZoomableGroup =
/*#__PURE__*/
function (_Component) {
  _inherits(ZoomableGroup, _Component);

  function ZoomableGroup(props) {
    var _this;

    _classCallCheck(this, ZoomableGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ZoomableGroup).call(this, props));
    var backdrop = (0, _utils.computeBackdrop)(props.projection, props.backdrop);
    _this.state = {
      mouseX: (0, _utils.calculateMousePosition)("x", props.projection, props, props.zoom, 1),
      mouseY: (0, _utils.calculateMousePosition)("y", props.projection, props, props.zoom, 1),
      mouseXStart: 0,
      mouseYStart: 0,
      isPressed: false,
      resizeFactorX: 1,
      resizeFactorY: 1,
      backdrop: {
        width: Math.round(backdrop.width),
        height: Math.round(backdrop.height),
        x: Math.round(backdrop.x),
        y: Math.round(backdrop.y)
      }
    };
    _this.handleMouseMove = _this.handleMouseMove.bind(_assertThisInitialized(_this));
    _this.handleMouseUp = _this.handleMouseUp.bind(_assertThisInitialized(_this));
    _this.handleMouseDown = _this.handleMouseDown.bind(_assertThisInitialized(_this));
    _this.handleTouchStart = _this.handleTouchStart.bind(_assertThisInitialized(_this));
    _this.handleTouchMove = _this.handleTouchMove.bind(_assertThisInitialized(_this));
    _this.handleResize = _this.handleResize.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ZoomableGroup, [{
    key: "handleMouseMove",
    value: function handleMouseMove(_ref) {
      var pageX = _ref.pageX,
          pageY = _ref.pageY;
      if (this.props.disablePanning) return;
      if (!this.state.isPressed) return;
      this.setState({
        mouseX: pageX - this.state.mouseXStart,
        mouseY: pageY - this.state.mouseYStart
      });
    }
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(_ref2) {
      var touches = _ref2.touches;
      this.handleMouseMove(touches[0]);
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp() {
      if (this.props.disablePanning) return;
      if (!this.state.isPressed) return;
      this.setState({
        isPressed: false
      });
      if (!this.props.onMoveEnd) return;
      var _this$state = this.state,
          mouseX = _this$state.mouseX,
          mouseY = _this$state.mouseY,
          resizeFactorX = _this$state.resizeFactorX,
          resizeFactorY = _this$state.resizeFactorY;
      var _this$props = this.props,
          zoom = _this$props.zoom,
          width = _this$props.width,
          height = _this$props.height,
          projection = _this$props.projection,
          onMoveEnd = _this$props.onMoveEnd;
      var x = width / 2 - mouseX * resizeFactorX / zoom;
      var y = height / 2 - mouseY * resizeFactorY / zoom;
      var newCenter = projection.invert([x, y]);
      onMoveEnd(newCenter);
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(_ref3) {
      var pageX = _ref3.pageX,
          pageY = _ref3.pageY;
      if (this.props.disablePanning) return;
      var _this$state2 = this.state,
          mouseX = _this$state2.mouseX,
          mouseY = _this$state2.mouseY,
          resizeFactorX = _this$state2.resizeFactorX,
          resizeFactorY = _this$state2.resizeFactorY;
      var _this$props2 = this.props,
          zoom = _this$props2.zoom,
          width = _this$props2.width,
          height = _this$props2.height,
          projection = _this$props2.projection,
          onMoveStart = _this$props2.onMoveStart;
      this.setState({
        isPressed: true,
        mouseXStart: pageX - mouseX,
        mouseYStart: pageY - mouseY
      });
      if (!onMoveStart) return;
      var x = width / 2 - mouseX * resizeFactorX / zoom;
      var y = height / 2 - mouseY * resizeFactorY / zoom;
      var currentCenter = projection.invert([x, y]);
      onMoveStart(currentCenter);
    }
  }, {
    key: "handleTouchStart",
    value: function handleTouchStart(_ref4) {
      var touches = _ref4.touches;

      if (touches.length > 1) {
        this.handleMouseDown(touches[0]);
      } else {
        this.handleMouseUp();
      }
    }
  }, {
    key: "preventTouchScroll",
    value: function preventTouchScroll(evt) {
      if (evt.touches.length > 1) {
        evt.preventDefault();
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this$state3 = this.state,
          mouseX = _this$state3.mouseX,
          mouseY = _this$state3.mouseY,
          resizeFactorX = _this$state3.resizeFactorX,
          resizeFactorY = _this$state3.resizeFactorY;
      var _this$props3 = this.props,
          projection = _this$props3.projection,
          center = _this$props3.center,
          zoom = _this$props3.zoom;
      var zoomFactor = nextProps.zoom / zoom;
      var centerChanged = JSON.stringify(nextProps.center) !== JSON.stringify(center);
      this.setState({
        zoom: nextProps.zoom,
        mouseX: centerChanged ? (0, _utils.calculateMousePosition)("x", nextProps.projection, nextProps, nextProps.zoom, resizeFactorX) : mouseX * zoomFactor,
        mouseY: centerChanged ? (0, _utils.calculateMousePosition)("y", nextProps.projection, nextProps, nextProps.zoom, resizeFactorY) : mouseY * zoomFactor
      });
    }
  }, {
    key: "handleResize",
    value: function handleResize() {
      var _this$props4 = this.props,
          width = _this$props4.width,
          height = _this$props4.height,
          projection = _this$props4.projection,
          zoom = _this$props4.zoom;
      var resizeFactorX = 1; // calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().width, width)

      var resizeFactorY = 1; // calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().height, height)

      var xPercentageChange = 1 / resizeFactorX * this.state.resizeFactorX;
      var yPercentageChange = 1 / resizeFactorY * this.state.resizeFactorY;
      this.setState({
        resizeFactorX: resizeFactorX,
        resizeFactorY: resizeFactorY,
        mouseX: this.state.mouseX * xPercentageChange,
        mouseY: this.state.mouseY * yPercentageChange
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props5 = this.props,
          width = _this$props5.width,
          height = _this$props5.height,
          projection = _this$props5.projection,
          zoom = _this$props5.zoom;
      var resizeFactorX = 1; // calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().width, width)

      var resizeFactorY = 1; // calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().height, height)

      this.setState({
        resizeFactorX: resizeFactorX,
        resizeFactorY: resizeFactorY,
        mouseX: (0, _utils.calculateMousePosition)("x", projection, this.props, zoom, resizeFactorX),
        mouseY: (0, _utils.calculateMousePosition)("y", projection, this.props, zoom, resizeFactorY)
      }); // window.addEventListener("resize", this.handleResize)
      // window.addEventListener("mouseup", this.handleMouseUp)
      // this.zoomableGroupNode.addEventListener("touchmove", this.preventTouchScroll)
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {// window.removeEventListener("resize", this.handleResize)
      // window.removeEventListener("mouseup", this.handleMouseUp)
      // this.zoomableGroupNode.removeEventListener("touchmove", this.preventTouchScroll)
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props6 = this.props,
          width = _this$props6.width,
          height = _this$props6.height,
          zoom = _this$props6.zoom,
          style = _this$props6.style,
          projection = _this$props6.projection,
          children = _this$props6.children;
      var _this$state4 = this.state,
          mouseX = _this$state4.mouseX,
          mouseY = _this$state4.mouseY,
          resizeFactorX = _this$state4.resizeFactorX,
          resizeFactorY = _this$state4.resizeFactorY;
      return _react["default"].createElement(_reactNativeSvg.G, {
        className: "rsm-zoomable-group",
        ref: function ref(zoomableGroupNode) {
          return _this2.zoomableGroupNode = zoomableGroupNode;
        },
        transform: "\n           translate(\n             ".concat(Math.round((width / 2 + resizeFactorX * mouseX) * 100) / 100, "\n             ").concat(Math.round((height / 2 + resizeFactorY * mouseY) * 100) / 100, "\n           )\n           scale(").concat(zoom, ")\n           translate(").concat(-width / 2, " ").concat(-height / 2, ")\n         "),
        onMouseMove: this.handleMouseMove,
        onMouseUp: this.handleMouseUp,
        onMouseDown: this.handleMouseDown,
        onTouchStart: this.handleTouchStart,
        onTouchMove: this.handleTouchMove,
        onTouchEnd: this.handleMouseUp,
        style: style
      }, _react["default"].createElement(_reactNativeSvg.Rect, {
        x: this.state.backdrop.x,
        y: this.state.backdrop.y,
        width: this.state.backdrop.width,
        height: this.state.backdrop.height,
        fill: "transparent",
        style: {
          strokeWidth: 0
        }
      }), (0, _utils.createNewChildren)(children, this.props));
    }
  }]);

  return ZoomableGroup;
}(_react.Component);

ZoomableGroup.defaultProps = {
  center: [0, 0],
  backdrop: {
    x: [-179.9, 179.9],
    y: [89.9, -89.9]
  },
  zoom: 1,
  disablePanning: false
};
var _default = ZoomableGroup;
exports["default"] = _default;