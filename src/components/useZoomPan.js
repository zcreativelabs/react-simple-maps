import { useEffect, useRef, useState, useContext } from "react"
import { zoom as d3Zoom, zoomIdentity as d3ZoomIdentity } from "d3-zoom"
import { select as d3Select } from "d3-selection"

import { MapContext } from "./MapProvider"
import { getCoords } from "../utils"

export default function useZoomPan({
  center,
  filterZoomEvent,
  onMoveStart,
  onMoveEnd,
  onMove,
  translateExtent = [
    [-Infinity, -Infinity],
    [Infinity, Infinity],
  ],
  scaleExtent = [1, 8],
  zoom = 1,
}) {
  const { width, height, projection } = useContext(MapContext)

  const [lon, lat] = center
  const [position, setPosition] = useState({ x: 0, y: 0, k: 1 })
  const lastPosition = useRef({ x: 0, y: 0, k: 1 })
  const mapRef = useRef()
  const zoomRef = useRef()
  const bypassEvents = useRef(false)

  const [a, b] = translateExtent
  const [a1, a2] = a
  const [b1, b2] = b
  const [minZoom, maxZoom] = scaleExtent

  useEffect(() => {
    const svg = d3Select(mapRef.current)

    function handleZoomStart(d3Event) {
      if (!onMoveStart || bypassEvents.current) return
      onMoveStart(
        {
          coordinates: projection.invert(
            getCoords(width, height, d3Event.transform)
          ),
          zoom: d3Event.transform.k,
        },
        d3Event
      )
    }

    function handleZoom(d3Event) {
      if (bypassEvents.current) return
      const { transform, sourceEvent } = d3Event
      setPosition({
        x: transform.x,
        y: transform.y,
        k: transform.k,
        dragging: sourceEvent,
      })
      if (!onMove) return
      onMove(
        {
          x: transform.x,
          y: transform.y,
          zoom: transform.k,
          dragging: sourceEvent,
        },
        d3Event
      )
    }

    function handleZoomEnd(d3Event) {
      if (bypassEvents.current) {
        bypassEvents.current = false
        return
      }
      const [x, y] = projection.invert(
        getCoords(width, height, d3Event.transform)
      )
      lastPosition.current = { x, y, k: d3Event.transform.k }
      if (!onMoveEnd) return
      onMoveEnd({ coordinates: [x, y], zoom: d3Event.transform.k }, d3Event)
    }

    function filterFunc(d3Event) {
      if (filterZoomEvent) {
        return filterZoomEvent(d3Event)
      }
      return d3Event ? !d3Event.ctrlKey && !d3Event.button : false
    }

    const zoom = d3Zoom()
      .filter(filterFunc)
      .scaleExtent([minZoom, maxZoom])
      .translateExtent([
        [a1, a2],
        [b1, b2],
      ])
      .on("start", handleZoomStart)
      .on("zoom", handleZoom)
      .on("end", handleZoomEnd)

    zoomRef.current = zoom
    svg.call(zoom)
  }, [
    width,
    height,
    a1,
    a2,
    b1,
    b2,
    minZoom,
    maxZoom,
    projection,
    onMoveStart,
    onMove,
    onMoveEnd,
    filterZoomEvent,
  ])

  useEffect(() => {
    if (
      lon === lastPosition.current.x &&
      lat === lastPosition.current.y &&
      zoom === lastPosition.current.k
    )
      return

    const coords = projection([lon, lat])
    const x = coords[0] * zoom
    const y = coords[1] * zoom
    const svg = d3Select(mapRef.current)

    bypassEvents.current = true

    svg.call(
      zoomRef.current.transform,
      d3ZoomIdentity.translate(width / 2 - x, height / 2 - y).scale(zoom)
    )
    setPosition({ x: width / 2 - x, y: height / 2 - y, k: zoom })

    lastPosition.current = { x: lon, y: lat, k: zoom }
  }, [lon, lat, zoom, width, height, projection])

  return {
    mapRef,
    position,
    transformString: `translate(${position.x} ${position.y}) scale(${position.k})`,
  }
}
