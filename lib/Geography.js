"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Geo = require("d3-geo");

var _defaultStyles = require("./defaultStyles");

var _defaultStyles2 = _interopRequireDefault(_defaultStyles);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Geography = function (_React$Component) {
  _inherits(Geography, _React$Component);

  function Geography() {
    _classCallCheck(this, Geography);

    var _this = _possibleConstructorReturn(this, (Geography.__proto__ || Object.getPrototypeOf(Geography)).call(this));

    _this.state = {
      hovered: false
    };

    _this.handleMouseEnter = _this.handleMouseEnter.bind(_this);
    _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(Geography, [{
    key: "handleMouseEnter",
    value: function handleMouseEnter(geography, evt) {
      evt.preventDefault();
      this.setState({ hovered: true });
      if (this.props.events.onMouseEnter) {
        this.props.events.onMouseEnter(geography, evt);
      }
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave(geography, evt) {
      evt.preventDefault();
      this.setState({ hovered: false });
      if (this.props.events.onMouseLeave) {
        this.props.events.onMouseLeave(geography, evt);
      }
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(geography, evt) {
      evt.preventDefault();
      if (this.props.events.onMouseMove) {
        this.props.events.onMouseMove(geography, evt);
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(geography, evt) {
      evt.preventDefault();
      if (this.props.events.onClick) {
        this.props.events.onClick(geography, evt);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var changedHoverState = this.state.hovered !== nextState.hovered;
      var changedChoroplethValue = this.props.choroplethValue !== nextProps.choroplethValue;
      var changedGeography = this.props.geography !== nextProps.geography;
      return changedGeography || changedChoroplethValue || changedHoverState;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          geography = _props.geography,
          projection = _props.projection,
          styles = _props.styles,
          choroplethValue = _props.choroplethValue;


      return _react2.default.createElement("path", {
        d: (0, _d3Geo.geoPath)().projection(projection())(geography),
        onMouseEnter: function onMouseEnter(evt) {
          return _this2.handleMouseEnter(geography, evt);
        },
        onMouseLeave: function onMouseLeave(evt) {
          return _this2.handleMouseLeave(geography, evt);
        },
        onMouseMove: function onMouseMove(evt) {
          return _this2.handleMouseMove(geography, evt);
        },
        onClick: function onClick(evt) {
          return _this2.handleClick(geography, evt);
        },
        style: styles(choroplethValue, geography)[this.state.hovered ? "hover" : "default"] || styles(choroplethValue, geography)["default"],
        className: "rsm-geography"
      });
    }
  }]);

  return Geography;
}(_react2.default.Component);

Geography.propTypes = {
  geography: _react.PropTypes.object.isRequired,
  projection: _react.PropTypes.func.isRequired,
  choroplethValue: _react.PropTypes.object,
  events: _react.PropTypes.object
};

Geography.defaultProps = {
  styles: _defaultStyles2.default.geography,
  events: {}
};

exports.default = Geography;