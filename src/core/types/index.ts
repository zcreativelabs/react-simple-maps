import { ReactNode, SVGProps } from "react"
import {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonObject,
  MultiLineString,
} from "geojson"
import { GeoPermissibleObjects, GeoProjection } from "d3-geo"
import type { Topology } from "topojson-specification"

// Projection types
export type ProjectionName =
  | "geoAzimuthalEqualArea"
  | "geoAzimuthalEquidistant"
  | "geoConicConformal"
  | "geoConicEqualArea"
  | "geoConicEquidistant"
  | "geoEqualEarth"
  | "geoEquirectangular"
  | "geoGnomonic"
  | "geoMercator"
  | "geoOrthographic"
  | "geoStereographic"
  | "geoTransverseMercator"

export interface ProjectionConfig {
  center?: [number, number]
  rotate?: [number, number, number?]
  parallels?: [number, number]
  scale?: number
}

// Map context types
export interface MapContextType {
  width: number
  height: number
  projection: GeoProjection
  path: (geometry: GeoPermissibleObjects) => string | null
}

// Geography types
export interface Geography extends Feature<Geometry> {
  rsmKey: string
  svgPath: string | null
}

export interface Mesh extends MultiLineString {
  rsmKey: string
  svgPath: string | null
}

// Component prop types
export interface ComposableMapProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  projection?: ProjectionName | GeoProjection
  projectionConfig?: ProjectionConfig
  className?: string
  children?: ReactNode
}

export interface GeographiesProps extends Omit<
  SVGProps<SVGGElement>,
  "children"
> {
  geography: string | GeoJsonObject | GeoJsonObject[]
  children: (props: {
    geographies: Geography[]
    outline?: Mesh
    borders?: Mesh
    path: (geometry: GeoPermissibleObjects) => string | null
    projection: GeoProjection
  }) => ReactNode
  parseGeographies?: (features: Feature<Geometry>[]) => Feature<Geometry>[]
  className?: string
}

export interface GeographyProps extends SVGProps<SVGPathElement> {
  geography: Geography
  className?: string
}

export interface MarkerProps extends SVGProps<SVGGElement> {
  coordinates: [number, number]
  children: ReactNode
  className?: string
}

export interface GraticuleProps extends Omit<
  SVGProps<SVGPathElement>,
  "children"
> {
  fill?: string
  stroke?: string
  step?: [number, number]
  className?: string
}

export interface SphereProps extends Omit<
  SVGProps<SVGPathElement>,
  "children"
> {
  id?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  className?: string
}

export interface LineProps extends Omit<
  SVGProps<SVGPathElement>,
  "children" | "from" | "to"
> {
  from?: [number, number]
  to?: [number, number]
  coordinates?: Array<[number, number]>
  stroke?: string
  strokeWidth?: number
  fill?: string
  className?: string
}

export interface AnnotationProps extends Omit<
  SVGProps<SVGGElement>,
  "children"
> {
  subject: [number, number]
  children: ReactNode
  connectorProps?: SVGProps<SVGPathElement>
  dx?: number
  dy?: number
  curve?: number | [number, number]
  className?: string
}

// Hook types
export interface UseGeographiesProps {
  geography: string | GeoJsonObject | GeoJsonObject[]
  parseGeographies?: (features: Feature<Geometry>[]) => Feature<Geometry>[]
}

export interface UseGeographiesReturn {
  geographies: Geography[]
  outline?: Mesh
  borders?: Mesh
}

// Utility function types
export interface TransformObject {
  x: number
  y: number
  k: number
}

export type FetchResult = Topology | FeatureCollection
