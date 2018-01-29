
import React, { Component } from "react"
import { feature } from "topojson-client"

class Geographies extends Component {
  constructor(props) {
    super(props)

    this.state = {
      geographyPaths:
        this.shouldFetchGeographies(props.geography) ? [] :
          this.parseGeography(props.geography)
    }

    this.fetchGeographies = this.fetchGeographies.bind(this)
  }
  fetchGeographies(geography) {
    const { width, height } = this.props

    if(!geography) return

    else if (Object.prototype.toString.call(geography) === '[object Object]') {
      this.setState({
          geographyPaths: feature(geography, geography.objects[Object.keys(geography.objects)[0]]).features
        })
    }

    else if (Array.isArray(geography)) {
      this.setState({ geographyPaths: geography })
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
            if (!this.props.onGeographyPathsLoaded) return
            this.props.onGeographyPathsLoaded(String(request.status))
          })
        } else {
          if (!this.props.onGeographyPathsLoaded) return
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
    if (nextProps.geography !== this.props.geography) {
      if (this.shouldFetchGeographies(nextProps.geography)) {
        this.fetchGeographies(nextProps.geography)
      } else {
        this.setState({
          geographyPaths: this.parseGeography(nextProps.geography)
        })
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const geoPathsChanged = nextState.geographyPaths.length !== this.state.geographyPaths.length
    return geoPathsChanged || nextProps.disableOptimization
  }
  componentDidMount() {
    if (this.props.geographyUrl || this.props.geographyPaths) {
      console.warn("You are using the deprecated geographyUrl or geographyPaths props. Use the new geography prop instead. Check out the new docs here: https://github.com/zcreativelabs/react-simple-maps#Geographies-component")
    }
    if (this.shouldFetchGeographies(this.props.geography)) {
      this.fetchGeographies(this.props.geography)
    }
  }
  componentWillUnmount() {
    this.cancelPendingRequest()
  }
  render() {
    const {
      projection,
      style,
      children,
    } = this.props
    return (
      <g className="rsm-geographies" style={ style }>
        { children(this.state.geographyPaths || [], projection) }
      </g>
    )
  }
  shouldFetchGeographies(geography) {
    return typeof(geography) === 'string'
  }
  parseGeography(geography) {
    if (Array.isArray(geography)) {
      return geography
    }

    if (Object.prototype.toString.call(geography) === '[object Object]') {
      return feature(geography, geography.objects[Object.keys(geography.objects)[0]]).features
    }

    return []
  }
  fetchGeographies(geography) {
    const request = new XMLHttpRequest()
    request.open("GET", geography, true)
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const geographyPaths = JSON.parse(request.responseText)
        this.setState({
          geographyPaths: this.parseGeography(geographyPaths),
        }, () => {
          if (this.props.onGeographyPathsLoaded) {
            this.props.onGeographyPathsLoaded(String(request.status))
          }
        })
      } else {
        if (this.props.onGeographyPathsLoaded) {
          this.props.onGeographyPathsLoaded(String(request.status))
        }
      }
    }
    request.onerror = () => {
      console.log("There was a connection error...")
    }
    request.send()

    this.cancelPendingRequest()
    this._xhr = request
  }
  cancelPendingRequest() {
    if (this._xhr) {
      this._xhr.abort()
      thix._xhr = null
    }
  }
}

Geographies.defaultProps = {
  componentIdentifier: "Geographies",
  disableOptimization: false,
  geography: "",
}

export default Geographies
