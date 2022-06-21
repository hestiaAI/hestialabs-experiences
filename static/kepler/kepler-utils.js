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

export const buildStore = function() {
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
  const KeplerElement = function(props) {
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

/**
 * Add data to the map and configure it.
 *
 * @param store the redux store
 * @param {Object} data the config and data to display
 *
 * Data has the type:
 *
 *  {config?: Object, rawCsv?: String, keplerData?: Object}
 *
 * config:
 * The configuration of layers and filters.
 * A config can be obtained from a map at https://kepler.gl/demo
 * by exporting it as json.
 *
 * keplerData:
 * Locations in the format kepler accepts:
 *   {data: {fields: Array<{name: String}>, rows: Array<Array>}}
 * According to the doc at https://docs.kepler.gl/docs/api-reference/actions/actions#adddatatomap
 *
 *
 * rawCsv:
 * A csv string, for example the trips from your uber data.
 * This argument is only used if there is no keplerData.
 */
export function update(data, store) {
  const { config, rawCsv, keplerData } = data
  const inputData = keplerData || KeplerGl.processCsvData(rawCsv)
  const dataset = {
    info: { id: extractDataId(config), label: 'trips' },
    data: inputData
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
}
