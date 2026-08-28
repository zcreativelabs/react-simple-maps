import React from "react"
import { render, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Geographies from "./Geographies"
import { MapProvider } from "./MapProvider"
import { geoMercator } from "d3-geo"
import type { Feature, Geometry } from "geojson"
import type { GeographiesProps } from "../types"

const emptyChildrenFn = (): ReturnType<GeographiesProps["children"]> => null

const mockFeatureCollection = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [0, 0],
            [10, 0],
            [10, 10],
            [0, 10],
            [0, 0],
          ],
        ],
      },
      properties: { name: "Test Polygon" },
    },
    {
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [5, 5],
      },
      properties: { name: "Test Point" },
    },
  ],
}

const emptyFeatureCollection = {
  type: "FeatureCollection" as const,
  features: [] as Feature<Geometry>[],
}

const GeographiesWithContext = (
  props: React.ComponentProps<typeof Geographies>
) => (
  <svg>
    <MapProvider projection={geoMercator()} width={960} height={600}>
      <Geographies {...props} />
    </MapProvider>
  </svg>
)

describe("Geographies", () => {
  it("renders a wrapping group element", () => {
    const { container } = render(
      <GeographiesWithContext
        geography={mockFeatureCollection as any}
      >
        {() => null}
      </GeographiesWithContext>
    )
    const group = container.querySelector("g")
    expect(group).toBeTruthy()
  })

  it("applies rsm-geographies className", () => {
    const { container } = render(
      <GeographiesWithContext geography={mockFeatureCollection as any}>
        {() => null}
      </GeographiesWithContext>
    )
    const group = container.querySelector("g")
    expect(group?.getAttribute("class")).toContain("rsm-geographies")
  })

  it("applies custom className", () => {
    const { container } = render(
      <GeographiesWithContext
        geography={mockFeatureCollection as any}
        className="highlight"
      >
        {() => null}
      </GeographiesWithContext>
    )
    const group = container.querySelector("g")
    expect(group?.getAttribute("class")).toContain("highlight")
  })

  it("calls children with resolved geographies, mesh, path and projection", async () => {
    const childrenFn = vi.fn<GeographiesProps["children"]>(emptyChildrenFn)
    render(
      <GeographiesWithContext geography={mockFeatureCollection as any}>
        {childrenFn}
      </GeographiesWithContext>
    )

    await waitFor(() => {
      expect(childrenFn).toHaveBeenCalled()
    })

    const callArgs = childrenFn.mock.calls[0][0]
    expect(callArgs.geographies).toHaveLength(2)
    expect(callArgs.geographies[0].rsmKey).toBeDefined()
    expect(typeof callArgs.path).toBe("function")
    expect(typeof callArgs.projection).toBe("function")
  })

  it("does not call children while there are zero geographies", () => {
    const childrenFn = vi.fn<GeographiesProps["children"]>(emptyChildrenFn)
    render(
      <GeographiesWithContext geography={emptyFeatureCollection as any}>
        {childrenFn}
      </GeographiesWithContext>
    )

    expect(childrenFn).not.toHaveBeenCalled()
  })

  it("applies a custom parseGeographies function", async () => {
    const childrenFn = vi.fn<GeographiesProps["children"]>(emptyChildrenFn)
    const parseGeographies = (features: Feature<Geometry>[]) =>
      features.filter((f) => f.geometry.type === "Polygon")

    render(
      <GeographiesWithContext
        geography={mockFeatureCollection as any}
        parseGeographies={parseGeographies}
      >
        {childrenFn}
      </GeographiesWithContext>
    )

    await waitFor(() => {
      expect(childrenFn).toHaveBeenCalled()
    })

    const callArgs = childrenFn.mock.calls[0][0]
    expect(callArgs.geographies).toHaveLength(1)
    expect(callArgs.geographies[0].geometry.type).toBe("Polygon")
  })

  it("renders what children returns", async () => {
    const { container } = render(
      <GeographiesWithContext geography={mockFeatureCollection as any}>
        {({ geographies }) => (
          <React.Fragment>
            {geographies.map((geo) => (
              <circle key={geo.rsmKey} data-testid="geo-marker" r={1} />
            ))}
          </React.Fragment>
        )}
      </GeographiesWithContext>
    )

    await waitFor(() => {
      expect(container.querySelectorAll('[data-testid="geo-marker"]')).toHaveLength(2)
    })
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<SVGGElement>()
    render(
      <svg>
        <MapProvider projection={geoMercator()} width={960} height={600}>
          <Geographies
            geography={mockFeatureCollection as any}
            ref={ref}
          >
            {() => null}
          </Geographies>
        </MapProvider>
      </svg>
    )
    expect(ref.current).toBeTruthy()
  })

  it("spreads additional SVG props", () => {
    const { container } = render(
      <GeographiesWithContext
        geography={mockFeatureCollection as any}
        data-testid="custom-geographies"
      >
        {() => null}
      </GeographiesWithContext>
    )
    const group = container.querySelector("g")
    expect(group?.getAttribute("data-testid")).toBe("custom-geographies")
  })
})
