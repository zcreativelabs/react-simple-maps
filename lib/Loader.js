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

var Loader = function (_React$Component) {
  _inherits(Loader, _React$Component);

  function Loader() {
    _classCallCheck(this, Loader);

    return _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).apply(this, arguments));
  }

  _createClass(Loader, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          waitMessage = _props.waitMessage,
          errorHeading = _props.errorHeading,
          loadingError = _props.loadingError,
          styles = _props.styles;


      return _react2.default.createElement(
        "div",
        { style: styles ? styles() : _defaultStyles2.default.loader(), className: "rsm-loader" },
        loadingError ? _react2.default.createElement(
          "span",
          null,
          errorHeading,
          _react2.default.createElement("br", null),
          loadingError
        ) : _react2.default.createElement(
          "span",
          null,
          waitMessage
        )
      );
    }
  }]);

  return Loader;
}(_react2.default.Component);

Loader.propTypes = {
  waitMessage: _react.PropTypes.string,
  errorHeading: _react.PropTypes.string,
  loadingError: _react.PropTypes.string,
  styles: _react.PropTypes.func
};

Loader.defaultProps = {
  waitMessage: "Loading map...",
  errorHeading: "Couldn't load map",
  loadingError: null,
  styles: _defaultStyles2.default.loader
};

exports.default = Loader;