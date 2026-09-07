import React from "react"
import { render, act } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { geoMercator } from "d3-geo"
import useZoomPan from "./useZoomPan"
import { MapProvider } from "../../core/components/MapProvider"

const mockProjection = geoMercator().scale(100).translate([480, 300])

function ZoomPanHarness({
  zoomPanProps,
  onResult,
}: {
  zoomPanProps: Parameters<typeof useZoomPan>[0]
  onResult: (result: ReturnType<typeof useZoomPan>) => void
}) {
  const result = useZoomPan(zoomPanProps)
  onResult(result)
  return (
    <svg width={960} height={600}>
      <g ref={result.mapRef} transform={result.transformString} />
    </svg>
  )
}

function renderZoomPan(props: Parameters<typeof useZoomPan>[0] = {}) {
  let latestResult: ReturnType<typeof useZoomPan>

  const utils = render(
    <MapProvider projection={mockProjection} width={960} height={600}>
      <ZoomPanHarness
        zoomPanProps={props}
        onResult={(result) => {
          latestResult = result
        }}
      />
    </MapProvider>
  )

  const rerenderWithProps = (nextProps: Parameters<typeof useZoomPan>[0]) => {
    act(() => {
      utils.rerender(
        <MapProvider projection={mockProjection} width={960} height={600}>
          <ZoomPanHarness
            zoomPanProps={nextProps}
            onResult={(result) => {
              latestResult = result
            }}
          />
        </MapProvider>
      )
    })
  }

  return {
    ...utils,
    getMapNode: () => utils.container.querySelector("g") as SVGGElement,
    getResult: () => latestResult,
    rerenderWithProps,
  }
}

