
import { useRef, useState, useContext, useEffect, useLayoutEffect } from "react"

import { MapContext } from "./MapProvider"

export default function useZoomPan({
  center = [0, 0],
  zoom = 1,
  minZoom = 1,
  maxZoom = 5,
  zoomSensitivity = 0.025,
  onZoomStart,
  onZoomEnd,
  onMoveStart,
  onMoveEnd,
  disablePanning = false,
  disableZooming = false,
}) {
  const { width, height, projection } = useContext(MapContext)
  const wheelTimer = useRef(null)

  const [position, setPosition] = useState(() => {
    const c = projection(center)
    return {
      x: width / 2 - c[0] * zoom,
      y: height / 2 - c[1] * zoom,
      last: [
        width / 2 - c[0] * zoom,
        height / 2 - c[1] * zoom,
      ],
      zoom,
      dragging: false,
      zooming: false,
    }
  })

  const elRef = useRef()
  const point = useRef()
  const isPointerDown = useRef(false)
  const pointerOrigin = useRef()

  function getPointFromEvent(event) {
    const svg = elRef.current.closest("svg")
    if (event.targetTouches) {
      point.current.x = event.targetTouches[0].clientX
      point.current.y = event.targetTouches[0].clientY
    } else {
      point.current.x = event.clientX
      point.current.y = event.clientY
    }
    const invertedSVGMatrix = svg.getScreenCTM().inverse()
    return point.current.matrixTransform(invertedSVGMatrix)
  }

  function onPointerDown(event) {
    if (disablePanning) return
    isPointerDown.current = true
    pointerOrigin.current = getPointFromEvent(event)
    setPosition(position => {
      if (onMoveStart) onMoveStart(event, { ...position, dragging: true })
      return { ...position, dragging: true }
    })
  }

  function onPointerMove (event) {
    if (!isPointerDown.current) return
    event.preventDefault()
    const pointerPosition = getPointFromEvent(event)
    setPosition(position => ({
      ...position,
      x: position.last[0] + (pointerPosition.x - pointerOrigin.current.x),
      y: position.last[1] + (pointerPosition.y - pointerOrigin.current.y),
    }))
  }

  function onPointerUp(event) {
    isPointerDown.current = false
    setPosition(position => {
      if (onMoveEnd) {
        onMoveEnd(
          event,
          { ...position, last: [position.x, position.y], dragging: false }
        )
      }
      return {
        ...position,
        last: [position.x, position.y],
        dragging: false,
      }
    })
  }

  function handleWheel(event) {
    if (!event.ctrlKey) return
    if (disableZooming) return
    event.preventDefault()

    const speed = event.deltaY * zoomSensitivity

    setPosition(position => {
      const newZoom = position.zoom - speed
      const zoom = newZoom < minZoom
        ? minZoom
        : newZoom > maxZoom
          ? maxZoom
          : newZoom

      const pointerPosition = getPointFromEvent(event)

      const x = (position.x - pointerPosition.x) * zoom / position.zoom + pointerPosition.x
      const y = (position.y - pointerPosition.y) * zoom / position.zoom + pointerPosition.y

      window.clearTimeout(wheelTimer.current)
      wheelTimer.current = setTimeout(() => {
        setPosition(position => {
          if (onZoomEnd) onZoomEnd(event, position)
          return { ...position, zooming: false }
        })
      }, 66)

      if (onZoomStart) {
        onZoomStart(event, {
          ...position,
          x,
          y,
          last: [x, y],
          zoom,
          zooming: true,
        })
      }

      return {
        ...position,
        x,
        y,
        last: [x, y],
        zoom,
        zooming: true,
      }
    })
  }

  useLayoutEffect(() => {
    const svg = elRef.current.closest("svg")
    point.current = svg.createSVGPoint()

    svg.addEventListener("wheel", handleWheel)

    if (window.PointerEvent) {
      svg.addEventListener("pointerdown", onPointerDown)
      svg.addEventListener("pointerup", onPointerUp)
      svg.addEventListener("pointerleave", onPointerUp)
      svg.addEventListener("pointermove", onPointerMove)
    } else {
      svg.addEventListener("mousedown", onPointerDown)
      svg.addEventListener("mouseup", onPointerUp)
      svg.addEventListener("mouseleave", onPointerUp)
      svg.addEventListener("mousemove", onPointerMove)
      svg.addEventListener("touchstart", onPointerDown)
      svg.addEventListener("touchend", onPointerUp)
      svg.addEventListener("touchmove", onPointerMove)
    }

    return function() {
      svg.removeEventListener("wheel", handleWheel)
      if (window.PointerEvent) {
        svg.removeEventListener("pointerdown", onPointerDown)
        svg.removeEventListener("pointerup", onPointerUp)
        svg.removeEventListener("pointerleave", onPointerUp)
        svg.removeEventListener("pointermove", onPointerMove)
      } else {
        svg.removeEventListener("mousedown", onPointerDown)
        svg.removeEventListener("mouseup", onPointerUp)
        svg.removeEventListener("mouseleave", onPointerUp)
        svg.removeEventListener("mousemove", onPointerMove)
        svg.removeEventListener("touchstart", onPointerDown)
        svg.removeEventListener("touchend", onPointerUp)
        svg.removeEventListener("touchmove", onPointerMove)
      }
    }
  }, [])

  useEffect(() => {
    setPosition(position => {
      const x = (position.x - width / 2) * zoom / position.zoom + width / 2
      const y = (position.y - height / 2) * zoom / position.zoom + height / 2
      return { ...position, x, y, last: [x, y], zoom }
    })
  }, [zoom])

  useEffect(() => {
    const c = projection(center)
    setPosition(position => ({
      ...position,
      x: width / 2 - c[0] * position.zoom,
      y: height / 2 - c[1] * position.zoom,
      last: [
        width / 2 - c[0] * position.zoom,
        height / 2 - c[1] * position.zoom,
      ],
    }))
  }, [center[0], center[1]])

  return {
    elRef,
    position,
    transformString: `translate(${position.x} ${position.y}) scale(${position.zoom})`,
  }
}
