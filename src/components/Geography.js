import React, { useState, memo, forwardRef } from "react"
import PropTypes from "prop-types"

const Geography = forwardRef(
  (
    {
      geography,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onFocus,
      onBlur,
      style = {},
      className = "",
      ...restProps
    },
    ref
  ) => {
    const [isPressed, setPressed] = useState(false)
    const [isFocused, setFocus] = useState(false)

    function handleMouseEnter(evt) {
      setFocus(true)
      if (onMouseEnter) onMouseEnter(evt)
    }

    function handleMouseLeave(evt) {
      setFocus(false)
      if (isPressed) setPressed(false)
      if (onMouseLeave) onMouseLeave(evt)
    }

    function handleFocus(evt) {
      setFocus(true)
      if (onFocus) onFocus(evt)
    }

    function handleBlur(evt) {
      setFocus(false)
      if (isPressed) setPressed(false)
      if (onBlur) onBlur(evt)
    }

    function handleMouseDown(evt) {
      setPressed(true)
      if (onMouseDown) onMouseDown(evt)
    }

    function handleMouseUp(evt) {
      setPressed(false)
      if (onMouseUp) onMouseUp(evt)
    }

    return (
      <path
        ref={ref}
        tabIndex="0"
        className={`rsm-geography ${className}`}
        d={geography.svgPath}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={
          style[
            isPressed || isFocused
              ? isPressed
                ? "pressed"
                : "hover"
              : "default"
          ]
        }
        {...restProps}
      />
    )
  }
)

Geography.displayName = "Geography"

Geography.propTypes = {
  geography: PropTypes.object,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
}

export default memo(Geography)
