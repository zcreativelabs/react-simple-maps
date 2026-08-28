import React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { MapProvider, useMapContext } from "./MapProvider"
import { geoMercator, geoEqualEarth } from "d3-geo"
import type { MapContextType } from "../types"

describe("MapProvider", () => {
  it("provides context to children", () => {
    let capturedContext: MapContextType | undefined

    const TestComponent = () => {
      capturedContext = useMapContext()
      return null
    }

    render(
      <MapProvider projection={geoMercator()} width={960} height={600}>
        <TestComponent />
      </MapProvider>
    )

    expect(capturedContext).toBeDefined()
    expect(capturedContext?.width).toBe(960)
    expect(capturedContext?.height).toBe(600)
    expect(capturedContext?.projection).toBeDefined()
    expect(capturedContext?.path).toBeDefined()
  })

  it("creates a path generator from projection", () => {
    let capturedContext: MapContextType | undefined

    const TestComponent = () => {
      capturedContext = useMapContext()
      return null
    }

    const projection = geoMercator()
    render(
      <MapProvider projection={projection} width={960} height={600}>
        <TestComponent />
      </MapProvider>
    )

    const pathString = capturedContext?.path({
      type: "Point",
      coordinates: [0, 0],
    })
    expect(typeof pathString).toBe("string")
  })

  it("works with different projection types", () => {
    let capturedContext: MapContextType | undefined

    const TestComponent = () => {
      capturedContext = useMapContext()
      return null
    }

    const projection = geoEqualEarth()
    render(
      <MapProvider projection={projection} width={960} height={600}>
        <TestComponent />
      </MapProvider>
    )

    expect(capturedContext?.projection).toBeDefined()
  })

  it("throws when useMapContext is used outside provider", () => {
    const TestComponent = () => {
      useMapContext()
      return null
    }

    const originalError = console.error
    console.error = () => {}

    expect(() => render(<TestComponent />)).toThrow()

    console.error = originalError
  })

  it("renders children", () => {
    const { getByTestId } = render(
      <MapProvider projection={geoMercator()} width={960} height={600}>
        <div data-testid="child">Test Child</div>
      </MapProvider>
    )

    const child = getByTestId("child")
    expect(child).toBeTruthy()
    expect(child.textContent).toBe("Test Child")
  })

  describe("building a projection from a name + projectionConfig", () => {
    it("builds a projection from a projection name string", () => {
      let capturedContext: MapContextType | undefined

      const TestComponent = () => {
        capturedContext = useMapContext()
        return null
      }

      render(
        <MapProvider projection="geoMercator" width={960} height={600}>
          <TestComponent />
        </MapProvider>
      )

      expect(capturedContext?.projection).toBeDefined()
      expect(typeof capturedContext?.projection).toBe("function")
    })

    it("applies a center from projectionConfig", () => {
      let capturedContext: MapContextType | undefined

      const TestComponent = () => {
        capturedContext = useMapContext()
        return null
      }

      render(
        <MapProvider
          projection="geoMercator"
          projectionConfig={{ center: [10, 20] }}
          width={960}
          height={600}
        >
          <TestComponent />
        </MapProvider>
      )

      expect(capturedContext?.projection.center()).toEqual([10, 20])
    })

    it("applies a 2-element rotate from projectionConfig", () => {
      let capturedContext: MapContextType | undefined

      const TestComponent = () => {
        capturedContext = useMapContext()
        return null
      }

      render(
        <MapProvider
          projection="geoMercator"
          projectionConfig={{ rotate: [30, 15] }}
          width={960}
          height={600}
        >
          <TestComponent />
        </MapProvider>
      )

      const [lambda, phi, gamma] = capturedContext!.projection.rotate()
      expect(lambda).toBeCloseTo(30)
      expect(phi).toBeCloseTo(15)
      expect(gamma).toBeCloseTo(0)
    })

    it("applies a 3-element rotate from projectionConfig", () => {
      let capturedContext: MapContextType | undefined

      const TestComponent = () => {
        capturedContext = useMapContext()
        return null
      }

      render(
        <MapProvider
          projection="geoMercator"
          projectionConfig={{ rotate: [30, 15, 45] }}
          width={960}
          height={600}
        >
          <TestComponent />
        </MapProvider>
      )

      const [lambda, phi, gamma] = capturedContext!.projection.rotate()
      expect(lambda).toBeCloseTo(30)
      expect(phi).toBeCloseTo(15)
      expect(gamma).toBeCloseTo(45)
    })

    it("applies a scale from projectionConfig", () => {
      let capturedContext: MapContextType | undefined

      const TestComponent = () => {
        capturedContext = useMapContext()
        return null
      }

      render(
        <MapProvider
          projection="geoMercator"
          projectionConfig={{ scale: 250 }}
          width={960}
          height={600}
        >
          <TestComponent />
        </MapProvider>
      )

      expect(capturedContext?.projection.scale()).toBe(250)
    })

    it("applies parallels from projectionConfig on a conic projection", () => {
      let capturedContext: MapContextType | undefined

      const TestComponent = () => {
        capturedContext = useMapContext()
        return null
      }

      render(
        <MapProvider
          projection="geoConicEqualArea"
          projectionConfig={{ parallels: [29.5, 45.5] }}
          width={960}
          height={600}
        >
          <TestComponent />
        </MapProvider>
      )

      const [parallel1, parallel2] = (
        capturedContext!.projection as any
      ).parallels()
      expect(parallel1).toBeCloseTo(29.5)
      expect(parallel2).toBeCloseTo(45.5)
    })

    it("ignores parallels from projectionConfig on a non-conic projection", () => {
      let capturedContext: MapContextType | undefined

      const TestComponent = () => {
        capturedContext = useMapContext()
        return null
      }

      expect(() =>
        render(
          <MapProvider
            projection="geoMercator"
            projectionConfig={{ parallels: [29.5, 45.5] }}
            width={960}
            height={600}
          >
            <TestComponent />
          </MapProvider>
        )
      ).not.toThrow()

      expect(capturedContext?.projection).toBeDefined()
      expect((capturedContext?.projection as any).parallels).toBeUndefined()
    })
  })
})
