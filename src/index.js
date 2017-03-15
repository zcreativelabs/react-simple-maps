
import React, { PropTypes } from "react"
import { json } from "d3-fetch"
import { feature } from "topojson-client"

import Loader from "./Loader"
import MapControls from "./MapControls"
import ZoomableGroup from "./ZoomableGroup"
import Geographies from "./Geographies"
import Markers from "./Markers"

import projections from "./projections"
import defaultProjectionConfig from "./projectionConfig"
import defaultStyles from "./defaultStyles"

import {
  calculateResizeFactor,
  calculateMousePosition,
} from "./utils"

class ReactSimpleMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      geographyPaths: props.geographyPaths,
      zoom: props.zoom,
      mouseX: calculateMousePosition("x", this.projection.bind(this), props, props.zoom, 1),
      mouseY: calculateMousePosition("y", this.projection.bind(this), props, props.zoom, 1),
      mouseXStart: 0,
      mouseYStart: 0,
      isPressed: false,
      loadingError: null,
      resizeFactorX: 1,
      resizeFactorY: 1,
    }

    this.projection = this.projection.bind(this)
    this.fetchGeographies = this.fetchGeographies.bind(this)

    this.handleZoomReset = this.handleZoomReset.bind(this)
    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.zoom !== this.state.zoom || nextProps.center !== this.props.center) {
      this.setState({
        zoom: nextProps.zoom,
        mouseX: calculateMousePosition("x", this.projection, nextProps, nextProps.zoom, this.state.resizeFactorX),
        mouseY: calculateMousePosition("y", this.projection, nextProps, nextProps.zoom, this.state.resizeFactorY),
      })
    }
  }
  fetchGeographies(geographyUrl) {
    if(!this.props.geographyUrl) return
    json(geographyUrl).then((geographyPaths) => {
      this.setState({
        geographyPaths: feature(geographyPaths, geographyPaths.objects[Object.keys(geographyPaths.objects)[0]]).features
      })
    }).catch((err) => {
      this.setState({
        loadingError: err
      })
    })
  }
  projection() {
    if(typeof this.props.projection !== "function") {
      return projections(this.props.width, this.props.height, this.props.projectionConfig, this.props.projection)
    }
    else {
      return this.props.projection(this.props.width, this.props.height, this.props.projectionConfig)
    }
  }
  handleZoomIn() {
    if(this.state.zoom < this.props.maxZoom) {
      this.setState({
        zoom: this.state.zoom * 2,
        mouseX: this.state.mouseX * 2,
        mouseY: this.state.mouseY * 2,
      })
    }
  }
  handleZoomOut() {
    if(this.state.zoom > this.props.minZoom) {
      this.setState({
        zoom: this.state.zoom / 2,
        mouseX: this.state.zoom === 2 ? calculateMousePosition("x", this.projection, this.props, this.props.minZoom, this.state.resizeFactorX) : this.state.mouseX / 2,
        mouseY: this.state.zoom === 2 ? calculateMousePosition("y", this.projection, this.props, this.props.minZoom, this.state.resizeFactorY) : this.state.mouseY / 2,
      })
    }
  }
  handleZoomReset() {
    if(this.state.zoom > this.props.minZoom) {
      this.setState({
        zoom: this.props.minZoom,
        mouseX: calculateMousePosition("x", this.projection, this.props, this.props.minZoom, this.state.resizeFactorX),
        mouseY: calculateMousePosition("y", this.projection, this.props, this.props.minZoom, this.state.resizeFactorY),
      })
    }
  }
  handleMouseDown({ pageX, pageY }) {
    this.setState({
      isPressed: true,
      mouseXStart: pageX - this.state.mouseX,
      mouseYStart: pageY - this.state.mouseY,
    })
  }
  handleMouseMove({ pageX, pageY }) {
    if(this.state.isPressed) {
      this.setState({
        mouseX: pageX - this.state.mouseXStart,
        mouseY: pageY - this.state.mouseYStart,
      })
    }
  }
  handleMouseUp({ pageX, pageY }) {
    this.setState({
      isPressed: false,
    })
  }

  componentDidMount() {
    this.fetchGeographies(this.props.geographyUrl)

    const actualWidth = this.wrapperNode.clientWidth
    const actualHeight = this.wrapperNode.clientHeight
    const resizeFactorX = calculateResizeFactor(actualWidth, this.props.width)
    const resizeFactorY = calculateResizeFactor(actualHeight, this.props.height)

    this.setState({
      resizeFactorX: resizeFactorX,
      resizeFactorY: resizeFactorY,
      mouseX: calculateMousePosition("x", this.projection, this.props, this.state.zoom, resizeFactorX),
      mouseY: calculateMousePosition("y", this.projection, this.props, this.state.zoom, resizeFactorY),
    })

    window.addEventListener("resize", () => {
      const actualWidth = this.wrapperNode.clientWidth
      const actualHeight = this.wrapperNode.clientHeight
      const resizeFactorX = calculateResizeFactor(actualWidth, this.props.width)
      const resizeFactorY = calculateResizeFactor(actualHeight, this.props.height)
      this.setState({
        resizeFactorX: resizeFactorX,
        resizeFactorY: resizeFactorY,
        mouseX: calculateMousePosition("x", this.projection, this.props, this.state.zoom, resizeFactorX),
        mouseY: calculateMousePosition("y", this.projection, this.props, this.state.zoom, resizeFactorY),
      })
    })
  }
  render() {

    const {
      width,
      height,
      styles,
      freezeGeographyPaths,
      markers,
      exclude,
      include,
      center,
    } = this.props

    const {
      geographyPaths,
      loadingError,
    } = this.state

    return (
      <div style={ styles.wrapper ? styles.wrapper() : defaultStyles.wrapper() } className="rsm-wrapper">
        {
          this.props.showControls ? (
            <MapControls
              handleZoomIn={ this.handleZoomIn }
              handleZoomOut={ this.handleZoomOut }
              handleZoomReset={ this.handleZoomReset }
            />
          ) : null
        }
        {
          geographyPaths.length === 0 ? (
            <Loader
              styles={ styles.loader || defaultStyles.loader }
              loadingError={ loadingError }
            />
          ) : null
        }
        <svg width={ width }
             height={ height }
             viewBox={ `0 0 ${width} ${height}` }
             style={ styles.svg ? styles.svg() : defaultStyles.svg() }
             className="rsm-svg"
             ref={(wrapperNode) => this.wrapperNode = wrapperNode}
        >
          <ZoomableGroup
            zoom={ this.state.zoom }
            mouseX={ this.state.mouseX }
            mouseY={ this.state.mouseY }
            width={ width }
            height={ height }
            isPressed={ this.state.isPressed }

            handleMouseMove={ this.handleMouseMove }
            handleMouseUp={ this.handleMouseUp }
            handleMouseDown={ this.handleMouseDown }

            styles={ styles }
            center={ [-center[0],-center[1]] }
            projection={ this.projection }
            resizeFactorX={ this.state.resizeFactorX }
            resizeFactorY={ this.state.resizeFactorY }
          >
            {
              geographyPaths.length > 0 ? (
                <Geographies
                  zoom={ this.state.zoom }
                  projection={ this.projection }
                  geographyPaths={ geographyPaths }
                  freezeGeographyPaths={ freezeGeographyPaths }
                  exclude={ exclude }
                  include={ include }
                  styles={ styles }
                  choropleth={ this.props.choropleth }
                  events={ this.props.events.geography }
                />
              ) : null
            }
            {
              geographyPaths.length > 0 ? (
                <Markers
                  projection={ this.projection }
                  markers={ markers }
                  zoom={ this.state.zoom }
                  styles={ styles }
                  events={ this.props.events.marker }
                />
              ) : null
            }
          </ZoomableGroup>
        </svg>
      </div>
    )
  }
}

ReactSimpleMap.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  geographyUrl: PropTypes.string,
  geographyPaths: PropTypes.array,
  projection: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  freezeGeographyPaths: PropTypes.bool,
  styles: PropTypes.object,
  markers: PropTypes.array,
  exclude: PropTypes.array,
  include: PropTypes.array,
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  center: PropTypes.array,
  projectionConfig: PropTypes.object,
  choropleth: PropTypes.object,
  showControls: PropTypes.bool,
}

ReactSimpleMap.defaultProps = {
  width: 800,
  height: 450,
  geographyUrl: null,
  geographyPaths: [],
  projection: "times",
  choropleth: {},
  freezeGeographyPaths: true,
  styles: defaultStyles,
  markers: [],
  exclude: [],
  include: [],
  zoom: 1,
  minZoom: 1,
  maxZoom: 8,
  center: [0,0],
  projectionConfig: defaultProjectionConfig,
  showControls: false,
  events: {
    geography: {},
    marker: {},
  }
}

export default ReactSimpleMap
