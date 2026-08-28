import { feature, mesh } from "topojson-client"
import { Feature, Geometry, GeoJsonObject, MultiLineString } from "geojson"
import { GeoPermissibleObjects } from "d3-geo"
import type { GeometryCollection } from "topojson-specification"
import type { FetchResult, Geography, Mesh, TransformObject } from "./types"

export function getCoords(
  w: number,
  h: number,
  t: TransformObject
): [number, number] {
  const xOffset = (w * t.k - w) / 2
  const yOffset = (h * t.k - h) / 2
  return [w / 2 - (xOffset + t.x) / t.k, h / 2 - (yOffset + t.y) / t.k]
}

export function fetchGeographies(
  url: string
): Promise<FetchResult | undefined> {
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw Error(res.statusText)
      }
      return res.json()
    })
    .catch((error) => {
      console.log("There was a problem when fetching the data: ", error)
    })
}

export function getFeatures(
  geographies: FetchResult | GeoJsonObject | GeoJsonObject[],
  parseGeographies?: (features: Feature<Geometry>[]) => Feature<Geometry>[]
): Feature<Geometry>[] {
  if (
    !Array.isArray(geographies) &&
    "type" in geographies &&
    geographies.type === "Topology"
  ) {
    const firstObject = geographies.objects[
      Object.keys(geographies.objects)[0]
    ] as GeometryCollection

    const feats = feature(geographies, firstObject).features as Feature<
      Geometry
    >[]

    return parseGeographies ? parseGeographies(feats) : feats
  }

  const features =
    !Array.isArray(geographies) && "features" in geographies
      ? (geographies.features as Feature<Geometry>[])
      : (geographies as Feature<Geometry>[])

  return parseGeographies ? parseGeographies(features) : features
}

export function getMesh(
  geographies: FetchResult | GeoJsonObject | GeoJsonObject[]
): {
  outline: MultiLineString
  borders: MultiLineString
} | null {
  if (
    Array.isArray(geographies) ||
    !("type" in geographies) ||
    geographies.type !== "Topology"
  ) {
    return null
  }

  const firstObject = geographies.objects[
    Object.keys(geographies.objects)[0]
  ] as GeometryCollection

  const outline = mesh(geographies, firstObject, (a, b) => a === b)
  const borders = mesh(geographies, firstObject, (a, b) => a !== b)

  return { outline, borders }
}

export function prepareMesh(
  outline: MultiLineString | undefined,
  borders: MultiLineString | undefined,
  path: (geometry: GeoPermissibleObjects) => string | null
): {
  outline?: Mesh
  borders?: Mesh
} {
  return outline && borders
    ? {
        outline: { ...outline, rsmKey: "outline", svgPath: path(outline) },
        borders: { ...borders, rsmKey: "borders", svgPath: path(borders) },
      }
    : {}
}

export function prepareFeatures(
  geographies: Feature<Geometry>[] | undefined,
  path: (geometry: GeoPermissibleObjects) => string | null
): Geography[] {
  return geographies
    ? geographies.map((d, i) => {
        return {
          ...d,
          rsmKey: `geo-${i}`,
          svgPath: path(d),
        }
      })
    : []
}

export function createConnectorPath(
  dx: number = 30,
  dy: number = 30,
  curve: number | [number, number] = 0.5
): string {
  const curvature = Array.isArray(curve) ? curve : [curve, curve]
  const curveX = (dx / 2) * curvature[0]
  const curveY = (dy / 2) * curvature[1]
  return `M${0},${0} Q${-dx / 2 - curveX},${-dy / 2 + curveY} ${-dx},${-dy}`
}

export function isString(
  geo: string | GeoJsonObject | GeoJsonObject[]
): geo is string {
  return typeof geo === "string"
}
