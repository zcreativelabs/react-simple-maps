import { describe, it, expect, vi } from "vitest"
import {
  getCoords,
  createConnectorPath,
  prepareMesh,
  prepareFeatures,
  isString,
} from "./utils"

describe("getCoords", () => {
  it("returns the center point unchanged when transform is identity", () => {
    const [x, y] = getCoords(800, 600, { x: 0, y: 0, k: 1 })
    expect(x).toBeCloseTo(400)
    expect(y).toBeCloseTo(300)
  })

  it("accounts for scale", () => {
    // With x=y=0 and k=2, the offset introduced by scaling around the
    // center is not compensated by any translation, so the returned point
    // shifts toward the origin rather than staying centered.
    const [x, y] = getCoords(800, 600, { x: 0, y: 0, k: 2 })
    expect(x).toBeCloseTo(200)
    expect(y).toBeCloseTo(150)
  })

  it("accounts for translation", () => {
    const [x, y] = getCoords(800, 600, { x: 100, y: 50, k: 1 })
    expect(x).toBeCloseTo(300)
    expect(y).toBeCloseTo(250)
  })

  it("accounts for combined translation and scale", () => {
    const [x, y] = getCoords(800, 600, { x: 100, y: 50, k: 2 })
    expect(x).toBeCloseTo(150)
    expect(y).toBeCloseTo(125)
  })
})

describe("createConnectorPath", () => {
  it("returns an SVG path string starting with a moveto command", () => {
    const path = createConnectorPath()
    expect(path).toMatch(/^M0,0/)
  })

  it("uses default dx/dy/curve when called with no arguments", () => {
    const path = createConnectorPath()
    expect(path).toContain("-30")
  })

  it("reflects custom dx/dy in the resulting path", () => {
    const path = createConnectorPath(100, 50)
    expect(path).toContain("-100")
    expect(path).toContain("-50")
  })

  it("accepts a single curve number applied to both axes", () => {
    const path = createConnectorPath(30, 30, 1)
    expect(path).toMatch(/^M0,0 Q/)
  })

  it("accepts a [x, y] curve tuple", () => {
    const path = createConnectorPath(30, 30, [0.2, 0.8])
    expect(path).toMatch(/^M0,0 Q/)
  })

  it("produces different paths for different curve values", () => {
    const straight = createConnectorPath(30, 30, 0)
    const curved = createConnectorPath(30, 30, 1)
    expect(straight).not.toBe(curved)
  })
})

describe("prepareMesh", () => {
  const outline = {
    type: "MultiLineString" as const,
    coordinates: [[[0, 0], [1, 1]]],
  }
  const borders = {
    type: "MultiLineString" as const,
    coordinates: [[[2, 2], [3, 3]]],
  }
  const path = vi.fn(() => "M0,0")

  it("returns outline and borders with rsmKey and svgPath when both are provided", () => {
    const result = prepareMesh(outline, borders, path)
    expect(result.outline?.rsmKey).toBe("outline")
    expect(result.borders?.rsmKey).toBe("borders")
    expect(result.outline?.svgPath).toBe("M0,0")
    expect(result.borders?.svgPath).toBe("M0,0")
  })

  it("returns an empty object when outline is missing", () => {
    const result = prepareMesh(undefined, borders, path)
    expect(result).toEqual({})
  })

  it("returns an empty object when borders is missing", () => {
    const result = prepareMesh(outline, undefined, path)
    expect(result).toEqual({})
  })

  it("returns an empty object when both are missing", () => {
    const result = prepareMesh(undefined, undefined, path)
    expect(result).toEqual({})
  })
})

describe("prepareFeatures", () => {
  const path = vi.fn(() => "M0,0")
  const features = [
    {
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [0, 0] },
      properties: {},
    },
    {
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [1, 1] },
      properties: {},
    },
  ]

  it("returns an empty array when geographies is undefined", () => {
    expect(prepareFeatures(undefined, path)).toEqual([])
  })

  it("assigns a unique, index-based rsmKey to each feature", () => {
    const result = prepareFeatures(features, path)
    expect(result[0].rsmKey).toBe("geo-0")
    expect(result[1].rsmKey).toBe("geo-1")
  })

  it("attaches svgPath computed from the path function", () => {
    const result = prepareFeatures(features, path)
    expect(result[0].svgPath).toBe("M0,0")
    expect(path).toHaveBeenCalledWith(features[0])
  })

  it("preserves the original feature's fields", () => {
    const result = prepareFeatures(features, path)
    expect(result[0].type).toBe("Feature")
    expect(result[0].geometry).toEqual(features[0].geometry)
  })
})

describe("isString", () => {
  it("returns true for strings", () => {
    expect(isString("https://example.com/geo.json")).toBe(true)
  })

  it("returns false for a GeoJSON object", () => {
    expect(
      isString({ type: "FeatureCollection", features: [] } as any)
    ).toBe(false)
  })

  it("returns false for an array of GeoJSON objects", () => {
    expect(
      isString([{ type: "FeatureCollection", features: [] }] as any)
    ).toBe(false)
  })
})
