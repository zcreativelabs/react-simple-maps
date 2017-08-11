
import React, { Component } from "react"
import { feature } from "topojson-client"

class Geographies extends Component {
  constructor(props) {
    super(props)

    this.state = {
      geographyPaths: props.geographyPaths,
    }

    this.fetchGeographies = this.fetchGeographies.bind(this)
  }
  fetchGeographies(geographyUrl) {
    const { width, height } = this.props

    if(!geographyUrl) return

    const request = new XMLHttpRequest()
    request.open("GET", geographyUrl, true)

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const geographyPaths = JSON.parse(request.responseText)
        this.setState({
          geographyPaths: feature(geographyPaths, geographyPaths.objects[Object.keys(geographyPaths.objects)[0]]).features,
        }, () => {
          if (!this.props.onGeographiesLoaded) return
          this.props.onGeographyPathsLoaded(String(request.status))
        })
      } else {
        if (!this.props.onGeographiesLoaded) return
        this.props.onGeographyPathsLoaded(String(request.status))
      }
    }
    request.onerror = () => {
      console.log("There was a connection error...")
    }
    request.send()
  }
  componentWillReceiveProps(nextProps) {;
    if (!nextProps.geographyUrl && !nextProps.geographyPaths.length !== this.props.geographyPaths.length) {
      this.setState({
        geographyPaths: nextProps.geographyPaths,
      })
      return
    }
    if (nextProps.geographyUrl !== this.props.geographyUrl) {
      this.fetchGeographies(nextProps.geographyUrl)
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const geoPathsChanged = nextState.geographyPaths.length !== this.state.geographyPaths.length
    const choroplethChanged = JSON.stringify(nextProps.choropleth) !== JSON.stringify(this.props.choropleth)
    return geoPathsChanged || choroplethChanged || nextProps.disableOptimization
  }
  componentDidMount() {
    this.fetchGeographies(this.props.geographyUrl)
  }
  render() {

    const {
      projection,
      style,
      children,
    } = this.props

    return (
      <g className="rsm-geographies" style={ style }>
        { children(this.state.geographyPaths, projection) }
      </g>
    )
  }
}

Geographies.defaultProps = {
  componentIdentifier: "Geographies",
  disableOptimization: false,
  geographyUrl: "",
  geographyPaths: [],
}

export default Geographies
