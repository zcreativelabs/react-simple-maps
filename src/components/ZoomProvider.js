import React, { createContext, useContext } from "react"
import PropTypes from "prop-types"

const ZoomContext = createContext()

const defaultValue = {
  x: 0,
  y: 0,
  k: 1,
  transformString: "translate(0 0) scale(1)",
}

const ZoomProvider = ({ value = defaultValue, ...restProps }) => {
  return <ZoomContext.Provider value={value} {...restProps} />
}

ZoomProvider.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  k: PropTypes.number,
  transformString: PropTypes.string,
}

const useZoomPanContext = () => {
  return useContext(ZoomContext)
}

export { ZoomContext, ZoomProvider, useZoomPanContext }
