"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _topojsonClient = require("topojson-client");

var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Geographies =
/*#__PURE__*/
function (_Component) {
  _inherits(Geographies, _Component);

  function Geographies(props) {
    var _this;

    _classCallCheck(this, Geographies);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Geographies).call(this, props));
    _this.state = {
      geographyPaths: _this.shouldFetchGeographies(props.geography) ? [] : _this.parseGeographies(props.geography)
    };
    return _this;
  }

  _createClass(Geographies, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.geography !== this.props.geography) {
        if (this.shouldFetchGeographies(nextProps.geography)) {
          this.fetchGeographies(nextProps.geography);
        } else {
          this.setState({
            geographyPaths: this.parseGeographies(nextProps.geography)
          });
        }
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var geoPathsChanged = nextState.geographyPaths.length !== this.state.geographyPaths.length;
      return geoPathsChanged || nextProps.disableOptimization;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.geographyUrl || this.props.geographyPaths) {
        console.warn("You are using the deprecated geographyUrl or geographyPaths props. Use the new geography prop instead. Check out the new docs here: https://github.com/zcreativelabs/react-simple-maps#Geographies-component");
      }

      if (this.shouldFetchGeographies(this.props.geography)) {
        this.fetchGeographies(this.props.geography);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.cancelPendingRequest();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          projection = _this$props.projection,
          style = _this$props.style,
          children = _this$props.children;
      return _react["default"].createElement(_reactNativeSvg.G, {
        className: "rsm-geographies",
        style: style
      }, children(this.state.geographyPaths || [], projection));
    }
  }, {
    key: "shouldFetchGeographies",
    value: function shouldFetchGeographies(geography) {
      return typeof geography === 'string';
    }
  }, {
    key: "parseGeographies",
    value: function parseGeographies(geography) {
      if (Array.isArray(geography)) {
        return geography;
      }

      if (Object.prototype.toString.call(geography) === '[object Object]') {
        return (0, _topojsonClient.feature)(geography, geography.objects[Object.keys(geography.objects)[0]]).features;
      }

      return [];
    }
  }, {
    key: "fetchGeographies",
    value: function fetchGeographies(geography) {
      var _this2 = this;

      var request = new XMLHttpRequest();
      request.open("GET", geography, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          var geographyPaths = JSON.parse(request.responseText);

          _this2.setState({
            geographyPaths: _this2.parseGeographies(geographyPaths)
          }, function () {
            if (_this2.props.onGeographyPathsLoaded) {
              _this2.props.onGeographyPathsLoaded(String(request.status));
            }
          });
        } else {
          if (_this2.props.onGeographyPathsLoaded) {
            _this2.props.onGeographyPathsLoaded(String(request.status));
          }
        }
      };

      request.onerror = function () {
        console.log("There was a connection error...");
      };

      request.send();
      this.cancelPendingRequest();
      this._xhr = request;
    }
  }, {
    key: "cancelPendingRequest",
    value: function cancelPendingRequest() {
      if (this._xhr) {
        this._xhr.abort();

        this._xhr = null;
      }
    }
  }]);

  return Geographies;
}(_react.Component);

Geographies.defaultProps = {
  componentIdentifier: "Geographies",
  disableOptimization: false,
  geography: ""
};
var _default = Geographies;
exports["default"] = _default;