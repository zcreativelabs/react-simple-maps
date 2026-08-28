import React, { Fragment, memo, useMemo, forwardRef } from "react"
import { useMapContext } from "./MapProvider"
import type { SphereProps } from "../types"

const Sphere = forwardRef<SVGPathElement, SphereProps>(
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
    const { path } = useMapContext()
    const spherePath = useMemo(() => path({ type: "Sphere" }), [path])

    return React.createElement(
      Fragment,
      null,
      React.createElement(
        "defs",
        null,
        React.createElement(
          "clipPath",
          { id },
          React.createElement("path", { d: spherePath })
        )
      ),
      React.createElement("path", {
        ref,
        d: spherePath,
        fill,
        stroke,
        strokeWidth,
        style: { pointerEvents: "none" },
        className: `rsm-sphere ${className}`,
        ...restProps,
      })
    )
  }
)

Sphere.displayName = "Sphere"

export default memo(Sphere)
