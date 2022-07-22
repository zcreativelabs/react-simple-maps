import React, { Fragment, memo, useMemo, useContext, forwardRef } from "react"
import PropTypes from "prop-types"

import { MapContext } from "./MapProvider"

const Sphere = forwardRef(
  (
    {
      id = "rsm-sphere",
      fill = "transparent",
      stroke = "currentcolor",
      strokeWidth = 0.5,
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { path } = useContext(MapContext)
    const spherePath = useMemo(() => path({ type: "Sphere" }), [path])
    return (
      <Fragment>
        <defs>
          <clipPath id={id}>
            <path d={spherePath} />
          </clipPath>
        </defs>
        <path
          ref={ref}
          d={spherePath}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          style={{ pointerEvents: "none" }}
          className={`rsm-sphere ${className}`}
          {...restProps}
        />
      </Fragment>
    )
  }
)

Sphere.displayName = "Sphere"

Sphere.propTypes = {
  id: PropTypes.string,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  className: PropTypes.string,
}

export default memo(Sphere)
