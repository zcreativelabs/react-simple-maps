"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _defaultStyles = require("./defaultStyles");

var _defaultStyles2 = _interopRequireDefault(_defaultStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Marker = function (_Component) {
  _inherits(Marker, _Component);

  function Marker() {
    _classCallCheck(this, Marker);

    var _this = _possibleConstructorReturn(this, (Marker.__proto__ || Object.getPrototypeOf(Marker)).call(this));

    _this.state = {
      hovered: false
    };

    _this.handleMouseEnter = _this.handleMouseEnter.bind(_this);
    _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(Marker, [{
    key: "handleMouseEnter",
    value: function handleMouseEnter(marker, evt) {
      evt.preventDefault();
      this.setState({ hovered: true });
      if (this.props.events.onMouseEnter) {
        this.props.events.onMouseEnter(marker, evt);
      }
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave(marker, evt) {
      evt.preventDefault();
      this.setState({ hovered: false });
      if (this.props.events.onMouseLeave) {
        this.props.events.onMouseLeave(marker, evt);
      }
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(marker, evt) {
      evt.preventDefault();
      if (this.props.events.onMouseMove) {
        this.props.events.onMouseMove(marker, evt);
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(marker, evt) {
      evt.preventDefault();
      if (this.props.events.onClick) {
        this.props.events.onClick(marker, evt);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var hoverStateChanged = nextState.hovered !== this.state.hovered;
      var radiusChanged = nextProps.marker.radius !== this.props.marker.radius;
      var zoomChanged = nextProps.zoom !== this.props.zoom;
      return hoverStateChanged || radiusChanged || zoomChanged;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          marker = _props.marker,
          styles = _props.styles,
          zoom = _props.zoom,
          projection = _props.projection;


      return _react2.default.createElement("circle", {
        cx: projection()(marker.coordinates)[0],
        cy: projection()(marker.coordinates)[1],
        r: marker.radius,
        style: styles(marker, zoom)[this.state.hovered ? "hover" : "default"] || styles(marker, zoom)["default"],
        className: "rsm-marker",
        onMouseEnter: function onMouseEnter(evt) {
          return _this2.handleMouseEnter(marker, evt);
        },
        onMouseLeave: function onMouseLeave(evt) {
          return _this2.handleMouseLeave(marker, evt);
        },
        onMouseMove: function onMouseMove(evt) {
          return _this2.handleMouseMove(marker, evt);
        },
        onClick: function onClick(evt) {
          return _this2.handleClick(marker, evt);
        },
        transform: "\n          translate(\n            " + projection()(marker.coordinates)[0] + "\n            " + projection()(marker.coordinates)[1] + "\n          )\n          scale(\n            " + 1 / zoom + "\n          )\n          translate(\n            " + -projection()(marker.coordinates)[0] + "\n            " + -projection()(marker.coordinates)[1] + "\n          )\n        "
      });
    }
  }]);

  return Marker;
}(_react.Component);

Marker.propTypes = {
  marker: _react.PropTypes.object,
  zoom: _react.PropTypes.number,
  events: _react.PropTypes.object,
  projection: _react.PropTypes.func,
  styles: _react.PropTypes.func
};

Marker.defaultProps = {
  marker: {},
  zoom: 1,
  events: {},
  styles: _defaultStyles2.default.marker
};

exports.default = Marker;