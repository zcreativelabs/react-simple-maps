// Converted from this D3 demo:
//   https://observablehq.com/@d3/zoom-to-bounding-box
import { useEffect, useRef, useState, useContext } from "react"
import { zoom as d3Zoom, zoomIdentity } from "d3-zoom"
import { select, event as d3Event } from "d3-selection"

import { MapContext } from "./MapProvider"
import { getCoords } from "../utils"

export default function useZoomGeo({
  bounds,
  boundsMargin,
  duration,
  onMoveStart,
  onMove,
  onMoveEnd,
  scaleExtent = [1, 8],
}) {
  const { width, height, projection, path } = useContext(MapContext)

  const [position, setPosition] = useState({ x: 0, y: 0, k: 1 })
  const mapRef = useRef()
  const zoomRef = useRef()
  const transformRef = useRef()

  const [a, b] = [[-Infinity, -Infinity], [Infinity, Infinity]];
  const [a1, a2] = a
  const [b1, b2] = b
  const [minZoom, maxZoom] = scaleExtent

  useEffect(() => {
    const svg = select(mapRef.current)

    function handleZoomStart() {
      if (!onMoveStart) return
      onMoveStart({ coordinates: projection.invert(getCoords(width, height, d3Event.transform)), zoom: d3Event.transform.k }, d3Event)
    }
  
    function handleZoom() {
      const {transform, sourceEvent} = d3Event
      setPosition({ x: transform.x, y: transform.y, k: transform.k, dragging: sourceEvent })
      if (!onMove) return
      onMove({ x: transform.x, y: transform.y, k: transform.k, dragging: sourceEvent }, d3Event)
    }
  
    function handleZoomEnd() {
      transformRef.current = d3Event.transform;
      const [x, y] = projection.invert(getCoords(width, height, d3Event.transform))
      if (!onMoveEnd) return
      onMoveEnd({ coordinates: [x, y], zoom: d3Event.transform.k }, d3Event)
    }

    const zoom = d3Zoom()
      .scaleExtent([minZoom, maxZoom])
      .translateExtent([[a1, a1], [b1, b2]])
      .on("start", handleZoomStart)
      .on("zoom", handleZoom)
      .on("end", handleZoomEnd)

    zoomRef.current = zoom

    // Prevent the default zooming behaviors
    svg.call(zoom)
    .on("mousedown.zoom", null)
    .on("dblclick.zoom", null)
    .on("wheel.zoom", null)

  }, [width, height, a1, a2, b1, b2, minZoom, maxZoom, projection, onMoveStart, onMove, onMoveEnd])

  // Zoom to the specfied geometry so that it's centered and perfectly bound
  useEffect(() => {
    const svg = select(mapRef.current)
    const transform = zoomRef.current.transform

    if (bounds) {
      const [[x0, y0], [x1, y1]] = path.bounds(bounds);    
      svg.transition().duration(duration).call(
        transform,
        zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.min(maxZoom, (1 - boundsMargin) / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      );
    } else {
      svg.transition().duration(duration).call(
        transform,
        zoomIdentity,
        transformRef.current ? transformRef.current.invert([width / 2, height / 2]) : null
      );
    }
  }, [bounds, boundsMargin, duration, height, maxZoom, path, width]);

  return {
    mapRef,
    position,
    transformString: `translate(${position.x} ${position.y}) scale(${position.k})`,
    style: { strokeWidth: 1 / position.k },
  }
}
