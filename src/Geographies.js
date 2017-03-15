
import React, { PropTypes } from "react"
import defaultStyles from "./defaultStyles"
import { replaceStrokeWidth } from "./utils"
import Geography from "./Geography"

class Geographies extends React.Component {
  shouldComponentUpdate(nextProps) {
    const geoPathsChanged = nextProps.geographyPaths.length !== this.props.geographyPaths.length
    const includesChanged = nextProps.include.length !== this.props.include.length
    const excludesChanged = nextProps.exclude.length !== this.props.exclude.length
    const choroplethChanged = JSON.stringify(nextProps.choropleth) !== JSON.stringify(this.props.choropleth)
    return !this.props.freezeGeographyPaths || geoPathsChanged || includesChanged || excludesChanged || choroplethChanged
  }
  render() {

    const styles = this.props.styles.geography || defaultStyles.geography

    return (
      <g className="rsm-geographies">
        {
          this.props.geographyPaths.map((geography, i) => {
            const included = this.props.include.indexOf(geography.id) !== -1
            const notExcluded = this.props.exclude.indexOf(geography.id) === -1
            const shouldInclude = this.props.include.length > 0 ? included : notExcluded

            return shouldInclude ? (
              <Geography
                zoom={ this.props.zoom }
                key={ geography.id ? `${geography.id}-${i}` : i }
                geography={ geography }
                projection={ this.props.projection }
                choroplethValue={ this.props.choropleth[geography.id] }
                styles={ styles }
                events={ this.props.events }
              />
            ) : null
          })
        }
      </g>
    )
  }
}

Geographies.propTypes = {
  geographyPaths: PropTypes.array,
  projection: PropTypes.func.isRequired,
  freezeGeographyPaths: PropTypes.bool,
  exclude: PropTypes.array,
  include: PropTypes.array,
  styles: PropTypes.object,
  choropleth: PropTypes.object,
  events: PropTypes.object,
}

Geographies.defaultProps = {
  geographyPaths: [],
  freezeGeographyPaths: true,
  exclude: [],
  include: [],
  styles: defaultStyles,
  choropleth: {},
  events: {},
}

export default Geographies
