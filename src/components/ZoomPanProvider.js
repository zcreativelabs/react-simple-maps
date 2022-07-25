import React, { createContext, useContext } from "react"
import PropTypes from "prop-types"

const ZoomPanContext = createContext()

const defaultValue = {
  x: 0,
  y: 0,
  k: 1,
  transformString: "translate(0 0) scale(1)",
}

const ZoomPanProvider = ({ value = defaultValue, ...restProps }) => {
  return <ZoomPanContext.Provider value={value} {...restProps} />
}

ZoomPanProvider.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  k: PropTypes.number,
  transformString: PropTypes.string,
}

const useZoomPanContext = () => {
  return useContext(ZoomPanContext)
}

export { ZoomPanContext, ZoomPanProvider, useZoomPanContext }
