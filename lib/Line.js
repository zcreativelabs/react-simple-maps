"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Geo = require("d3-geo");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Line = function (_Component) {
  _inherits(Line, _Component);

  function Line(props) {
    _classCallCheck(this, Line);

    var _this = _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this, props));

    _this.state = {
      hover: false,
      pressed: false
    };

    _this.handleMouseEnter = _this.handleMouseEnter.bind(_this);
    _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
    _this.handleMouseClick = _this.handleMouseClick.bind(_this);
    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    _this.handleFocus = _this.handleFocus.bind(_this);
    _this.handleBlur = _this.handleBlur.bind(_this);
    return _this;
  }

  _createClass(Line, [{
    key: "handleMouseEnter",
    value: function handleMouseEnter(evt) {
      evt.persist();
      var _props = this.props,
          onMouseEnter = _props.onMouseEnter,
          line = _props.line;

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
      var _props2 = this.props,
          onMouseMove = _props2.onMouseMove,
          line = _props2.line;

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
      var _props3 = this.props,
          onMouseLeave = _props3.onMouseLeave,
          line = _props3.line;

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
      var _props4 = this.props,
          onMouseDown = _props4.onMouseDown,
          line = _props4.line;

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
      var _props5 = this.props,
          onMouseUp = _props5.onMouseUp,
          line = _props5.line;

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
      var _props6 = this.props,
          onClick = _props6.onClick,
          line = _props6.line,
          projection = _props6.projection;

      return onClick && onClick(line, [projection(line.coordinates.start), projection(line.coordinates.end)], evt);
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(evt) {
      evt.persist();
      var _props7 = this.props,
          onFocus = _props7.onFocus,
          line = _props7.line;

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
      var _props8 = this.props,
          onBlur = _props8.onBlur,
          line = _props8.line;

      this.setState({
        hover: false
      }, function () {
        return onBlur && onBlur(line, evt);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _props9 = this.props,
          className = _props9.className,
          projection = _props9.projection,
          line = _props9.line,
          style = _props9.style,
          tabable = _props9.tabable,
          zoom = _props9.zoom,
          preserveMarkerAspect = _props9.preserveMarkerAspect,
          width = _props9.width,
          height = _props9.height,
          buildPath = _props9.buildPath,
          strokeWidth = _props9.strokeWidth;
      var _state = this.state,
          pressed = _state.pressed,
          hover = _state.hover;


      var scale = preserveMarkerAspect ? " scale(" + 1 / zoom + ")" : "";

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

      var path = buildPath ? buildPath(start, end, line) : "M " + start.join(" ") + " L " + end.join(" ");

      return _react2.default.createElement("path", {
        className: "rsm-line" + (pressed ? " rsm-line--pressed" : "") + (hover ? " rsm-line--hover" : "") + " " + className,
        transform: "" + scale,
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
    default: {},
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

exports.default = Line;