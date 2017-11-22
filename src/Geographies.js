
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
  fetchGeographies(geography) {
    const { width, height } = this.props

    if(!geography) return

    else if (typeof geography === 'object') {
      this.setState({
          geographyPaths: feature(geographyPaths, geographyPaths.objects[Object.keys(geographyPaths.objects)[0]]).features
        })
    }
    else {
      const request = new XMLHttpRequest()
      request.open("GET", geography, true)

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
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.geography && !nextProps.geographyPaths.length !== this.props.geographyPaths.length) {
      this.setState({
        geographyPaths: nextProps.geographyPaths,
      })
      return
    }
    if (nextProps.geography !== this.props.geography) {
      this.fetchGeographies(nextProps.geography)
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const geoPathsChanged = nextState.geographyPaths.length !== this.state.geographyPaths.length
    const choroplethChanged = JSON.stringify(nextProps.choropleth) !== JSON.stringify(this.props.choropleth)
    return geoPathsChanged || choroplethChanged || nextProps.disableOptimization
  }
  componentDidMount() {
    this.fetchGeographies(this.props.geography)
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
  geography: "",
  geographyPaths: [],
}

export default Geographies
