
import React, { Component } from "react"

import MapGroup from "./MapGroup"

const Markers = ({
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

Markers.defaultProps = {
  componentIdentifier: "Markers",
  groupName: "markers",
  itemName: "marker",
}

export default Markers
