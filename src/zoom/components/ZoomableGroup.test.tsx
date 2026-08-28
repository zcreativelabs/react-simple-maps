import React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { geoMercator } from "d3-geo"
import ZoomableGroup from "./ZoomableGroup"
import { MapProvider } from "../../core/components/MapProvider"
import { useZoomPanContext } from "./ZoomPanProvider"

const mockProjection = geoMercator().scale(100).translate([480, 300])

const ZoomableGroupWithContext = (
  props: React.ComponentProps<typeof ZoomableGroup>
) => (
  <svg width={960} height={600}>
    <MapProvider projection={mockProjection} width={960} height={600}>
      <ZoomableGroup {...props} />
    </MapProvider>
  </svg>
)

describe("ZoomableGroup", () => {
  it("renders group elements", () => {
    const { container } = render(
      <ZoomableGroupWithContext>
        <circle r={5} />
      </ZoomableGroupWithContext>
    )
    expect(container.querySelectorAll("g").length).toBeGreaterThan(0)
  })

  it("applies rsm-zoomable-group className to the inner group", () => {
    const { container } = render(
      <ZoomableGroupWithContext>
        <circle r={5} />
      </ZoomableGroupWithContext>
    )
    const innerGroup = container.querySelector(".rsm-zoomable-group")
    expect(innerGroup).toBeTruthy()
  })

  it("applies custom className alongside rsm-zoomable-group", () => {
    const { container } = render(
      <ZoomableGroupWithContext className="highlight">
        <circle r={5} />
      </ZoomableGroupWithContext>
    )
    const innerGroup = container.querySelector(".rsm-zoomable-group")
    expect(innerGroup?.getAttribute("class")).toContain("highlight")
  })

  it("renders a hit-test rect sized to the map's width/height", () => {
    const { container } = render(
      <ZoomableGroupWithContext>
        <circle r={5} />
      </ZoomableGroupWithContext>
    )
    const rect = container.querySelector("rect")
    expect(rect?.getAttribute("width")).toBe("960")
    expect(rect?.getAttribute("height")).toBe("600")
  })

  it("renders children inside the inner group", () => {
    const { container } = render(
      <ZoomableGroupWithContext>
        <circle data-testid="zoomable-child" r={5} />
      </ZoomableGroupWithContext>
    )
    const innerGroup = container.querySelector(".rsm-zoomable-group")
    const child = innerGroup?.querySelector('[data-testid="zoomable-child"]')
    expect(child).toBeTruthy()
  })

  it("sets an initial identity transform on the inner group", () => {
    const { container } = render(
      <ZoomableGroupWithContext>
        <circle r={5} />
      </ZoomableGroupWithContext>
    )
    const innerGroup = container.querySelector(".rsm-zoomable-group")
    expect(innerGroup?.getAttribute("transform")).toBe(
      "translate(0 0) scale(1)"
    )
  })

  it("provides ZoomPanContext to descendants matching the initial position", () => {
    let captured: ReturnType<typeof useZoomPanContext> | undefined

    const Probe = () => {
      captured = useZoomPanContext()
      return null
    }

    render(
      <ZoomableGroupWithContext>
        <Probe />
      </ZoomableGroupWithContext>
    )

    expect(captured).toEqual({
      x: 0,
      y: 0,
      k: 1,
      transformString: "translate(0 0) scale(1)",
    })
  })

  it("forwards ref to the inner group element", () => {
    const ref = React.createRef<SVGGElement>()
    render(
      <ZoomableGroupWithContext ref={ref}>
        <circle r={5} />
      </ZoomableGroupWithContext>
    )
    expect(ref.current).toBeTruthy()
    expect(ref.current?.getAttribute("class")).toContain(
      "rsm-zoomable-group"
    )
  })

  it("spreads additional SVG props onto the inner group", () => {
    const { container } = render(
      <ZoomableGroupWithContext data-testid="custom-zoomable">
        <circle r={5} />
      </ZoomableGroupWithContext>
    )
    const innerGroup = container.querySelector(".rsm-zoomable-group")
    expect(innerGroup?.getAttribute("data-testid")).toBe("custom-zoomable")
  })

  it("does not throw when rendered with custom minZoom/maxZoom", () => {
    expect(() =>
      render(
        <ZoomableGroupWithContext minZoom={0.5} maxZoom={20}>
          <circle r={5} />
        </ZoomableGroupWithContext>
      )
    ).not.toThrow()
  })
})
