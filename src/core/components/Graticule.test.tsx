import React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Graticule from "./Graticule"
import { MapProvider } from "./MapProvider"
import { geoMercator } from "d3-geo"

const mockProjection = geoMercator().scale(100).translate([0, 0])

const GraticuleWithContext = (
  props: React.ComponentProps<typeof Graticule>
) => (
  <svg>
    <MapProvider projection={mockProjection} width={960} height={600}>
      <Graticule {...props} />
    </MapProvider>
  </svg>
)

describe("Graticule", () => {
  it("renders a path element", () => {
    const { container } = render(<GraticuleWithContext />)
    expect(container.querySelector("path")).toBeTruthy()
  })

  it("applies rsm-graticule className", () => {
    const { container } = render(<GraticuleWithContext />)
    const path = container.querySelector("path")
    expect(path?.getAttribute("class")).toContain("rsm-graticule")
  })

  it("applies custom className", () => {
    const { container } = render(<GraticuleWithContext className="highlight" />)
    const path = container.querySelector("path")
    expect(path?.getAttribute("class")).toContain("highlight")
  })

  it("applies default fill/stroke", () => {
    const { container } = render(<GraticuleWithContext />)
    const path = container.querySelector("path")
    expect(path?.getAttribute("fill")).toBe("transparent")
    expect(path?.getAttribute("stroke")).toBe("currentcolor")
  })

  it("applies custom fill/stroke", () => {
    const { container } = render(
      <GraticuleWithContext fill="blue" stroke="red" />
    )
    const path = container.querySelector("path")
    expect(path?.getAttribute("fill")).toBe("blue")
    expect(path?.getAttribute("stroke")).toBe("red")
  })

  it("produces a different d attribute for different step values", () => {
    const { container: coarse } = render(
      <GraticuleWithContext step={[30, 30]} />
    )
    const { container: fine } = render(
      <GraticuleWithContext step={[5, 5]} />
    )
    const coarseD = coarse.querySelector("path")?.getAttribute("d")
    const fineD = fine.querySelector("path")?.getAttribute("d")
    expect(coarseD).toBeTruthy()
    expect(fineD).toBeTruthy()
    expect(coarseD).not.toBe(fineD)
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<SVGPathElement>()
    render(<GraticuleWithContext ref={ref} />)
    expect(ref.current).toBeTruthy()
  })

  it("spreads additional SVG props", () => {
    const { container } = render(
      <GraticuleWithContext data-testid="custom-graticule" />
    )
    const path = container.querySelector("path")
    expect(path?.getAttribute("data-testid")).toBe("custom-graticule")
  })
})
