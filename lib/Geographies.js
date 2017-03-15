"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _defaultStyles = require("./defaultStyles");

var _defaultStyles2 = _interopRequireDefault(_defaultStyles);

var _utils = require("./utils");

var _Geography = require("./Geography");

var _Geography2 = _interopRequireDefault(_Geography);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Geographies = function (_React$Component) {
  _inherits(Geographies, _React$Component);

  function Geographies() {
    _classCallCheck(this, Geographies);

    return _possibleConstructorReturn(this, (Geographies.__proto__ || Object.getPrototypeOf(Geographies)).apply(this, arguments));
  }

  _createClass(Geographies, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var geoPathsChanged = nextProps.geographyPaths.length !== this.props.geographyPaths.length;
      var includesChanged = nextProps.include.length !== this.props.include.length;
      var excludesChanged = nextProps.exclude.length !== this.props.exclude.length;
      var choroplethChanged = JSON.stringify(nextProps.choropleth) !== JSON.stringify(this.props.choropleth);
      return !this.props.freezeGeographyPaths || geoPathsChanged || includesChanged || excludesChanged || choroplethChanged;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var styles = this.props.styles.geography || _defaultStyles2.default.geography;

      return _react2.default.createElement(
        "g",
        { className: "rsm-geographies" },
        this.props.geographyPaths.map(function (geography, i) {
          var included = _this2.props.include.indexOf(geography.id) !== -1;
          var notExcluded = _this2.props.exclude.indexOf(geography.id) === -1;
          var shouldInclude = _this2.props.include.length > 0 ? included : notExcluded;

          return shouldInclude ? _react2.default.createElement(_Geography2.default, {
            zoom: _this2.props.zoom,
            key: geography.id ? geography.id + "-" + i : i,
            geography: geography,
            projection: _this2.props.projection,
            choroplethValue: _this2.props.choropleth[geography.id],
            styles: styles,
            events: _this2.props.events
          }) : null;
        })
      );
    }
  }]);

  return Geographies;
}(_react2.default.Component);

Geographies.propTypes = {
  geographyPaths: _react.PropTypes.array,
  projection: _react.PropTypes.func.isRequired,
  freezeGeographyPaths: _react.PropTypes.bool,
  exclude: _react.PropTypes.array,
  include: _react.PropTypes.array,
  styles: _react.PropTypes.object,
  choropleth: _react.PropTypes.object,
  events: _react.PropTypes.object
};

Geographies.defaultProps = {
  geographyPaths: [],
  freezeGeographyPaths: true,
  exclude: [],
  include: [],
  styles: _defaultStyles2.default,
  choropleth: {},
  events: {}
};

exports.default = Geographies;