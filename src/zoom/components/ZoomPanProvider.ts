import React, { createContext, useContext, ReactNode } from "react"
import type { ZoomPanContextType, ZoomPanProviderProps } from "../types"

export const ZoomPanContext = createContext<ZoomPanContextType | undefined>(
  undefined
)

const defaultValue: ZoomPanContextType = {
  x: 0,
  y: 0,
  k: 1,
  transformString: "translate(0 0) scale(1)",
}

const ZoomPanProvider = ({
  value = defaultValue,
  children,
}: ZoomPanProviderProps) => {
  return React.createElement(ZoomPanContext.Provider, { value }, children)
}

const useZoomPanContext = (): ZoomPanContextType => {
  const context = useContext(ZoomPanContext)
  if (!context) {
    throw new Error("useZoomPanContext must be used within ZoomPanProvider")
  }
  return context
}

export { ZoomPanProvider, useZoomPanContext }