describe("useZoomPan", () => {
  it("returns an initial identity transform", () => {
    const { getResult } = renderZoomPan()
    expect(getResult().transformString).toBe("translate(0 0) scale(1)")
    expect(getResult().position).toEqual({ x: 0, y: 0, k: 1 })
  })

  it("exposes a mapRef bound to a real DOM node", () => {
    const { getMapNode, getResult } = renderZoomPan()
    expect(getMapNode()).toBeTruthy()
    expect(getResult().mapRef.current).toBe(getMapNode())
  })

  it("does not throw when mapRef is not yet attached to a DOM node", () => {
    const TestComponent = () => {
      const result = useZoomPan({})
      // Deliberately never attach mapRef to anything.
      return <div data-testid="rendered">{result.transformString}</div>
    }

    expect(() =>
      render(
        <MapProvider projection={mockProjection} width={960} height={600}>
          <TestComponent />
        </MapProvider>
      )
    ).not.toThrow()
  })

  it("does not rebind the zoom behavior when only callback identities change", () => {
    // Regression test: useZoomPan's binding effect used to depend on
    // onMoveStart/onMove/onMoveEnd by reference. A parent passing a fresh
    // inline callback every render (the common JSX pattern) made the effect
    // tear down and rebuild d3-zoom's listeners on every render, which in
    // practice caused runaway rebinding during interaction. d3-selection's
    // .on() calls addEventListener directly on the DOM node, so counting
    // those calls tells us whether the binding effect re-ran.
    const addEventListenerSpy = vi.spyOn(
      SVGGElement.prototype,
      "addEventListener"
    )

    const { rerenderWithProps } = renderZoomPan({
      onMoveEnd: () => {},
    })

    const callsAfterMount = addEventListenerSpy.mock.calls.length
    expect(callsAfterMount).toBeGreaterThan(0)

    // Same width/height/projection, but a brand-new onMoveEnd function
    // identity - exactly what an inline arrow prop produces every render.
    rerenderWithProps({ onMoveEnd: () => {} })

    expect(addEventListenerSpy.mock.calls.length).toBe(callsAfterMount)

    addEventListenerSpy.mockRestore()
  })

  it("rebinds the zoom behavior when scaleExtent changes", () => {
    const addEventListenerSpy = vi.spyOn(
      SVGGElement.prototype,
      "addEventListener"
    )

    const { rerenderWithProps } = renderZoomPan({})
    const callsAfterMount = addEventListenerSpy.mock.calls.length

    // scaleExtent is part of the binding effect's dependency array -
    // changing it should rebind.
    rerenderWithProps({ scaleExtent: [2, 4] })

    expect(addEventListenerSpy.mock.calls.length).toBeGreaterThan(
      callsAfterMount
    )

    addEventListenerSpy.mockRestore()
  })

  it("does not throw when the projection cannot invert coordinates (invert is undefined)", () => {
    const nonInvertibleProjection = Object.assign(
      (coords: [number, number]) => mockProjection(coords),
      {
        center: mockProjection.center,
        translate: mockProjection.translate,
        scale: mockProjection.scale,
        rotate: mockProjection.rotate,
        invert: undefined,
      }
    ) as unknown as typeof mockProjection

    const onMoveEnd = vi.fn()

    expect(() =>
      render(
        <MapProvider
          projection={nonInvertibleProjection}
          width={960}
          height={600}
        >
          <ZoomPanHarness zoomPanProps={{ onMoveEnd }} onResult={() => {}} />
        </MapProvider>
      )
    ).not.toThrow()
  })

  it("does not update the synced transform when the projection cannot place the requested center", () => {
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

    let latestResult: ReturnType<typeof useZoomPan>
    render(
      <MapProvider
        projection={unprojectableProjection}
        width={960}
        height={600}
      >
        <ZoomPanHarness
          zoomPanProps={{ center: [999, 999], zoom: 3 }}
          onResult={(result) => {
            latestResult = result
          }}
        />
      </MapProvider>
    )

    expect(latestResult!.position).toEqual({ x: 0, y: 0, k: 1 })
  })

  it("syncs the transform when center/zoom props change to a projectable point", () => {
    const { rerenderWithProps, getResult } = renderZoomPan({
      center: [0, 0],
      zoom: 1,
    })

    expect(getResult().position).toEqual({ x: 0, y: 0, k: 1 })

    rerenderWithProps({ center: [10, 10], zoom: 2 })

    expect(getResult().position.k).toBe(2)
    expect(getResult().position).not.toEqual({ x: 0, y: 0, k: 1 })
    expect(getResult().transformString).toContain("scale(2)")
  })

  it("centers on center={[0, 0]} even when the projection is rotated", () => {
    // Regression test: the sync effect used to compare center/zoom against a
    // lastPosition ref that defaulted to {x: 0, y: 0, k: 1}. On mount, a
    // caller passing center={[0, 0]} and zoom={1} (both the hook's own
    // defaults) matched that sentinel, so the effect returned early and the
    // transform needed to place geographic [0, 0] at the screen center -
    // which differs from the identity transform once the projection is
    // rotated - was never computed. The map then rendered wherever the
    // rotation happened to place [0, 0], ignoring the requested center.
    const rotatedProjection = geoMercator()
      .scale(100)
      .translate([480, 300])
      .rotate([-40, 0, 0])

    let latestResult: ReturnType<typeof useZoomPan>
    render(
      <MapProvider projection={rotatedProjection} width={960} height={600}>
        <ZoomPanHarness
          zoomPanProps={{ center: [0, 0], zoom: 1 }}
          onResult={(result) => {
            latestResult = result
          }}
        />
      </MapProvider>
    )

    const expectedCoords = rotatedProjection([0, 0]) as [number, number]
    expect(latestResult!.position).toEqual({
      x: 480 - expectedCoords[0],
      y: 300 - expectedCoords[1],
      k: 1,
    })
    expect(latestResult!.position).not.toEqual({ x: 0, y: 0, k: 1 })
  })

  it("does not resync when center/zoom props are unchanged", () => {
    const { rerenderWithProps, getResult } = renderZoomPan({
      center: [10, 10],
      zoom: 2,
    })

    rerenderWithProps({ center: [10, 10], zoom: 2 })
    const positionAfterFirstSync = getResult().position

    rerenderWithProps({ center: [10, 10], zoom: 2 })

    expect(getResult().position).toEqual(positionAfterFirstSync)
  })

  describe("dispatching zoom gestures through the bound d3-zoom behavior", () => {
    // useZoomPan binds a real d3-zoom instance to mapRef's DOM node. Rather
    // than reimplementing d3-zoom's own gesture-recognition tests, we fire a
    // real WheelEvent at that node - the same DOM entry point a browser
    // gesture uses - so d3-zoom's actual "start" -> "zoom" -> "end" sequence
    // runs, and we assert on *our* handler glue: reading d3Event.transform,
    // calling setPosition, and invoking onMoveStart/onMove/onMoveEnd with
    // the right payloads.
    function wheelZoomIn(node: SVGGElement) {
      node.dispatchEvent(
        new WheelEvent("wheel", {
          bubbles: true,
          cancelable: true,
          deltaY: -100,
          clientX: 480,
          clientY: 300,
        })
      )
    }

    it("calls onMoveStart and onMove synchronously on a wheel gesture", () => {
      const onMoveStart = vi.fn()
      const onMove = vi.fn()
      const { getMapNode } = renderZoomPan({
        onMoveStart,
        onMove,
      })

      act(() => {
        wheelZoomIn(getMapNode())
      })

      expect(onMoveStart).toHaveBeenCalled()
      expect(onMove).toHaveBeenCalled()

      const [startProps] = onMoveStart.mock.calls[0]
      expect(startProps.coordinates).toBeDefined()
      expect(startProps.coordinates).toHaveLength(2)
    })

    it("calls onMoveEnd with coordinates once d3-zoom's wheel-idle timeout fires", async () => {
      vi.useFakeTimers()
      const onMoveEnd = vi.fn()
      const { getMapNode } = renderZoomPan({ onMoveEnd })

      act(() => {
        wheelZoomIn(getMapNode())
      })
      expect(onMoveEnd).not.toHaveBeenCalled()

      // d3-zoom debounces the "end" event of a wheel gesture behind a
      // 150ms wheelDelay timeout, so it doesn't fire the moment scrolling
      // stops - it fires once no further wheel events arrive within that
      // window.
      act(() => {
        vi.advanceTimersByTime(200)
      })

      expect(onMoveEnd).toHaveBeenCalled()
      const [endProps] = onMoveEnd.mock.calls[0]
      expect(endProps.coordinates).toBeDefined()
      expect(endProps.coordinates).toHaveLength(2)

      vi.useRealTimers()
    })

    it("does not throw when a gesture ends without an onMoveEnd callback", () => {
      vi.useFakeTimers()
      const { getMapNode } = renderZoomPan({})

      expect(() => {
        act(() => {
          wheelZoomIn(getMapNode())
          vi.advanceTimersByTime(200)
        })
      }).not.toThrow()

      vi.useRealTimers()
    })

    it("updates position with the transform reported by the gesture", () => {
      const { getMapNode, getResult } = renderZoomPan()

      act(() => {
        wheelZoomIn(getMapNode())
      })

      expect(getResult().position.k).not.toBe(1)
    })

    it("calls onMove with a zoom value matching the gesture's scale", () => {
      const onMove = vi.fn()
      const { getMapNode } = renderZoomPan({ onMove })

      act(() => {
        wheelZoomIn(getMapNode())
      })

      const [moveProps] = onMove.mock.calls[0]
      expect(typeof moveProps.zoom).toBe("number")
      expect(moveProps.zoom).not.toBe(1)
    })

    it("respects a custom filterZoomEvent that rejects all gestures", () => {
      const filterZoomEvent = vi.fn(() => false)
      const onMove = vi.fn()
      const { getMapNode } = renderZoomPan({ filterZoomEvent, onMove })

      act(() => {
        wheelZoomIn(getMapNode())
      })

      expect(filterZoomEvent).toHaveBeenCalled()
      expect(onMove).not.toHaveBeenCalled()
    })

    it("does not throw when the gesture ends and the projection cannot invert its transform", () => {
      vi.useFakeTimers()

      const nonInvertibleProjection = Object.assign(
        (coords: [number, number]) => mockProjection(coords),
        {
          center: mockProjection.center,
          translate: mockProjection.translate,
          scale: mockProjection.scale,
          rotate: mockProjection.rotate,
          invert: undefined,
        }
      ) as unknown as typeof mockProjection

      const onMoveEnd = vi.fn()

      const { container } = render(
        <MapProvider
          projection={nonInvertibleProjection}
          width={960}
          height={600}
        >
          <ZoomPanHarness zoomPanProps={{ onMoveEnd }} onResult={() => {}} />
        </MapProvider>
      )
      const mapNode = container.querySelector("g") as SVGGElement

      expect(() => {
        act(() => {
          wheelZoomIn(mapNode)
          vi.advanceTimersByTime(200)
        })
      }).not.toThrow()

      expect(onMoveEnd).toHaveBeenCalled()
      const [endProps] = onMoveEnd.mock.calls[0]
      expect(endProps.coordinates).toBeUndefined()

      vi.useRealTimers()
    })
  })
})
