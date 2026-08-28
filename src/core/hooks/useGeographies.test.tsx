import React from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import useGeographies from "./useGeographies"
import { MapProvider } from "../components/MapProvider"
import { geoMercator } from "d3-geo"
import type { Feature, Geometry } from "geojson"

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

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MapProvider projection={geoMercator()} width={960} height={600}>
    {children}
  </MapProvider>
)

describe("useGeographies", () => {
  it("parses a feature collection", () => {
    const { result } = renderHook(
      () =>
        useGeographies({
          geography: mockFeatureCollection as any,
        }),
      { wrapper }
    )

    expect(result.current.geographies).toHaveLength(2)
    expect(result.current.geographies[0].properties?.name).toBe("Test Polygon")
    expect(result.current.geographies[1].properties?.name).toBe("Test Point")
  })

  it("generates svg paths for geographies", () => {
    const { result } = renderHook(
      () =>
        useGeographies({
          geography: mockFeatureCollection as any,
        }),
      { wrapper }
    )

    result.current.geographies.forEach((geo) => {
      expect(geo.svgPath).toBeDefined()
      expect(typeof geo.svgPath).toBe("string")
    })
  })

  it("assigns rsmKey to geographies", () => {
    const { result } = renderHook(
      () =>
        useGeographies({
          geography: mockFeatureCollection as any,
        }),
      { wrapper }
    )

    expect(result.current.geographies[0].rsmKey).toBeDefined()
    expect(result.current.geographies[1].rsmKey).toBeDefined()
    expect(result.current.geographies[0].rsmKey).not.toBe(
      result.current.geographies[1].rsmKey
    )
  })

  it("applies custom parseGeographies function", () => {
    const customParser = (features: Feature<Geometry>[]) =>
      features.filter((f) => f.geometry.type === "Polygon")

    const { result } = renderHook(
      () =>
        useGeographies({
          geography: mockFeatureCollection as any,
          parseGeographies: customParser,
        }),
      { wrapper }
    )

    expect(result.current.geographies).toHaveLength(1)
    expect(result.current.geographies[0].geometry.type).toBe("Polygon")
  })

  it("handles array of feature collections", () => {
    const { result } = renderHook(
      () =>
        useGeographies({
          geography: [
            mockFeatureCollection as any,
            mockFeatureCollection as any,
          ],
        }),
      { wrapper }
    )

    expect(result.current.geographies.length).toBeGreaterThan(0)
  })

  it("returns no geographies when geography is an empty string", () => {
    const { result } = renderHook(
      () => useGeographies({ geography: "" }),
      { wrapper }
    )

    expect(result.current.geographies).toEqual([])
  })

  it("caches result for same input", () => {
    const { result, rerender } = renderHook(
      ({ geo }) => useGeographies({ geography: geo }),
      {
        wrapper,
        initialProps: { geo: mockFeatureCollection as any },
      }
    )

    const firstResult = result.current.geographies

    rerender({ geo: mockFeatureCollection as any })
    const secondResult = result.current.geographies

    expect(firstResult).toEqual(secondResult)
  })

  describe("fetching geography from a URL", () => {
    const geoUrl = "https://example.com/geo.json"

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it("fetches and parses a FeatureCollection from a URL string", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockFeatureCollection),
        })
      )

      const { result } = renderHook(
        () => useGeographies({ geography: geoUrl }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.geographies).toHaveLength(2)
      })

      expect(fetch).toHaveBeenCalledWith(geoUrl)
      expect(result.current.geographies[0].properties?.name).toBe(
        "Test Polygon"
      )
    })

    it("fetches and parses a TopoJSON Topology from a URL string", async () => {
      const mockTopology = {
        type: "Topology" as const,
        objects: {
          countries: {
            type: "GeometryCollection" as const,
            geometries: [
              {
                type: "Polygon" as const,
                arcs: [[0]],
                properties: { name: "Testland" },
              },
            ],
          },
        },
        arcs: [
          [
            [0, 0],
            [10, 0],
            [10, 10],
            [0, 10],
            [0, 0],
          ],
        ],
      }

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockTopology),
        })
      )

      const customParser = (features: Feature<Geometry>[]) => features

      const { result } = renderHook(
        () => useGeographies({ geography: geoUrl, parseGeographies: customParser }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.geographies.length).toBeGreaterThan(0)
      })

      expect(result.current.geographies[0].properties?.name).toBe("Testland")
      expect(result.current.outline).toBeDefined()
      expect(result.current.borders).toBeDefined()
    })

    it("does not update geographies when the response is not ok", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          statusText: "Not Found",
          json: () => Promise.reject(new Error("should not be called")),
        })
      )
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})

      const { result } = renderHook(
        () => useGeographies({ geography: geoUrl }),
        { wrapper }
      )

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled()
      })

      expect(result.current.geographies).toEqual([])

      consoleSpy.mockRestore()
    })

    it("does not refetch when rerendered with the same URL", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockFeatureCollection),
      })
      vi.stubGlobal("fetch", fetchMock)

      const { result, rerender } = renderHook(
        () => useGeographies({ geography: geoUrl }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.geographies).toHaveLength(2)
      })

      rerender()
      rerender()

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })
})
