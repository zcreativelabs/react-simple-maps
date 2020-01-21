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

var computeGraticule = function computeGraticule(projection, step) {
  return (0, _d3Geo.geoPath)().projection(projection)((0, _d3Geo.geoGraticule)().step(step)());
};

var computeOutline = function computeOutline(projection) {
  return (0, _d3Geo.geoPath)().projection(projection)((0, _d3Geo.geoGraticule)().outline());
};

var Graticule =
/*#__PURE__*/
function (_Component) {
  _inherits(Graticule, _Component);

  function Graticule() {
    var _this;

    _classCallCheck(this, Graticule);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Graticule).call(this));
    _this.state = {
      renderGraticule: false,
      graticulePath: "",
      outlinePath: ""
    };
    _this.renderGraticule = _this.renderGraticule.bind(_assertThisInitialized(_this));
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
      var _this$props = this.props,
          step = _this$props.step,
          projection = _this$props.projection,
          round = _this$props.round,
          precision = _this$props.precision;
      this.setState({
        renderGraticule: true,
        graticulePath: round ? (0, _utils.roundPath)(computeGraticule(projection, step), precision) : computeGraticule(projection, step),
        outlinePath: round ? (0, _utils.roundPath)(computeOutline(projection), precision) : computeOutline(projection)
      });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this$props2 = this.props,
          step = _this$props2.step,
          projection = _this$props2.projection,
          round = _this$props2.round,
          precision = _this$props2.precision,
          globe = _this$props2.globe;

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
      var _this$props3 = this.props,
          zoom = _this$props3.zoom,
          style = _this$props3.style,
          outline = _this$props3.outline,
          fill = _this$props3.fill,
          stroke = _this$props3.stroke;
      return this.state.renderGraticule && _react["default"].createElement(_reactNativeSvg.G, {
        className: "rsm-graticule"
      }, _react["default"].createElement("path", {
        fill: fill,
        stroke: stroke,
        d: this.state.graticulePath,
        style: style
      }), outline && _react["default"].createElement(_reactNativeSvg.Path, {
        fill: fill,
        stroke: stroke,
        d: this.state.outlinePath,
        style: style
      }));
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
var _default = Graticule;
exports["default"] = _default;