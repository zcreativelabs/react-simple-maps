
import React, { Component } from "react"

import MapGroup from "./MapGroup"

const Annotations = ({
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

Annotations.defaultProps = {
  componentIdentifier: "Annotations",
  groupName: "annotations",
  itemName: "annotation",
}

export default Annotations
