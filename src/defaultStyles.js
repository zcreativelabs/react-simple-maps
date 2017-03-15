
export default {
  svg() {
    return {
      width: "100%",
      height: "100%",
    }
  },
  wrapper() {
    return {
      position: "relative",
    }
  },
  loader() {
    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: 20,
      padding: "1rem",
      textAlign: "center",
    }
  },
  geographies(zoom) {
    return {
      strokeWidth: 0.5 / zoom,
      cursor: "all-scroll",
    }
  },
  geography(choroplethValue, geography) {
    return {
      default: {
        stroke: "#ffffff",
        fill: choroplethValue ? choroplethValue.value : "#e9e7e5",
      },
      hover: {
        fill: choroplethValue ? choroplethValue.value : "#d9d7d5",
        stroke: "#ffffff",
        cursor: "pointer",
      },
    }
  },
  marker(marker, zoom) {
    return {
      default: {
        stroke: "#ffffff",
        strokeWidth: 1.5,
        fill: marker.fill || "#F44336",
      },
      hover: {
        stroke: "#ffffff",
        strokeWidth: 1.5,
        fill: "#E53935",
        cursor: "pointer",
      },
    }
  }
}
