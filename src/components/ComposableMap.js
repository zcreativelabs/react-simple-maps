import React, { forwardRef } from "react"
import PropTypes from "prop-types"

import { MapProvider } from "./MapProvider"

const ComposableMap = forwardRef(
  (
    {
      width = 800,
      height = 600,
      projection = "geoEqualEarth",
      projectionConfig = {},
      className = "",
      ...restProps
    },
    ref
  ) => {
    return (
      <MapProvider
        width={width}
        height={height}
        projection={projection}
        projectionConfig={projectionConfig}
      >
        <svg
          ref={ref}
          viewBox={`0 0 ${width} ${height}`}
          className={`rsm-svg ${className}`}
          {...restProps}
        />
      </MapProvider>
    )
  }
)

ComposableMap.displayName = "ComposableMap"

ComposableMap.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  projection: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  projectionConfig: PropTypes.object,
  className: PropTypes.string,
}

export default ComposableMap
