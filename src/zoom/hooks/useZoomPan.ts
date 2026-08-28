import { useEffect, useRef, useState } from "react"
import { zoom as d3Zoom, zoomIdentity as d3ZoomIdentity, ZoomBehavior } from "d3-zoom"
import { select as d3Select } from "d3-selection"
import { useMapContext } from "../../core/index"
import type {
  UseZoomPanProps,
  UseZoomPanReturn,
  ZoomPanPosition,
  ZoomGestureEvent,
} from "../types"

function getCoords(
  w: number,
  h: number,
  t: { x: number; y: number; k: number }
): [number, number] {
  const xOffset = (w * t.k - w) / 2
  const yOffset = (h * t.k - h) / 2
  return [w / 2 - (xOffset + t.x) / t.k, h / 2 - (yOffset + t.y) / t.k]
}

export default function useZoomPan({
  center = [0, 0],
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
}: UseZoomPanProps): UseZoomPanReturn {
  const { width, height, projection } = useMapContext()

  const [lon, lat] = center
  const [position, setPosition] = useState<ZoomPanPosition>({
    x: 0,
    y: 0,
    k: 1,
  })
  const lastPosition = useRef({ x: 0, y: 0, k: 1 })
  const mapRef = useRef<SVGGElement>(null)
  const zoomRef = useRef<ZoomBehavior<SVGGElement, unknown> | null>(null)
  const bypassEvents = useRef(false)

  const [a, b] = translateExtent
  const [a1, a2] = a
  const [b1, b2] = b
  const [minZoom, maxZoom] = scaleExtent

  // Callback props are read through refs inside the gesture handlers below,
  // instead of being closed over directly. This keeps the binding effect's
  // dependency array free of onMoveStart/onMove/onMoveEnd/filterZoomEvent,
  // so passing a new inline function for one of them on every render (the
  // common JSX pattern) does not tear down and rebuild the d3-zoom behavior
  // on every render. The no-deps effect below runs after every render, so
  // each ref always holds that render's callback - handlers never see a
  // stale one.
  const onMoveStartRef = useRef(onMoveStart)
  const onMoveRef = useRef(onMove)
  const onMoveEndRef = useRef(onMoveEnd)
  const filterZoomEventRef = useRef(filterZoomEvent)

  useEffect(() => {
    onMoveStartRef.current = onMoveStart
    onMoveRef.current = onMove
    onMoveEndRef.current = onMoveEnd
    filterZoomEventRef.current = filterZoomEvent
  })

  useEffect(() => {
    const mapNode = mapRef.current
    if (!mapNode) return

    const svg = d3Select(mapNode)

    const handleZoomStart = (d3Event: ZoomGestureEvent) => {
      if (!onMoveStartRef.current || bypassEvents.current) return
      const coordinates = projection.invert?.(
        getCoords(width, height, d3Event.transform)
      )
      onMoveStartRef.current(
        {
          coordinates: coordinates ?? undefined,
          zoom: d3Event.transform.k,
        },
        d3Event
      )
    }

    const handleZoom = (d3Event: ZoomGestureEvent) => {
      if (bypassEvents.current) return
      const { transform, sourceEvent } = d3Event
      setPosition({
        x: transform.x,
        y: transform.y,
        k: transform.k,
        dragging: sourceEvent,
      })
      if (!onMoveRef.current) return
      onMoveRef.current(
        {
          x: transform.x,
          y: transform.y,
          zoom: transform.k,
          dragging: sourceEvent,
        },
        d3Event
      )
    }

    const handleZoomEnd = (d3Event: ZoomGestureEvent) => {
      if (bypassEvents.current) {
        bypassEvents.current = false
        return
      }
      const coordinates = projection.invert?.(
        getCoords(width, height, d3Event.transform)
      )
      if (coordinates) {
        const [x, y] = coordinates
        lastPosition.current = { x, y, k: d3Event.transform.k }
      }
      if (!onMoveEndRef.current) return
      onMoveEndRef.current(
        { coordinates: coordinates ?? undefined, zoom: d3Event.transform.k },
        d3Event
      )
    }

    const filterFunc = (d3Event: Event) => {
      if (filterZoomEventRef.current) {
        return filterZoomEventRef.current(d3Event)
      }
      const mouseEvent = d3Event as MouseEvent
      return d3Event ? !mouseEvent.ctrlKey && !mouseEvent.button : false
    }

    const zoomBehavior = d3Zoom<SVGGElement, unknown>()
      .extent([
        [0, 0],
        [width, height],
      ])
      .filter(filterFunc)
      .scaleExtent([minZoom, maxZoom])
      .translateExtent([
        [a1, a2],
        [b1, b2],
      ])
      .on("start", handleZoomStart)
      .on("zoom", handleZoom)
      .on("end", handleZoomEnd)

    zoomRef.current = zoomBehavior
    svg.call(zoomBehavior)
  }, [width, height, a1, a2, b1, b2, minZoom, maxZoom, projection])

  useEffect(() => {
    if (
      lon === lastPosition.current.x &&
      lat === lastPosition.current.y &&
      zoom === lastPosition.current.k
    )
      return

    const coords = projection([lon, lat])
    if (!coords) return
    const x = coords[0] * zoom
    const y = coords[1] * zoom

    if (!mapRef.current || !zoomRef.current) return
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
