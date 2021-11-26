/* global React, ReactDOM, ReactRedux, Redux, KeplerGl */
/* eslint no-undef: "error" */
// based on the example at https://github.com/keplergl/kepler.gl/blob/master/examples/umd-client/index.html

const { combineReducers, applyMiddleware, createStore, compose } = Redux
const { Provider } = ReactRedux

// If we wanted to have this with our javascript.
// Unfortunately webpack fails to load a dependency of moment-timezone
// import KeplerGl from 'kepler.gl'
// import React, { ReactDOM } from 'react'
// import { combineReducers, applyMiddleware, createStore, compose } from 'redux'
// import { Provider } from 'react-redux'

export const buildStore = function () {
  const reducers = combineReducers({
    // mount keplerGl reducer
    keplerGl: KeplerGl.keplerGlReducer
  })
  const middleWares = KeplerGl.enhanceReduxMiddleware([
    // Add other middlewares here
  ])
  const enhancers = applyMiddleware(...middleWares)
  const initialState = {}
  const store = createStore(reducers, initialState, compose(enhancers))
  return store
}

export function init(containerElement, props = {}, store, mapboxToken) {
  const KeplerElement = function (props) {
    return React.createElement(
      'div',
      {
        style: {
          position: 'absolute',
          left: 0,
          width: '100vw',
          height: '100vh'
        }
      },
      React.createElement(KeplerGl.KeplerGl, {
        mapboxApiAccessToken: mapboxToken,
        id: 'map',
        width: props.width || 1200,
        height: props.height || 800
      })
    )
  }
  const app = React.createElement(
    Provider,
    { store },
    React.createElement(KeplerElement, props)
  )
  ReactDOM.render(app, containerElement)
}

function extractDataId(config) {
  let dataId = config?.config?.visState?.filters?.[0]?.dataId?.[0]
  if (!dataId) {
    dataId = config?.config?.visState?.layers?.[0]?.config?.dataId
  }
  return dataId || 'the-data-id'
}

export function update(data, store) {
  const { config, rawCsv } = data
  const dataset = {
    info: { id: extractDataId(config), label: 'trips' },
    data: KeplerGl.processCsvData(rawCsv)
  }
  let parsedConfig = {}
  if (config) {
    parsedConfig = KeplerGl.KeplerGlSchema.parseSavedConfig(config)
  }
  store.dispatch(
    KeplerGl.addDataToMap({
      datasets: [dataset],
      options: { centerMap: true, readOnly: true },
      config: parsedConfig
    })
  )
  // console.log('layers', store.getState().keplerGl.map.visState.layers)
}
