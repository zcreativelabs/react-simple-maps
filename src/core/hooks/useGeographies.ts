import { useMemo, useState, useEffect } from "react"
import type { Feature, Geometry, MultiLineString } from "geojson"
import { useMapContext } from "../components/MapProvider"
import {
  fetchGeographies,
  getFeatures,
  getMesh,
  prepareFeatures,
  isString,
  prepareMesh,
} from "../utils"
import type { UseGeographiesProps, UseGeographiesReturn } from "../types"

interface GeographiesOutput {
  geographies?: Feature<Geometry>[]
  mesh?: { outline: MultiLineString; borders: MultiLineString } | null
}

export default function useGeographies({
  geography,
  parseGeographies,
}: UseGeographiesProps): UseGeographiesReturn {
  const { path } = useMapContext()
  const [output, setOutput] = useState<GeographiesOutput>({})

  const geographyKey = isString(geography)
    ? geography
    : JSON.stringify(geography)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (!geography) return

    if (isString(geography)) {
      // Abort the request when the URL changes or the component unmounts,
      // so a slow, stale response can't overwrite a newer one.
      const controller = new AbortController()
      fetchGeographies(geography, { signal: controller.signal })
        .then((geos) => {
          if (controller.signal.aborted) return
          setOutput({
            geographies: getFeatures(geos, parseGeographies),
            mesh: getMesh(geos),
          })
        })
        .catch((error) => {
          if (controller.signal.aborted) return
          console.error("There was a problem when fetching the data: ", error)
        })
      return () => controller.abort()
    } else {
      setOutput({
        geographies: getFeatures(geography, parseGeographies),
        mesh: getMesh(geography),
      })
    }
    // geography is intentionally omitted: it is compared by content via
    // geographyKey below, since callers routinely pass a fresh array or
    // object literal on every render (e.g. `geography={[a, b]}` in JSX),
    // which would otherwise retrigger this effect and setOutput forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geographyKey, parseGeographies])

  const { geographies, outline, borders } = useMemo(() => {
    const preparedMesh = prepareMesh(
      output.mesh?.outline,
      output.mesh?.borders,
      path
    )
    return {
      geographies: prepareFeatures(output.geographies, path),
      outline: preparedMesh.outline,
      borders: preparedMesh.borders,
    }
  }, [output, path])

  return { geographies, outline, borders }
}
