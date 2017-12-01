"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _topojsonClient = require("topojson-client");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Geographies = function (_Component) {
  _inherits(Geographies, _Component);

  function Geographies(props) {
    _classCallCheck(this, Geographies);

    var _this = _possibleConstructorReturn(this, (Geographies.__proto__ || Object.getPrototypeOf(Geographies)).call(this, props));

    _this.state = {
      geographyPaths: ""
    };

    _this.fetchGeographies = _this.fetchGeographies.bind(_this);
    return _this;
  }

  _createClass(Geographies, [{
    key: "fetchGeographies",
    value: function fetchGeographies(geography) {
      var _this2 = this;

      var _props = this.props,
          width = _props.width,
          height = _props.height;


      if (!geography) return;else if (Object.prototype.toString.call(geography) === '[object Object]') {
        this.setState({
          geographyPaths: (0, _topojsonClient.feature)(geography, geography.objects[Object.keys(geography.objects)[0]]).features
        });
      } else if (Array.isArray(geography)) {
        this.setState({ geographyPaths: geography });
      } else {
        var request = new XMLHttpRequest();
        request.open("GET", geography, true);

        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            var geographyPaths = JSON.parse(request.responseText);
            _this2.setState({
              geographyPaths: (0, _topojsonClient.feature)(geographyPaths, geographyPaths.objects[Object.keys(geographyPaths.objects)[0]]).features
            }, function () {
              if (!_this2.props.onGeographiesLoaded) return;
              _this2.props.onGeographyPathsLoaded(String(request.status));
            });
          } else {
            if (!_this2.props.onGeographiesLoaded) return;
            _this2.props.onGeographyPathsLoaded(String(request.status));
          }
        };
        request.onerror = function () {
          console.log("There was a connection error...");
        };
        request.send();
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.geography !== this.props.geography) {
        this.fetchGeographies(nextProps.geography);
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
      this.fetchGeographies(this.props.geography);
    }
  }, {
    key: "render",
    value: function render() {
      var _props2 = this.props,
          projection = _props2.projection,
          style = _props2.style,
          children = _props2.children;

      return _react2.default.createElement(
        "g",
        { className: "rsm-geographies", style: style },
        children(this.state.geographyPaths || [], projection)
      );
    }
  }]);

  return Geographies;
}(_react.Component);

Geographies.defaultProps = {
  componentIdentifier: "Geographies",
  disableOptimization: false,
  geography: ""
};

exports.default = Geographies;