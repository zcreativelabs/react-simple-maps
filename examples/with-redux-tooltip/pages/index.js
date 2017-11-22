
import React, { Component } from "react"
import withRedux from "next-redux-wrapper"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"
import {
  Tooltip,
  actions,
} from "redux-tooltip"

import { initStore } from "../store"

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
  fontFamily: "Roboto, sans-serif",
}

const { show, hide } = actions

class WithReduxExample extends Component {
  constructor() {
    super()
    this.handleMove = this.handleMove.bind(this)
    this.handleLeave = this.handleLeave.bind(this)
  }
  handleMove(geography, evt) {
    const x = evt.clientX
    const y = evt.clientY + window.pageYOffset
    this.props.dispatch(
      show({
        origin: { x, y },
        content: geography.properties.name,
      })
    )
  }
  handleLeave() {
    this.props.dispatch(hide())
  }
  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap>
          <ZoomableGroup>
            <Geographies geography="/static/world-50m.json">
              {(geographies, projection) =>
                geographies.map((geography, i) => (
                  <Geography
                    key={i}
                    geography={geography}
                    projection={projection}
                    onMouseMove={this.handleMove}
                    onMouseLeave={this.handleLeave}
                    style={{
                      default: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      hover: {
                        fill: "#607D8B",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      pressed: {
                        fill: "#FF5722",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <Tooltip />
      </div>
    )
  }
}

export default withRedux(initStore)(WithReduxExample)
