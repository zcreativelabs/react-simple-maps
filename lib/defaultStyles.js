"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  svg: function svg() {
    return {
      width: "100%",
      height: "100%"
    };
  },
  wrapper: function wrapper() {
    return {
      position: "relative"
    };
  },
  loader: function loader() {
    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: 20,
      padding: "1rem",
      textAlign: "center"
    };
  },
  geographies: function geographies(zoom) {
    return {
      strokeWidth: 0.5 / zoom,
      cursor: "all-scroll"
    };
  },
  geography: function geography(choroplethValue, _geography) {
    return {
      default: {
        stroke: "#ffffff",
        fill: choroplethValue ? choroplethValue.value : "#e9e7e5"
      },
      hover: {
        fill: choroplethValue ? choroplethValue.value : "#d9d7d5",
        stroke: "#ffffff",
        cursor: "pointer"
      }
    };
  },
  marker: function marker(_marker, zoom) {
    return {
      default: {
        stroke: "#ffffff",
        strokeWidth: 1.5,
        fill: _marker.fill || "#F44336"
      },
      hover: {
        stroke: "#ffffff",
        strokeWidth: 1.5,
        fill: "#E53935",
        cursor: "pointer"
      }
    };
  }
};