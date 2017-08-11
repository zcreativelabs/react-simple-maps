
import {
  createStore,
  combineReducers,
} from "redux"

import { reducer as tooltip } from "redux-tooltip"

const initialState = {
  title: "With Redux Tooltip",
}

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const initStore = (initState = { appReducer: initialState }) => {
  return createStore(combineReducers({ appReducer, tooltip }), initState)
}
