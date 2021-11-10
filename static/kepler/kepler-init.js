/* global React, ReactDOM, ReactRedux, Redux, KeplerGl */
/* eslint no-undef: "error" */
import trips from './someones-trips-data.js'

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYW5kcmVhc2t1bmRpZyIsImEiOiJja3ZxcnlmNXc2ZzUwMnFva2F2a3Q1azU5In0.NrvCU8OKlkwJOVFOgZzTzA'

// console.log('p', keplerGl.processors)
const exampleCsvData = trips[0]

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

const app = (function createReactReduxProvider(
  react,
  reactRedux,
  KeplerElement
) {
  return react.createElement(
    reactRedux.Provider,
    { store },
    react.createElement(KeplerElement, null)
  )
})(React, ReactRedux, KeplerElement)
/** END COMPONENTS **/

/** Render **/
;(function render(react, reactDOM, app) {
  reactDOM.render(app, document.getElementById('app'))
})(React, ReactDOM, app)

/**
 * Customize map.
 * Interact with map store to customize data and behavior
 */
;(function customize(keplerGl, store) {
  const dataset = {
    info: { id: 'someones data', label: "Someone's trips" },
    data: keplerGl.processCsvData(exampleCsvData)
  }

  console.log('dataset', dataset)

  store.dispatch(
    keplerGl.addDataToMap({
      datasets: [dataset],
      options: { centerMap: true, readOnly: true }
    })
  )
  // store.dispatch(keplerGl.toggleSplitMap());
})(KeplerGl, store)

function update(values) {
  console.log('update received', values)
}

if (window) {
  window.update = update
}
