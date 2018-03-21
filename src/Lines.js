
import React, { Component } from "react"

import MapGroup from "./MapGroup"

const Lines = ({
  groupName,
  itemName,
  componentIdentifier,
  ...restProps,
}) =>
  <MapGroup
    groupName={groupName}
    itemName={itemName}
    {...restProps}
  />

Lines.defaultProps = {
  componentIdentifier: "Lines",
  groupName: "lines",
  itemName: "line",
}

export default Lines
