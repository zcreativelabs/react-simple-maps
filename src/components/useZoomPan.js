import { useEffect, useRef, useState, useContext, useCallback, useMemo } from "react"
import {
  zoom as d3Zoom,
  zoomIdentity as d3ZoomIdentity,
} from "d3-zoom"
import {
  select as d3Select,
  event as d3Event,
} from "d3-selection"

import { MapContext } from "./MapProvider"
import { getCoords } from "../utils"

export default function useZoomPan({
  center,
  filterZoomEvent,
  onMoveStart,
  onMoveEnd,
  onMove,
  translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
  scaleExtent = [1, 8],
  zoom = 1,
}) {
  const { width, height, projection } = useContext(MapContext)

  const [lon, lat] = center
  const [a, b] = translateExtent
  const [a1, a2] = a
  const [b1, b2] = b
  const [minZoom, maxZoom] = scaleExtent

  const bypassEvents = useRef(false)
  const lastPosition = useRef()
  const [mapRef, setMapRef] = useState()
  const svg = useMemo(() => mapRef && d3Select(mapRef), [mapRef])

  const [x, y] = useMemo(
    () => projection([lon, lat]).map((coord) => coord * zoom),
    [projection, lon, lat, zoom]
  )
  const calculatePosition = useCallback(
    () => ({ x: width / 2 - x, y: height / 2 - y, k: zoom }),
    [width, height, x, y, zoom]
  )
  const [position, setPosition] = useState(calculatePosition)

  const d3zoom = useMemo(() => {
    function handleZoomStart() {
      if (!onMoveStart || bypassEvents.current) return
      onMoveStart({ coordinates: projection.invert(getCoords(width, height, d3Event.transform)), zoom: d3Event.transform.k }, d3Event)
    }

    function handleZoom() {
      if (bypassEvents.current) return
      const {transform, sourceEvent} = d3Event
      setPosition({ x: transform.x, y: transform.y, k: transform.k, dragging: sourceEvent })
      if (!onMove) return
      onMove({ x: transform.x, y: transform.y, k: transform.k, dragging: sourceEvent }, d3Event)
    }

    function handleZoomEnd() {
      if (bypassEvents.current) {
        bypassEvents.current = false
        return
      }
      const [x, y] = projection.invert(getCoords(width, height, d3Event.transform))
      lastPosition.current = { x, y, k: d3Event.transform.k }
      if (!onMoveEnd) return
      onMoveEnd({ coordinates: [x, y], zoom: d3Event.transform.k }, d3Event)
    }

    function filterFunc() {
      if (filterZoomEvent) {
        return filterZoomEvent(d3Event)
      }
      return d3Event ? !d3Event.ctrlKey && !d3Event.button : false
    }

    return d3Zoom()
      .filter(filterFunc)
      .scaleExtent([minZoom, maxZoom])
      .translateExtent([[a1, a2], [b1, b2]])
      .on("start", handleZoomStart)
      .on("zoom", handleZoom)
      .on("end", handleZoomEnd)
  }, [width, height, a1, a2, b1, b2, minZoom, maxZoom, projection, onMoveStart, onMove, onMoveEnd, filterZoomEvent])

  useEffect(() => {
    const newPosition = calculatePosition()
    const samePosition = lastPosition.current &&
      newPosition.x === lastPosition.current.x &&
      newPosition.y === lastPosition.current.y &&
      newPosition.k === lastPosition.current.k
    if (!svg || samePosition) return

    bypassEvents.current = true
    svg.call(d3zoom.transform, d3ZoomIdentity.translate(width / 2 - x, height / 2 - y).scale(zoom))
    setPosition(newPosition)
  }, [svg, calculatePosition, d3zoom, width, height, x, y, zoom])

  useEffect(() => {
    lastPosition.current = position
  }, [position])

  return {
    mapRef: setMapRef,
    position,
    transformString: `translate(${position.x} ${position.y}) scale(${position.k})`,
  }
}
