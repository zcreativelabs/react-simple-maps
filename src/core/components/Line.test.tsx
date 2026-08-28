import React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Line from "./Line"
import { MapProvider } from "./MapProvider"
import { geoMercator } from "d3-geo"

const mockProjection = geoMercator().scale(100).translate([0, 0])

const LineWithContext = (props: React.ComponentProps<typeof Line>) => (
  <svg>
    <MapProvider projection={mockProjection} width={960} height={600}>
      <Line {...props} />
    </MapProvider>
  </svg>
)

describe("Line", () => {
  it("renders a path element", () => {
    const { container } = render(<LineWithContext from={[0, 0]} to={[10, 10]} />)
    expect(container.querySelector("path")).toBeTruthy()
  })

  it("applies rsm-line className", () => {
    const { container } = render(<LineWithContext from={[0, 0]} to={[10, 10]} />)
    const path = container.querySelector("path")
    expect(path?.getAttribute("class")).toContain("rsm-line")
  })

  it("applies custom className", () => {
    const { container } = render(
      <LineWithContext from={[0, 0]} to={[10, 10]} className="highlight" />
    )
    const path = container.querySelector("path")
    expect(path?.getAttribute("class")).toContain("highlight")
  })

  it("builds a d attribute from from/to when coordinates is not provided", () => {
    const { container } = render(<LineWithContext from={[0, 0]} to={[10, 10]} />)
    const path = container.querySelector("path")
    expect(path?.getAttribute("d")).toMatch(/^M/)
  })

  it("builds a d attribute from coordinates when provided, ignoring from/to", () => {
    const { container } = render(
      <LineWithContext
        from={[0, 0]}
        to={[10, 10]}
        coordinates={[
          [0, 0],
          [5, 5],
          [20, 20],
        ]}
      />
    )
    const path = container.querySelector("path")
    expect(path?.getAttribute("d")).toMatch(/^M/)
  })

  it("applies default stroke/strokeWidth/fill", () => {
    const { container } = render(<LineWithContext from={[0, 0]} to={[10, 10]} />)
    const path = container.querySelector("path")
    expect(path?.getAttribute("stroke")).toBe("currentcolor")
    expect(path?.getAttribute("stroke-width")).toBe("3")
    expect(path?.getAttribute("fill")).toBe("transparent")
  })

  it("applies custom stroke/strokeWidth/fill", () => {
    const { container } = render(
      <LineWithContext
        from={[0, 0]}
        to={[10, 10]}
        stroke="red"
        strokeWidth={5}
        fill="blue"
      />
    )
    const path = container.querySelector("path")
    expect(path?.getAttribute("stroke")).toBe("red")
    expect(path?.getAttribute("stroke-width")).toBe("5")
    expect(path?.getAttribute("fill")).toBe("blue")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<SVGPathElement>()
    render(<LineWithContext from={[0, 0]} to={[10, 10]} ref={ref} />)
    expect(ref.current).toBeTruthy()
  })

  it("spreads additional SVG props", () => {
    const { container } = render(
      <LineWithContext from={[0, 0]} to={[10, 10]} data-testid="custom-line" />
    )
    const path = container.querySelector("path")
    expect(path?.getAttribute("data-testid")).toBe("custom-line")
  })
})
