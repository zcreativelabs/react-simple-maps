"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapControls = function (_React$Component) {
  _inherits(MapControls, _React$Component);

  function MapControls() {
    _classCallCheck(this, MapControls);

    return _possibleConstructorReturn(this, (MapControls.__proto__ || Object.getPrototypeOf(MapControls)).apply(this, arguments));
  }

  _createClass(MapControls, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "rsm-controls" },
        _react2.default.createElement(
          "button",
          { onClick: this.props.handleZoomIn, className: "rsm-controls__zoom-in" },
          "Zoom in"
        ),
        _react2.default.createElement(
          "button",
          { onClick: this.props.handleZoomOut, className: "rsm-controls__zoom-out" },
          "Zoom out"
        ),
        _react2.default.createElement(
          "button",
          { onClick: this.props.handleZoomReset, className: "rsm-controls__zoom-reset" },
          "Zoom Reset"
        )
      );
    }
  }]);

  return MapControls;
}(_react2.default.Component);

exports.default = MapControls;