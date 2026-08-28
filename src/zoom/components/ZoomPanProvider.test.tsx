import React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { ZoomPanProvider, useZoomPanContext } from "./ZoomPanProvider"

describe("ZoomPanProvider", () => {
  it("provides the given value to descendants", () => {
    let captured: ReturnType<typeof useZoomPanContext> | undefined

    const Probe = () => {
      captured = useZoomPanContext()
      return null
    }

    render(
      <ZoomPanProvider value={{ x: 10, y: 20, k: 2, transformString: "t" }}>
        <Probe />
      </ZoomPanProvider>
    )

    expect(captured).toEqual({ x: 10, y: 20, k: 2, transformString: "t" })
  })

  it("falls back to the default identity value when no value prop is given", () => {
    let captured: ReturnType<typeof useZoomPanContext> | undefined

    const Probe = () => {
      captured = useZoomPanContext()
      return null
    }

    render(
      <ZoomPanProvider>
        <Probe />
      </ZoomPanProvider>
    )

    expect(captured).toEqual({
      x: 0,
      y: 0,
      k: 1,
      transformString: "translate(0 0) scale(1)",
    })
  })

  it("renders children", () => {
    const { getByTestId } = render(
      <ZoomPanProvider>
        <div data-testid="child">Child</div>
      </ZoomPanProvider>
    )
    expect(getByTestId("child")).toBeTruthy()
  })

  it("throws when useZoomPanContext is used outside a provider", () => {
    const Probe = () => {
      useZoomPanContext()
      return null
    }

    const originalError = console.error
    console.error = () => {}

    expect(() => render(<Probe />)).toThrow()

    console.error = originalError
  })
})
