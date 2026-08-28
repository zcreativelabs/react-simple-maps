import { ReactNode, SVGProps } from "react"
import type { D3ZoomEvent } from "d3-zoom"

export type ZoomGestureEvent = D3ZoomEvent<SVGGElement, unknown>

export interface ZoomPanContextType {
  x: number
  y: number
  k: number
  transformString: string
}

export interface ZoomPanValue {
  x: number
  y: number
  k: number
  transformString: string
}

export type ZoomPanPosition = {
  x: number
  y: number
  k: number
  dragging?: Event | null
}

export interface ZoomPanCallbackProps {
  coordinates?: [number, number]
  zoom?: number
  x?: number
  y?: number
  dragging?: Event | null
}

export interface UseZoomPanProps {
  center?: [number, number]
  zoom?: number
  translateExtent?: Array<[number, number]>
  scaleExtent?: [number, number]
  filterZoomEvent?: (event: Event) => boolean
  onMoveStart?: (props: ZoomPanCallbackProps, event: ZoomGestureEvent) => void
  onMove?: (props: ZoomPanCallbackProps, event: ZoomGestureEvent) => void
  onMoveEnd?: (props: ZoomPanCallbackProps, event: ZoomGestureEvent) => void
}

export interface UseZoomPanReturn {
  mapRef: React.MutableRefObject<SVGGElement | null>
  position: ZoomPanPosition
  transformString: string
}

export interface ZoomableGroupProps extends SVGProps<SVGGElement> {
  center?: [number, number]
  zoom?: number
  minZoom?: number
  maxZoom?: number
  translateExtent?: Array<[number, number]>
  filterZoomEvent?: (event: Event) => boolean
  onMoveStart?: (props: ZoomPanCallbackProps, event: ZoomGestureEvent) => void
  onMove?: (props: ZoomPanCallbackProps, event: ZoomGestureEvent) => void
  onMoveEnd?: (props: ZoomPanCallbackProps, event: ZoomGestureEvent) => void
  className?: string
  children?: ReactNode
}

export interface ZoomPanProviderProps {
  value?: ZoomPanValue
  children?: ReactNode
}
