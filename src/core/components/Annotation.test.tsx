import React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Annotation from "./Annotation"
import { MapProvider } from "./MapProvider"
import { geoMercator } from "d3-geo"

const mockProjection = geoMercator().scale(100).translate([0, 0])

const AnnotationWithContext = (
  props: React.ComponentProps<typeof Annotation>
) => (
  <svg>
    <MapProvider projection={mockProjection} width={960} height={600}>
      <Annotation {...props} />
    </MapProvider>
  </svg>
)

describe("Annotation", () => {
  it("renders a group element", () => {
    const { container } = render(
      <AnnotationWithContext subject={[0, 0]}>
        <text>Label</text>
      </AnnotationWithContext>
    )
    const group = container.querySelector("g")
    expect(group).toBeTruthy()
  })

  it("applies rsm-annotation className", () => {
    const { container } = render(
      <AnnotationWithContext subject={[0, 0]}>
        <text>Label</text>
      </AnnotationWithContext>
    )
    const groups = container.querySelectorAll("g")
    const group = groups[groups.length - 1]
    expect(group?.getAttribute("class")).toContain("rsm-annotation")
  })

  it("applies custom className", () => {
    const { container } = render(
      <AnnotationWithContext subject={[0, 0]} className="highlight">
        <text>Label</text>
      </AnnotationWithContext>
    )
    const groups = container.querySelectorAll("g")
    const group = groups[groups.length - 1]
    expect(group?.getAttribute("class")).toContain("highlight")
  })

  it("positions the group using the projected subject offset by dx/dy", () => {
    const { container } = render(
      <AnnotationWithContext subject={[0, 0]} dx={10} dy={20}>
        <text>Label</text>
      </AnnotationWithContext>
    )
    const groups = container.querySelectorAll("g")
    const group = groups[groups.length - 1]
    const transform = group?.getAttribute("transform")
    expect(transform).toMatch(/translate\(/)
  })

  it("renders a connector path", () => {
    const { container } = render(
      <AnnotationWithContext subject={[0, 0]}>
        <text>Label</text>
      </AnnotationWithContext>
    )
    const path = container.querySelector("path")
    expect(path).toBeTruthy()
    expect(path?.getAttribute("d")).toMatch(/^M/)
  })

  it("passes connectorProps through to the connector path", () => {
    const { container } = render(
      <AnnotationWithContext
        subject={[0, 0]}
        connectorProps={{ stroke: "red", strokeWidth: 2 }}
      >
        <text>Label</text>
      </AnnotationWithContext>
    )
    const path = container.querySelector("path")
    expect(path?.getAttribute("stroke")).toBe("red")
    expect(path?.getAttribute("stroke-width")).toBe("2")
  })

  it("renders children", () => {
    const { container } = render(
      <AnnotationWithContext subject={[0, 0]}>
        <text data-testid="annotation-label">Label</text>
      </AnnotationWithContext>
    )
    const label = container.querySelector('[data-testid="annotation-label"]')
    expect(label).toBeTruthy()
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<SVGGElement>()
    render(
      <AnnotationWithContext subject={[0, 0]} ref={ref}>
        <text>Label</text>
      </AnnotationWithContext>
    )
    expect(ref.current).toBeTruthy()
  })

  it("spreads additional SVG props", () => {
    const { container } = render(
      <AnnotationWithContext subject={[0, 0]} data-testid="custom-annotation">
        <text>Label</text>
      </AnnotationWithContext>
    )
    const groups = container.querySelectorAll("g")
    const group = groups[groups.length - 1]
    expect(group?.getAttribute("data-testid")).toBe("custom-annotation")
  })

  it("renders nothing when the projection cannot place the subject", () => {
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
          <Annotation subject={[0, 0]}>
            <text data-testid="should-not-render">Label</text>
          </Annotation>
        </MapProvider>
      </svg>
    )

    expect(container.querySelector("g")).toBeNull()
    expect(
      container.querySelector('[data-testid="should-not-render"]')
    ).toBeNull()
  })
})
