/* global React, ReactDOM, ReactRedux, Redux, KeplerGl */
/* eslint no-undef: "error" */
// based on the example at https://github.com/keplergl/kepler.gl/blob/master/examples/umd-client/index.html

// If we wanted to have this with our javascript.
// Unfortunately webpack fails to load a dependency of moment-timezone
// import KeplerGl from 'kepler.gl'
// import React, { ReactDOM } from 'react'
// import { combineReducers, applyMiddleware, createStore, compose } from 'redux'
// import { Provider } from 'react-redux'

const { combineReducers, applyMiddleware, createStore, compose } = Redux
const { Provider } = ReactRedux
import getBestViewport from './map-centering-helper.js'

const buildStore = function () {
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

function init(containerElement, props = {}, store) {
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
        mapboxApiAccessToken: props.mapboxToken,
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
function update(data, store) {
  const { config, rawCsv, keplerData } = data
  // make deep copy in order to not modifiy the store
  const configClone = JSON.parse(JSON.stringify(config))
  const inputData = keplerData || KeplerGl.processCsvData(rawCsv)
  let dataset = {
    info: { id: extractDataId(configClone), label: 'trips' },
    data: inputData
  }
  let parsedConfig = {}
  if (configClone) {
    parsedConfig = KeplerGl.KeplerGlSchema.parseSavedConfig(configClone)
  }
  parsedConfig.mapStyle = {
    styleType: 'tqwsxjb',
    topLayerGroups: {},
    visibleLayerGroups: {
      label: true,
      road: true,
      building: true,
      water: true,
      land: true
    },
    threeDBuildingColor: [
      194.6103322548211, 191.81688250953655, 185.2988331038727
    ],
    mapStyles: {
      tqwsxjb: {
        accessToken: null,
        custom: true,
        icon: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.3391,37.7922,9,0,0/400x300?access_token=pk.eyJ1IjoidWNmLW1hcGJveCIsImEiOiJja2tyMjNhcWIwc29sMnVzMThoZ3djNXhzIn0._hfBNwCD7pCU7RAMOq6vUQ&logo=false&attribution=false',
        id: 'tqwsxjb',
        label: 'Mapbox Streets',
        url: 'mapbox://styles/mapbox/streets-v11'
      }
    }
  }

  if (data.overrideDefaultZoom == true) {
    if (
      Array.isArray(data.overrideData) &&
      Array.isArray(data.overrideLatLongColumnPairs)
    ) {
      // we have some data from which to get lat long points we can use to calculate override of default zoom
      console.log('override received:')
      console.dir(data.overrideData)
      console.dir(data.overrideLatLongColumnPairs)
    } else {
      console.log(
        'Error:overrideData was selected, but one of the needed props of overrideData and overrideLatLongColumnPairs is missing or not an array'
      )
    }

    debugger
    let ret = getBestViewport(
      data.overrideData,
      data.overrideLatLongColumnPairs
    )
    console.dir(ret)

    console.log(
      'NOT UPDATING MAP FOR NOW BECAUSE NOT CODED YET AND DONT WANT TO USE DEFAULT ZOOM'
    )
    console.dir(parsedConfig)
  } else {
    console.log('relying on Kepler for default map zooming.')
    console.dir(parsedConfig)

    console.dir(dataset)
    //debugger

    //moving to some Norway data
    dataset = JSON.parse(
      '{"info":{"id":"z4wgnauuw","label":"trips"},"data":{"id":"z4wgnauuw","label":"GPS_all.csv","color":[143,47,191],"allData":[[null,"2020-09-06 7:06:23","2020-09-06 9:06:23",59.913868,10.752245,"onboard",null,null],[null,"2020-09-06 7:06:23","2020-09-06 9:06:23",59.920870,10.774910,"onboard",null,null]],"fields":[{"name":"2","type":"string"},{"name":"time","type":"timestamp","format":"YYYY-M-D H:m:s","analyzerType":"DATETIME"},{"name":"time_2","type":"timestamp","format":"YYYY-M-D H:m:s","analyzerType":"DATETIME"},{"name":"lat","type":"real","format":"","analyzerType":"FLOAT"},{"name":"lng","type":"real","format":"","analyzerType":"FLOAT"},{"name":"status","type":"string","format":"","analyzerType":"STRING"},{"name":"previous_lat","type":"real","format":"","analyzerType":"FLOAT"},{"name":"previous_lng","type":"real","format":"","analyzerType":"FLOAT"}],"rows":[[null,"2020-09-06 7:06:23","2020-09-06 9:06:23",59.920870,10.774910,"onboard",null,null],[null,"2020-09-06 7:06:23","2020-09-06 9:06:23",59.913868,10.752245,"onboard",null,null]]}}'
    )

    store.dispatch(
      KeplerGl.addDataToMap({
        datasets: [dataset],
        options: { centerMap: true, readOnly: true },
        config: parsedConfig
      })
    )
    if (config == null) {
      const map1 = store.getState().keplerGl
      for (let i = 0; i < map1.map.visState.layers.length; i++) {
        if (map1.map.visState.layers[i].type !== 'arc') {
          map1.map.visState.layers[i].config.isVisible = true
        }
      }
      store.dispatch(map1)
    }
  }
}

export function initialiseIframe() {
  const _store = buildStore()

  if (window) {
    window.init = args => init(document.getElementById('app'), args, _store)
    window.update = data => update(data, _store)
  }
}

initialiseIframe()
