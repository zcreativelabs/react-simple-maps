"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (width, height, config, projectionName) {

  var scale = config.scale || _projectionConfig2.default.scale;
  var xOffset = config.xOffset || _projectionConfig2.default.xOffset;
  var yOffset = config.yOffset || _projectionConfig2.default.yOffset;
  var rotation = config.rotation || _projectionConfig2.default.rotation;
  var precision = config.precision || _projectionConfig2.default.precision;

  var baseProjection = projectionReference[projectionName]().scale(scale).translate([xOffset + width / 2, yOffset + height / 2]).precision(precision);

  return projectionName === "albersUsa" ? baseProjection : projectionName === "orthographic" ? baseProjection.rotate(rotation).clipAngle(90) : baseProjection.rotate(rotation);
};

var _d3GeoProjection = require("d3-geo-projection");

var _d3Geo = require("d3-geo");

var _projectionConfig = require("./projectionConfig");

var _projectionConfig2 = _interopRequireDefault(_projectionConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectionReference = {
  mercator: _d3Geo.geoMercator,
  miller: _d3GeoProjection.geoMiller,
  times: _d3GeoProjection.geoTimes,
  robinson: _d3GeoProjection.geoRobinson,
  winkel3: _d3GeoProjection.geoWinkel3,
  eckert4: _d3GeoProjection.geoEckert4,
  albersUsa: _d3Geo.geoAlbersUsa,
  orthographic: _d3Geo.geoOrthographic
};