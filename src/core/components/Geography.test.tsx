import React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Geography from "./Geography"
import type { Geography as GeographyType } from "../types"

const mockGeography: GeographyType = {
  type: "Feature",
  geometry: { type: "Point", coordinates: [0, 0] },
  properties: {},
  rsmKey: "test-1",
  svgPath: "M 0 0 L 10 10",
}

describe("Geography", () => {
  it("renders a path element", () => {
    const { container } = render(
      <svg>
        <Geography geography={mockGeography} />
      </svg>
    )
    const path = container.querySelector("path")
    expect(path).toBeTruthy()
  })

  it("applies the correct d attribute from geography", () => {
    const { container } = render(
      <svg>
        <Geography geography={mockGeography} />
      </svg>
    )
    const path = container.querySelector("path")
    expect(path?.getAttribute("d")).toBe("M 0 0 L 10 10")
  })

  it("applies className with rsm-geography prefix", () => {
    const { container } = render(
      <svg>
        <Geography geography={mockGeography} className="highlight" />
      </svg>
    )
    const path = container.querySelector("path")
    expect(path?.getAttribute("class")).toBe("rsm-geography highlight")
  })

  it("passes through style prop", () => {
    const style = { fill: "red", opacity: 0.5 }
    const { container } = render(
      <svg>
        <Geography geography={mockGeography} style={style} />
      </svg>
    )
    const path = container.querySelector("path")
    expect(path?.style.fill).toBe("red")
    expect(path?.style.opacity).toBe("0.5")
  })

  it("is focusable with tabIndex 0", () => {
    const { container } = render(
      <svg>
        <Geography geography={mockGeography} />
      </svg>
    )
    const path = container.querySelector("path")
    expect(path?.getAttribute("tabindex")).toBe("0")
  })

  it("spreads additional SVG props", () => {
    const { container } = render(
      <svg>
        <Geography
          geography={mockGeography}
          data-testid="custom-id"
          fillOpacity={0.8}
        />
      </svg>
    )
    const path = container.querySelector("path")
    expect(path?.getAttribute("data-testid")).toBe("custom-id")
    expect(path?.getAttribute("fill-opacity")).toBe("0.8")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<any>()
    render(
      <svg>
        <Geography geography={mockGeography} ref={ref} />
      </svg>
    )
    expect(ref.current).toBeTruthy()
    expect(ref.current?.getAttribute("d")).toBe("M 0 0 L 10 10")
  })
})
