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

function update(values) {
  const dataset = {
    info: { id: 'trips-id', label: 'trips' },
    data: KeplerGl.processCsvData(values)
  }
  store.dispatch(
    KeplerGl.addDataToMap({
      datasets: [dataset],
      options: { centerMap: true, readOnly: true }
    })
  )
}

if (window) {
  window.update = update
}
