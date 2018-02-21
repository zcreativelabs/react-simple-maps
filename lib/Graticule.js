"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Geo = require("d3-geo");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var computeGraticule = function computeGraticule(projection, step) {
  return (0, _d3Geo.geoPath)().projection(projection)((0, _d3Geo.geoGraticule)().step(step)());
};

var computeOutline = function computeOutline(projection) {
  return (0, _d3Geo.geoPath)().projection(projection)((0, _d3Geo.geoGraticule)().outline());
};

var Graticule = function (_Component) {
  _inherits(Graticule, _Component);

  function Graticule() {
    _classCallCheck(this, Graticule);

    var _this = _possibleConstructorReturn(this, (Graticule.__proto__ || Object.getPrototypeOf(Graticule)).call(this));

    _this.state = {
      renderGraticule: false,
      graticulePath: "",
      outlinePath: ""
    };
    _this.renderGraticule = _this.renderGraticule.bind(_this);
    return _this;
  }

  _createClass(Graticule, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.renderGraticule();
    }
  }, {
    key: "renderGraticule",
    value: function renderGraticule() {
      var _props = this.props,
          step = _props.step,
          projection = _props.projection,
          round = _props.round,
          precision = _props.precision;


      this.setState({
        renderGraticule: true,
        graticulePath: round ? (0, _utils.roundPath)(computeGraticule(projection, step), precision) : computeGraticule(projection, step),
        outlinePath: round ? (0, _utils.roundPath)(computeOutline(projection), precision) : computeOutline(projection)
      });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _props2 = this.props,
          step = _props2.step,
          projection = _props2.projection,
          round = _props2.round,
          precision = _props2.precision,
          globe = _props2.globe;


      if (nextProps.round !== round || nextProps.precision !== precision || globe) {
        this.setState({
          graticulePath: nextProps.round ? (0, _utils.roundPath)(computeGraticule(projection, step), precision) : computeGraticule(projection, step),
          outlinePath: nextProps.round ? (0, _utils.roundPath)(computeOutline(projection), precision) : computeOutline(projection)
        });
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.disableOptimization;
    }
  }, {
    key: "render",
    value: function render() {
      var _props3 = this.props,
          zoom = _props3.zoom,
          style = _props3.style,
          outline = _props3.outline,
          fill = _props3.fill,
          stroke = _props3.stroke;


      return this.state.renderGraticule && _react2.default.createElement(
        "g",
        { className: "rsm-graticule" },
        _react2.default.createElement("path", {
          fill: fill,
          stroke: stroke,
          d: this.state.graticulePath,
          style: style
        }),
        outline && _react2.default.createElement("path", {
          fill: fill,
          stroke: stroke,
          d: this.state.outlinePath,
          style: style
        })
      );
    }
  }]);

  return Graticule;
}(_react.Component);

Graticule.defaultProps = {
  componentIdentifier: "Graticule",
  disableOptimization: true,
  globe: false,
  round: true,
  precision: 0.1,
  step: [10, 10],
  outline: true,
  stroke: "#DDDDDD",
  fill: "transparent",
  style: {
    pointerEvents: "none"
  }
};

exports.default = Graticule;