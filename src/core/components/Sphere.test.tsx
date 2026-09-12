import React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Sphere from "./Sphere"
import { MapProvider } from "./MapProvider"
import { geoMercator } from "d3-geo"

const mockProjection = geoMercator().scale(100).translate([0, 0])

const SphereWithContext = (props: React.ComponentProps<typeof Sphere>) => (
  <svg>
    <MapProvider projection={mockProjection} width={960} height={600}>
      <Sphere {...props} />
    </MapProvider>
  </svg>
)

describe("Sphere", () => {
  it("renders a path element", () => {
    const { container } = render(<SphereWithContext />)
    expect(container.querySelector("path")).toBeTruthy()
  })

  it("renders a clipPath with a matching id inside defs", () => {
    const { container } = render(<SphereWithContext id="my-sphere" />)
    const clipPath = container.querySelector("defs clipPath")
    expect(clipPath?.getAttribute("id")).toBe("my-sphere")
  })

  it("defaults the id to rsm-sphere", () => {
    const { container } = render(<SphereWithContext />)
    const clipPath = container.querySelector("defs clipPath")
    expect(clipPath?.getAttribute("id")).toBe("rsm-sphere")
  })

  it("applies rsm-sphere className", () => {
    const { container } = render(<SphereWithContext />)
    const path = container.querySelector("path.rsm-sphere")
    expect(path).toBeTruthy()
  })

  it("applies custom className", () => {
    const { container } = render(<SphereWithContext className="highlight" />)
    const path = container.querySelector("path.rsm-sphere")
    expect(path?.getAttribute("class")).toContain("highlight")
  })

  it("applies default fill/stroke and no strokeWidth", () => {
    const { container } = render(<SphereWithContext />)
    const path = container.querySelector("path.rsm-sphere")
    expect(path?.getAttribute("fill")).toBe("transparent")
    expect(path?.getAttribute("stroke")).toBe("currentcolor")
    expect(path?.getAttribute("stroke-width")).toBeNull()
  })

  it("applies custom fill/stroke/strokeWidth", () => {
    const { container } = render(
      <SphereWithContext fill="blue" stroke="red" strokeWidth={2} />
    )
    const path = container.querySelector("path.rsm-sphere")
    expect(path?.getAttribute("fill")).toBe("blue")
    expect(path?.getAttribute("stroke")).toBe("red")
    expect(path?.getAttribute("stroke-width")).toBe("2")
  })

  it("has a d attribute on both the clip path and the visible path", () => {
    const { container } = render(<SphereWithContext />)
    const clipPath = container.querySelector("defs clipPath path")
    const visiblePath = container.querySelector("path.rsm-sphere")
    expect(clipPath?.getAttribute("d")).toBeTruthy()
    expect(visiblePath?.getAttribute("d")).toBe(
      clipPath?.getAttribute("d")
    )
  })

  it("forwards ref to the visible path element", () => {
    const ref = React.createRef<SVGPathElement>()
    render(<SphereWithContext ref={ref} />)
    expect(ref.current).toBeTruthy()
    expect(ref.current?.getAttribute("class")).toContain("rsm-sphere")
  })

  it("spreads additional SVG props onto the visible path", () => {
    const { container } = render(
      <SphereWithContext data-testid="custom-sphere" />
    )
    const path = container.querySelector("path.rsm-sphere")
    expect(path?.getAttribute("data-testid")).toBe("custom-sphere")
  })
})
