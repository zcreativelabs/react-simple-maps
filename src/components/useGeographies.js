import { useMemo, useState, useEffect, useContext } from "react"
import { MapContext } from "./MapProvider"

import {
  fetchGeographies,
  getFeatures,
  getMesh,
  prepareFeatures,
  isString,
  prepareMesh,
} from "../utils"

export default function useGeographies({ geography, parseGeographies }) {
  const { path } = useContext(MapContext)
  const [output, setOutput] = useState({})

  useEffect(() => {
    if (typeof window === `undefined`) return

    if (!geography) return

    if (isString(geography)) {
      fetchGeographies(geography).then((geos) => {
        if (geos) {
          setOutput({
            geographies: getFeatures(geos, parseGeographies),
            mesh: getMesh(geos),
          })
        }
      })
    } else {
      setOutput({
        geographies: getFeatures(geography, parseGeographies),
        mesh: getMesh(geography),
      })
    }
  }, [geography, parseGeographies])

  const { geographies, outline, borders } = useMemo(() => {
    const mesh = output.mesh || {}
    const preparedMesh = prepareMesh(mesh.outline, mesh.borders, path)
    return {
      geographies: prepareFeatures(output.geographies, path),
      outline: preparedMesh.outline,
      borders: preparedMesh.borders,
    }
  }, [output, path])

  return { geographies, outline, borders }
}
