import { feature, mesh } from "topojson-client"

export function getCoords(w, h, t) {
  const xOffset = (w * t.k - w) / 2
  const yOffset = (h * t.k - h) / 2
  return [w / 2 - (xOffset + t.x) / t.k, h / 2 - (yOffset + t.y) / t.k]
}

export function fetchGeographies(url) {
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

export function getFeatures(geographies, parseGeographies) {
  const isTopojson = geographies.type === "Topology"
  if (!isTopojson) {
    return parseGeographies
      ? parseGeographies(geographies.features || geographies)
      : geographies.features || geographies
  }
  const feats = feature(
    geographies,
    geographies.objects[Object.keys(geographies.objects)[0]]
  ).features
  return parseGeographies ? parseGeographies(feats) : feats
}

export function getMesh(geographies) {
  const isTopojson = geographies.type === "Topology"
  if (!isTopojson) return null
  const outline = mesh(
    geographies,
    geographies.objects[Object.keys(geographies.objects)[0]],
    (a, b) => a === b
  )
  const borders = mesh(
    geographies,
    geographies.objects[Object.keys(geographies.objects)[0]],
    (a, b) => a !== b
  )
  return { outline, borders }
}

export function prepareMesh(outline, borders, path) {
  return outline && borders
    ? {
        outline: { ...outline, rsmKey: "outline", svgPath: path(outline) },
        borders: { ...borders, rsmKey: "borders", svgPath: path(borders) },
      }
    : {}
}

export function prepareFeatures(geographies, path) {
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

export function createConnectorPath(dx = 30, dy = 30, curve = 0.5) {
  const curvature = Array.isArray(curve) ? curve : [curve, curve]
  const curveX = (dx / 2) * curvature[0]
  const curveY = (dy / 2) * curvature[1]
  return `M${0},${0} Q${-dx / 2 - curveX},${-dy / 2 + curveY} ${-dx},${-dy}`
}

export function isString(geo) {
  return typeof geo === "string"
}
