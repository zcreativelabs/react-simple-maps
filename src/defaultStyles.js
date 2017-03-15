
export default {
  svg() {
    return {
      width: "100%",
      height: "auto",
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
        fill: choroplethValue ? choroplethValue.value : "#e6e6e6",
      },
      hover: {
        fill: "#ff0000",
        stroke: "#ffffff",
        cursor: "pointer",
      },
    }
  },
  marker(marker, zoom) {
    return {
      default: {
        stroke: "#00ffff",
        strokeWidth: 1.5,
        fill: marker.fill || "#000000",
      },
      hover: {
        fill: "#ff0000",
        cursor: "pointer",
      },
    }
  }
}
