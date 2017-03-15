
import React, { PropTypes } from "react"
import defaultStyles from "./defaultStyles"

class Loader extends React.Component {
  render() {
    const {
      waitMessage,
      errorHeading,
      loadingError,
      styles,
    } = this.props

    return (
      <div style={ styles ? styles() : defaultStyles.loader() } className="rsm-loader">
        { loadingError ? (
          <span>
            { errorHeading }<br />
            { loadingError }
          </span>
        ) : (
          <span>
            { waitMessage }
          </span>
        )
        }
      </div>
    )
  }
}

Loader.propTypes = {
  waitMessage: PropTypes.string,
  errorHeading: PropTypes.string,
  loadingError: PropTypes.string,
  styles: PropTypes.func,
}

Loader.defaultProps = {
  waitMessage: "Loading map...",
  errorHeading: "Couldn't load map",
  loadingError: null,
  styles: defaultStyles.loader,
}

export default Loader
