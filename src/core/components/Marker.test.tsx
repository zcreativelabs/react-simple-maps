import React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Marker from "./Marker"
import { MapProvider } from "./MapProvider"
import { geoMercator } from "d3-geo"

const mockProjection = geoMercator().scale(100).translate([0, 0])

const MarkerWithContext = (props: React.ComponentProps<typeof Marker>) => (
  <svg>
    <MapProvider projection={mockProjection} width={960} height={600}>
      <Marker {...props} />
    </MapProvider>
  </svg>
)

describe("Marker", () => {
  it("renders a group element", () => {
    const { container } = render(
      <MarkerWithContext coordinates={[0, 0]}>
        <circle r="5" />
      </MarkerWithContext>
    )
    const group = container.querySelector("g")
    expect(group).toBeTruthy()
  })

  it("applies rsm-marker className", () => {
    const { container } = render(
      <MarkerWithContext coordinates={[0, 0]}>
        <circle r="5" />
      </MarkerWithContext>
    )
    const groups = container.querySelectorAll("g")
    const group = groups[groups.length - 1]
    expect(group?.getAttribute("class")).toContain("rsm-marker")
  })

  it("applies custom className", () => {
    const { container } = render(
      <MarkerWithContext coordinates={[0, 0]} className="highlight">
        <circle r="5" />
      </MarkerWithContext>
    )
    const groups = container.querySelectorAll("g")
    const group = groups[groups.length - 1]
    expect(group?.getAttribute("class")).toContain("highlight")
  })

  it("projects coordinates to SVG space", () => {
    const { container } = render(
      <MarkerWithContext coordinates={[0, 0]}>
        <circle r="5" />
      </MarkerWithContext>
    )
    const groups = container.querySelectorAll("g")
    const group = groups[groups.length - 1]
    const transform = group?.getAttribute("transform")
    expect(transform).toMatch(/translate\(/)
  })

  it("renders children", () => {
    const { container } = render(
      <MarkerWithContext coordinates={[0, 0]}>
        <circle r="5" data-testid="marker-circle" />
      </MarkerWithContext>
    )
    const circle = container.querySelector('[data-testid="marker-circle"]')
    expect(circle).toBeTruthy()
  })

  it("passes through style prop", () => {
    const style = { opacity: 0.5, pointerEvents: "none" } as React.CSSProperties
    const { container } = render(
      <MarkerWithContext coordinates={[0, 0]} style={style}>
        <circle r="5" />
      </MarkerWithContext>
    )
    const groups = container.querySelectorAll("g")
    const group = groups[groups.length - 1]
    expect(group?.style.opacity).toBe("0.5")
    expect(group?.style.pointerEvents).toBe("none")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<SVGGElement>()
    render(
      <MarkerWithContext coordinates={[0, 0]} ref={ref}>
        <circle r="5" />
      </MarkerWithContext>
    )
    expect(ref.current).toBeTruthy()
  })

  it("spreads additional SVG props", () => {
    const { container } = render(
      <MarkerWithContext coordinates={[0, 0]} data-testid="custom-marker">
        <circle r="5" />
      </MarkerWithContext>
    )
    const groups = container.querySelectorAll("g")
    const group = groups[groups.length - 1]
    expect(group?.getAttribute("data-testid")).toBe("custom-marker")
  })

  it("renders nothing when the projection cannot place the coordinates", () => {
    const unprojectableProjection = Object.assign(
      () => null as unknown as [number, number],
      {
        center: mockProjection.center,
        translate: mockProjection.translate,
        scale: mockProjection.scale,
        rotate: mockProjection.rotate,
        invert: mockProjection.invert,
      }
    ) as unknown as typeof mockProjection

    const { container } = render(
      <svg>
        <MapProvider
          projection={unprojectableProjection}
          width={960}
          height={600}
        >
          <Marker coordinates={[0, 0]}>
            <circle data-testid="should-not-render" r="5" />
          </Marker>
        </MapProvider>
      </svg>
    )

    expect(container.querySelector("g")).toBeNull()
    expect(
      container.querySelector('[data-testid="should-not-render"]')
    ).toBeNull()
  })
})
