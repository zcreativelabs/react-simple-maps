import React, { forwardRef } from "react"
import { useMapContext } from "./MapProvider"
import { createConnectorPath } from "../utils"
import type { AnnotationProps } from "../types"

const Annotation = forwardRef<SVGGElement, AnnotationProps>(
  (
    {
      subject,
      children,
      connectorProps,
      dx = 30,
      dy = 30,
      curve = 0,
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { projection } = useMapContext()
    const projected = projection(subject)
    const connectorPath = createConnectorPath(dx, dy, curve)

    if (!projected) return null

    const [x, y] = projected

    return React.createElement(
      "g",
      {
        ref,
        transform: `translate(${x + dx}, ${y + dy})`,
        className: `rsm-annotation ${className}`,
        ...restProps,
      },
      React.createElement("path", {
        d: connectorPath,
        fill: "transparent",
        stroke: "#000",
        ...connectorProps,
      }),
      children
    )
  }
)

Annotation.displayName = "Annotation"

export default Annotation
