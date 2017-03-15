"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Fetch = require("d3-fetch");

var _topojsonClient = require("topojson-client");

var _Loader = require("./Loader");

var _Loader2 = _interopRequireDefault(_Loader);

var _MapControls = require("./MapControls");

var _MapControls2 = _interopRequireDefault(_MapControls);

var _ZoomableGroup = require("./ZoomableGroup");

var _ZoomableGroup2 = _interopRequireDefault(_ZoomableGroup);

var _Geographies = require("./Geographies");

var _Geographies2 = _interopRequireDefault(_Geographies);

var _Markers = require("./Markers");

var _Markers2 = _interopRequireDefault(_Markers);

var _projections = require("./projections");

var _projections2 = _interopRequireDefault(_projections);

var _projectionConfig = require("./projectionConfig");

var _projectionConfig2 = _interopRequireDefault(_projectionConfig);

var _defaultStyles = require("./defaultStyles");

var _defaultStyles2 = _interopRequireDefault(_defaultStyles);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactSimpleMap = function (_React$Component) {
  _inherits(ReactSimpleMap, _React$Component);

  function ReactSimpleMap(props) {
    _classCallCheck(this, ReactSimpleMap);

    var _this = _possibleConstructorReturn(this, (ReactSimpleMap.__proto__ || Object.getPrototypeOf(ReactSimpleMap)).call(this, props));

    _this.state = {
      geographyPaths: props.geographyPaths,
      zoom: props.zoom,
      mouseX: (0, _utils.calculateMousePosition)("x", _this.projection.bind(_this), props, props.zoom, 1),
      mouseY: (0, _utils.calculateMousePosition)("y", _this.projection.bind(_this), props, props.zoom, 1),
      mouseXStart: 0,
      mouseYStart: 0,
      isPressed: false,
      loadingError: null,
      resizeFactorX: 1,
      resizeFactorY: 1
    };

    _this.projection = _this.projection.bind(_this);
    _this.fetchGeographies = _this.fetchGeographies.bind(_this);

    _this.handleZoomReset = _this.handleZoomReset.bind(_this);
    _this.handleZoomIn = _this.handleZoomIn.bind(_this);
    _this.handleZoomOut = _this.handleZoomOut.bind(_this);

    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
    return _this;
  }

  _createClass(ReactSimpleMap, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.zoom !== this.state.zoom || nextProps.center !== this.props.center) {
        this.setState({
          zoom: nextProps.zoom,
          mouseX: (0, _utils.calculateMousePosition)("x", this.projection, nextProps, nextProps.zoom, this.state.resizeFactorX),
          mouseY: (0, _utils.calculateMousePosition)("y", this.projection, nextProps, nextProps.zoom, this.state.resizeFactorY)
        });
      }
    }
  }, {
    key: "fetchGeographies",
    value: function fetchGeographies(geographyUrl) {
      var _this2 = this;

      if (!this.props.geographyUrl) return;
      (0, _d3Fetch.json)(geographyUrl).then(function (geographyPaths) {
        _this2.setState({
          geographyPaths: (0, _topojsonClient.feature)(geographyPaths, geographyPaths.objects[Object.keys(geographyPaths.objects)[0]]).features
        });
      }).catch(function (err) {
        _this2.setState({
          loadingError: err
        });
      });
    }
  }, {
    key: "projection",
    value: function projection() {
      if (typeof this.props.projection !== "function") {
        return (0, _projections2.default)(this.props.width, this.props.height, this.props.projectionConfig, this.props.projection);
      } else {
        return this.props.projection(this.props.width, this.props.height, this.props.projectionConfig);
      }
    }
  }, {
    key: "handleZoomIn",
    value: function handleZoomIn() {
      if (this.state.zoom < this.props.maxZoom) {
        this.setState({
          zoom: this.state.zoom * 2,
          mouseX: this.state.mouseX * 2,
          mouseY: this.state.mouseY * 2
        });
      }
    }
  }, {
    key: "handleZoomOut",
    value: function handleZoomOut() {
      if (this.state.zoom > this.props.minZoom) {
        this.setState({
          zoom: this.state.zoom / 2,
          mouseX: this.state.zoom === 2 ? (0, _utils.calculateMousePosition)("x", this.projection, this.props, this.props.minZoom, this.state.resizeFactorX) : this.state.mouseX / 2,
          mouseY: this.state.zoom === 2 ? (0, _utils.calculateMousePosition)("y", this.projection, this.props, this.props.minZoom, this.state.resizeFactorY) : this.state.mouseY / 2
        });
      }
    }
  }, {
    key: "handleZoomReset",
    value: function handleZoomReset() {
      if (this.state.zoom > this.props.minZoom) {
        this.setState({
          zoom: this.props.minZoom,
          mouseX: (0, _utils.calculateMousePosition)("x", this.projection, this.props, this.props.minZoom, this.state.resizeFactorX),
          mouseY: (0, _utils.calculateMousePosition)("y", this.projection, this.props, this.props.minZoom, this.state.resizeFactorY)
        });
      }
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(_ref) {
      var pageX = _ref.pageX,
          pageY = _ref.pageY;

      this.setState({
        isPressed: true,
        mouseXStart: pageX - this.state.mouseX,
        mouseYStart: pageY - this.state.mouseY
      });
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(_ref2) {
      var pageX = _ref2.pageX,
          pageY = _ref2.pageY;

      if (this.state.isPressed) {
        this.setState({
          mouseX: pageX - this.state.mouseXStart,
          mouseY: pageY - this.state.mouseYStart
        });
      }
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(_ref3) {
      var pageX = _ref3.pageX,
          pageY = _ref3.pageY;

      this.setState({
        isPressed: false
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      this.fetchGeographies(this.props.geographyUrl);

      var actualWidth = this.wrapperNode.clientWidth;
      var actualHeight = this.wrapperNode.clientHeight;
      var resizeFactorX = (0, _utils.calculateResizeFactor)(actualWidth, this.props.width);
      var resizeFactorY = (0, _utils.calculateResizeFactor)(actualHeight, this.props.height);

      this.setState({
        resizeFactorX: resizeFactorX,
        resizeFactorY: resizeFactorY,
        mouseX: (0, _utils.calculateMousePosition)("x", this.projection, this.props, this.state.zoom, resizeFactorX),
        mouseY: (0, _utils.calculateMousePosition)("y", this.projection, this.props, this.state.zoom, resizeFactorY)
      });

      window.addEventListener("resize", function () {
        var actualWidth = _this3.wrapperNode.clientWidth;
        var actualHeight = _this3.wrapperNode.clientHeight;
        var resizeFactorX = (0, _utils.calculateResizeFactor)(actualWidth, _this3.props.width);
        var resizeFactorY = (0, _utils.calculateResizeFactor)(actualHeight, _this3.props.height);
        _this3.setState({
          resizeFactorX: resizeFactorX,
          resizeFactorY: resizeFactorY,
          mouseX: (0, _utils.calculateMousePosition)("x", _this3.projection, _this3.props, _this3.state.zoom, resizeFactorX),
          mouseY: (0, _utils.calculateMousePosition)("y", _this3.projection, _this3.props, _this3.state.zoom, resizeFactorY)
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          width = _props.width,
          height = _props.height,
          styles = _props.styles,
          freezeGeographyPaths = _props.freezeGeographyPaths,
          markers = _props.markers,
          exclude = _props.exclude,
          include = _props.include,
          center = _props.center;
      var _state = this.state,
          geographyPaths = _state.geographyPaths,
          loadingError = _state.loadingError;


      return _react2.default.createElement(
        "div",
        { style: styles.wrapper ? styles.wrapper() : _defaultStyles2.default.wrapper(), className: "rsm-wrapper" },
        this.props.showControls ? _react2.default.createElement(_MapControls2.default, {
          handleZoomIn: this.handleZoomIn,
          handleZoomOut: this.handleZoomOut,
          handleZoomReset: this.handleZoomReset
        }) : null,
        geographyPaths.length === 0 ? _react2.default.createElement(_Loader2.default, {
          styles: styles.loader || _defaultStyles2.default.loader,
          loadingError: loadingError
        }) : null,
        _react2.default.createElement(
          "svg",
          { width: width,
            height: height,
            viewBox: "0 0 " + width + " " + height,
            style: styles.svg ? styles.svg() : _defaultStyles2.default.svg(),
            className: "rsm-svg",
            ref: function ref(wrapperNode) {
              return _this4.wrapperNode = wrapperNode;
            }
          },
          _react2.default.createElement(
            _ZoomableGroup2.default,
            {
              zoom: this.state.zoom,
              mouseX: this.state.mouseX,
              mouseY: this.state.mouseY,
              width: width,
              height: height,
              isPressed: this.state.isPressed,

              handleMouseMove: this.handleMouseMove,
              handleMouseUp: this.handleMouseUp,
              handleMouseDown: this.handleMouseDown,

              styles: styles,
              center: center,
              projection: this.projection,
              resizeFactorX: this.state.resizeFactorX,
              resizeFactorY: this.state.resizeFactorY
            },
            geographyPaths.length > 0 ? _react2.default.createElement(_Geographies2.default, {
              zoom: this.state.zoom,
              projection: this.projection,
              geographyPaths: geographyPaths,
              freezeGeographyPaths: freezeGeographyPaths,
              exclude: exclude,
              include: include,
              styles: styles,
              choropleth: this.props.choropleth,
              events: this.props.events.geography
            }) : null,
            geographyPaths.length > 0 ? _react2.default.createElement(_Markers2.default, {
              projection: this.projection,
              markers: markers,
              zoom: this.state.zoom,
              styles: styles,
              events: this.props.events.marker
            }) : null
          )
        )
      );
    }
  }]);

  return ReactSimpleMap;
}(_react2.default.Component);

ReactSimpleMap.propTypes = {
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  geographyUrl: _react.PropTypes.string,
  geographyPaths: _react.PropTypes.array,
  projection: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  freezeGeographyPaths: _react.PropTypes.bool,
  styles: _react.PropTypes.object,
  markers: _react.PropTypes.array,
  exclude: _react.PropTypes.array,
  include: _react.PropTypes.array,
  zoom: _react.PropTypes.number,
  minZoom: _react.PropTypes.number,
  maxZoom: _react.PropTypes.number,
  center: _react.PropTypes.array,
  projectionConfig: _react.PropTypes.object,
  choropleth: _react.PropTypes.object,
  showControls: _react.PropTypes.bool
};

ReactSimpleMap.defaultProps = {
  width: 800,
  height: 450,
  geographyUrl: null,
  geographyPaths: [],
  projection: "times",
  choropleth: {},
  freezeGeographyPaths: true,
  styles: _defaultStyles2.default,
  markers: [],
  exclude: [],
  include: [],
  zoom: 1,
  minZoom: 1,
  maxZoom: 8,
  center: [0, 0],
  projectionConfig: _projectionConfig2.default,
  showControls: false,
  events: {
    geography: {},
    marker: {}
  }
};

exports.default = ReactSimpleMap;