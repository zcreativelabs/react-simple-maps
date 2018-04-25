
import React from "react"
import expect from "expect"

import Geographies from "../src/Geographies"
import Markers from "../src/Markers"

import projections from "../src/projections"
import projectionConfig from "../src/projectionConfig"

import {
  roundPath,
  calculateResizeFactor,
  calculateMousePosition,
  isChildOfType,
  createNewChildren,
} from "../src/utils"

describe("roundPath", () => {
  it("should return a rounded path with different decimals", () => {
    const sampleSVGRawPathString = "M234.9861,12.9182 L81.12839,1.12 L12.987512434,421.712Z"

    const sampleSVGRoundedPathStrings = [
      "M235,12.9 L81.1,1.1 L13,421.7Z",
      "M234.99,12.92 L81.13,1.12 L12.99,421.71Z",
      "M234.986,12.918 L81.128,1.12 L12.988,421.712Z",
    ]

    const actual = [
      roundPath(sampleSVGRawPathString, 0.1),
      roundPath(sampleSVGRawPathString, 0.01),
      roundPath(sampleSVGRawPathString, 0.001),
    ]

    const expected = [
      sampleSVGRoundedPathStrings[0],
      sampleSVGRoundedPathStrings[1],
      sampleSVGRoundedPathStrings[2],
    ]

    expect(actual[0]).toEqual(expected[0])
    expect(actual[1]).toEqual(expected[1])
    expect(actual[2]).toEqual(expected[2])
  })
})

describe("calculateResizeFactor", () => {
  it("should return proper dimensions for variable ratios", () => {
    const actualDimension = [1600, 0]
    const baseDimension = [800, 960]

    const actual = [
        calculateResizeFactor(actualDimension[0], baseDimension[0]),
        calculateResizeFactor(actualDimension[1], baseDimension[1]),
    ]
    const expected = [0.5, 1]

    expect(actual[0]).toEqual(expected[0])
    expect(actual[1]).toEqual(expected[1])
  })
})

describe("isChildOfType", () => {
  it("should identify right child type based on componentIdentifier prop", () => {

    const SampleComponent = ({ componentIdentifier }) => (
      <div>{ "Sample Component" }</div>
    )

    const actual = isChildOfType(<SampleComponent componentIdentifier="SampleComponent"/>, "SampleComponent")
    const expected = true

    expect(actual).toEqual(expected)
  })
})

describe("createNewChildren", () => {

  const sampleProps = {
    geographyPaths: [],
    projection() { return false },
    zoom: 1,
  }

  it("should create correct singular child", () => {
    const actual = createNewChildren(<Geographies />, sampleProps).props.componentIdentifier
    const expected = "Geographies"
    expect(actual).toEqual(expected)
  })
  it("should create correct multiple children", () => {
    const actual = [
      createNewChildren([<Geographies />, <Markers />], sampleProps)[0].props.componentIdentifier,
      createNewChildren([<Geographies />, <Markers />], sampleProps)[1].props.componentIdentifier,
    ]

    const expected = [
      "Geographies",
      "Markers",
    ]

    expect(actual[0]).toEqual(expected[0])
    expect(actual[1]).toEqual(expected[1])
  })
})

describe("calculateMousePosition", () => {
  it("should calculate correct offsets", () => {

    const xOffset = 10
    const yOffset = 10

    const width = 800
    const height = 450

    const referenceProps = {
      width: width,
      height: height,
      zoom: 1,
      center: [ 0, 0 ],
    }

    const referenceProjection = () => projections(referenceProps.width, referenceProps.height, projectionConfig, "times")
    const referencePosition = referenceProjection()([ xOffset, yOffset ])

    const testProps = {
      width: width,
      height: height,
      zoom: 1,
      center: [ xOffset, yOffset ],
    }

    const projection = () => projections(testProps.width, testProps.height, projectionConfig, "times")

    const offsets = [
      calculateMousePosition("x", projection(), testProps, testProps.zoom, 1),
      calculateMousePosition("y", projection(), testProps, testProps.zoom, 1),
    ]

    const sums = [
      referencePosition[0]-(-offsets[0]),
      referencePosition[1]-(-offsets[1]),
    ]

    expect(Math.round(sums[0])).toEqual(width/2)
    expect(Math.round(sums[1])).toEqual(height/2)

  })
})
