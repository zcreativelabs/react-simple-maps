
import { useMemo, useState, useEffect, useContext } from "react"
import { MapContext } from "./MapProvider"

import { fetchGeographies, getFeatures, prepareFeatures, isString } from "../utils"

export default function useGeographies({ geography, parseGeographies }) {
  const { path } = useContext(MapContext)
  const [geographies, setGeographies] = useState()

  useEffect(() => {
    if (typeof window === `undefined`) return

    if (isString(geography)) {
      fetchGeographies(geography).then(geos => {
        if (geos) setGeographies(getFeatures(geos, parseGeographies))
      })
    } else {
      setGeographies(getFeatures(geography, parseGeographies))
    }
  }, [geography, parseGeographies])

  const output = useMemo(() => {
    return prepareFeatures(geographies, path)
  }, [geographies, path])

  return { geographies: output }
}
