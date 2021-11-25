/* global React, ReactDOM, ReactRedux, Redux, KeplerGl */
/* eslint no-undef: "error" */
// based on the example at https://github.com/keplergl/kepler.gl/blob/master/examples/umd-client/index.html

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYW5kcmVhc2t1bmRpZyIsImEiOiJja3ZxcnlmNXc2ZzUwMnFva2F2a3Q1azU5In0.NrvCU8OKlkwJOVFOgZzTzA'

/** STORE **/
const reducers = (function createReducers(redux, keplerGl) {
  return redux.combineReducers({
    // mount keplerGl reducer
    keplerGl: keplerGl.keplerGlReducer
  })
})(Redux, KeplerGl)

const middleWares = (function createMiddlewares(keplerGl) {
  return keplerGl.enhanceReduxMiddleware([
    // Add other middlewares here
  ])
})(KeplerGl)

const enhancers = (function craeteEnhancers(redux, middles) {
  return redux.applyMiddleware(...middles)
})(Redux, middleWares)

const store = (function createStore(redux, enhancers) {
  const initialState = {}

  return redux.createStore(reducers, initialState, redux.compose(enhancers))
})(Redux, enhancers)
/** END STORE **/

window.store = store

/** COMPONENTS **/
const KeplerElement = (function (react, keplerGl, mapboxToken) {
  return function (props) {
    return react.createElement(
      'div',
      {
        style: {
          position: 'absolute',
          left: 0,
          width: '100vw',
          height: '100vh'
        }
      },
      react.createElement(keplerGl.KeplerGl, {
        mapboxApiAccessToken: mapboxToken,
        id: 'map',
        width: props.width || 1200,
        height: props.height || 800
      })
    )
  }
})(React, KeplerGl, MAPBOX_TOKEN)
/** END COMPONENTS **/

const renderApp = function (props) {
  const app = React.createElement(
    ReactRedux.Provider,
    { store },
    React.createElement(KeplerElement, props)
  )
  ReactDOM.render(app, document.getElementById('app'))
}

function init(args = {}) {
  console.log('init', args)
  renderApp(args)
}

function extractDataId(config) {
  let dataId = config?.config?.visState?.filters?.[0]?.dataId?.[0]
  if (!dataId) {
    dataId = config?.config?.visState?.layers?.[0]?.config?.dataId
  }
  return dataId || 'the-data-id'
}

function update(data) {
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

if (window) {
  window.init = init
  window.update = update
}
