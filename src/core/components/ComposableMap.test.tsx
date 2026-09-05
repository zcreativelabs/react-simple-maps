import React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import ComposableMap from "./ComposableMap"
import { useMapContext } from "./MapProvider"

describe("ComposableMap", () => {
  it("renders an svg element", () => {
    const { container } = render(<ComposableMap />)
    expect(container.querySelector("svg")).toBeTruthy()
  })

  it("applies default width/height to viewBox only", () => {
    const { container } = render(<ComposableMap />)
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("viewBox")).toBe("0 0 800 600")
  })

  it("applies custom width/height to viewBox only", () => {
    const { container } = render(<ComposableMap width={400} height={300} />)
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("viewBox")).toBe("0 0 400 300")
  })

  it("does not emit width/height as svg attributes, so the map is responsive", () => {
    const { container } = render(<ComposableMap width={400} height={300} />)
    const svg = container.querySelector("svg")
    expect(svg?.hasAttribute("width")).toBe(false)
    expect(svg?.hasAttribute("height")).toBe(false)
  })

  it("lets a caller-supplied viewBox override the generated one", () => {
    const { container } = render(
      <ComposableMap width={400} height={300} viewBox="0 0 10 10" />
    )
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("viewBox")).toBe("0 0 10 10")
  })

  it("still provides width/height to the projection context", () => {
    let capturedContext: ReturnType<typeof useMapContext> | undefined

    const Probe = () => {
      capturedContext = useMapContext()
      return null
    }

    render(
      <ComposableMap width={400} height={300}>
        <Probe />
      </ComposableMap>
    )

    expect(capturedContext?.width).toBe(400)
    expect(capturedContext?.height).toBe(300)
  })

  it("applies rsm-svg className", () => {
    const { container } = render(<ComposableMap />)
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("class")).toContain("rsm-svg")
  })

  it("applies custom className", () => {
    const { container } = render(<ComposableMap className="my-map" />)
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("class")).toContain("my-map")
  })

  it("provides map context to descendants matching its own width/height", () => {
    let capturedContext: ReturnType<typeof useMapContext> | undefined

    const Probe = () => {
      capturedContext = useMapContext()
      return null
    }

    render(
      <ComposableMap width={500} height={400}>
        <Probe />
      </ComposableMap>
    )

    expect(capturedContext?.width).toBe(500)
    expect(capturedContext?.height).toBe(400)
  })

  it("renders children inside the svg", () => {
    const { container } = render(
      <ComposableMap>
        <circle data-testid="child-circle" r={5} />
      </ComposableMap>
    )
    const svg = container.querySelector("svg")
    const circle = svg?.querySelector('[data-testid="child-circle"]')
    expect(circle).toBeTruthy()
  })

  it("forwards ref to the svg element", () => {
    const ref = React.createRef<SVGSVGElement>()
    render(<ComposableMap ref={ref} />)
    expect(ref.current).toBeTruthy()
    expect(ref.current?.tagName.toLowerCase()).toBe("svg")
  })

  it("spreads additional SVG props", () => {
    const { container } = render(<ComposableMap data-testid="custom-map" />)
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("data-testid")).toBe("custom-map")
  })
})
