"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _defaultStyles = require("./defaultStyles");

var _defaultStyles2 = _interopRequireDefault(_defaultStyles);

var _Marker = require("./Marker");

var _Marker2 = _interopRequireDefault(_Marker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Markers = function (_React$Component) {
  _inherits(Markers, _React$Component);

  function Markers() {
    _classCallCheck(this, Markers);

    return _possibleConstructorReturn(this, (Markers.__proto__ || Object.getPrototypeOf(Markers)).apply(this, arguments));
  }

  _createClass(Markers, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        "g",
        { className: "rsm-markers" },
        this.props.markers.map(function (marker, i) {
          return _react2.default.createElement(_Marker2.default, {
            key: Math.abs(marker.coordinates[0]) + "-" + Math.abs(marker.coordinates[1]) + "-" + i,
            projection: _this2.props.projection,
            marker: marker,
            styles: _this2.props.styles.marker,
            events: _this2.props.events,
            zoom: _this2.props.zoom
          });
        })
      );
    }
  }]);

  return Markers;
}(_react2.default.Component);

Markers.propTypes = {
  markers: _react.PropTypes.array,
  projection: _react.PropTypes.func.isRequired,
  zoom: _react.PropTypes.number,
  events: _react.PropTypes.object,
  styles: _react.PropTypes.object
};

Markers.defaultProps = {
  markers: [],
  zoom: 1,
  events: {},
  styles: _defaultStyles2.default
};

exports.default = Markers;