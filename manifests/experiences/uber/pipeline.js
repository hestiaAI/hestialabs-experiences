import { genericDateViewer } from '~/manifests/generic-pipelines'

async function tripsData(fileManager) {
  return await fileManager.getCsvItems('Uber Data/Rider/trips_data.csv')
}

async function tripsRawData(fileManager) {
  return await fileManager.getText('Uber Data/Rider/trips_data.csv')
}

async function tripsGraphData(fileManager) {
  const tripsData = await fileManager.getCsvItems(
    'Uber Data/Rider/trips_data.csv'
  )
  const filteredValues = tripsData.items.reduce((acc, d) => {
    // filter non trips data
    if (
      (d['Product Type'] &&
        String(d['Product Type']).toLowerCase().includes('ubereats')) ||
      d['Trip or Order Status'] !== 'COMPLETED'
    )
      return acc
    // remove street numbers to aggregate
    acc.push({
      source: d['Begin Trip Address'].replace(/[0-9]/g, ''),
      target: d['Dropoff Address'].replace(/[0-9]/g, ''),
      value: 1
    })
    return acc
  }, [])
  return { headers: tripsData.headers, items: filteredValues }
}

async function tripsKeplerData(fileManager) {
  return { rawCsv: await tripsRawData(fileManager), config: keplerTripsConfig }
}

// On https://kepler.gl/demo you can export a map as json.
// The exported json has an attribute "config".
// The value of such a config attribute has been copy-pasted here:
const keplerTripsConfig = {
  version: 'v1',
  config: {
    visState: {
      filters: [
        {
          dataId: ['40eogm50r'],
          id: 'w6kkdu02c',
          name: ['Product Type'],
          type: 'multiSelect',
          value: [
            'POOL',
            'Green',
            'POOL: MATCHED',
            'Pool',
            'Pool: MATCHED',
            'UberX',
            'uberPOP',
            'uberX'
          ],
          enlarged: false,
          plotType: 'histogram',
          animationWindow: 'free',
          yAxis: null,
          speed: 1
        },
        {
          dataId: ['40eogm50r'],
          id: 'n55wj9spvu',
          name: ['Trip or Order Status'],
          type: 'multiSelect',
          value: ['COMPLETED'],
          enlarged: false,
          plotType: 'histogram',
          animationWindow: 'free',
          yAxis: null,
          speed: 1
        }
      ],
      layers: [
        {
          id: '4ey7dbg',
          type: 'heatmap',
          config: {
            dataId: '40eogm50r',
            label: 'begin trip',
            color: [82, 163, 83],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'Begin Trip Lat',
              lng: 'Begin Trip Lng'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.49,
              colorRange: {
                name: 'ColorBrewer YlGn-3',
                type: 'sequential',
                category: 'ColorBrewer',
                colors: ['#f7fcb9', '#addd8e', '#31a354']
              },
              radius: 20
            },
            hidden: false,
            textLabel: [
              {
                field: null,
                color: [255, 255, 255],
                size: 18,
                offset: [0, 0],
                anchor: 'start',
                alignment: 'center'
              }
            ]
          },
          visualChannels: {
            weightField: null,
            weightScale: 'linear'
          }
        },
        {
          id: '81tuguf',
          type: 'heatmap',
          config: {
            dataId: '40eogm50r',
            label: 'dropoff',
            color: [130, 154, 227],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'Dropoff Lat',
              lng: 'Dropoff Lng'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              colorRange: {
                name: 'ColorBrewer Greys-3',
                type: 'singlehue',
                category: 'ColorBrewer',
                colors: ['#f0f0f0', '#bdbdbd', '#636363']
              },
              radius: 20
            },
            hidden: false,
            textLabel: [
              {
                field: null,
                color: [255, 255, 255],
                size: 18,
                offset: [0, 0],
                anchor: 'start',
                alignment: 'center'
              }
            ]
          },
          visualChannels: {
            weightField: null,
            weightScale: 'linear'
          }
        },
        {
          id: 'dorf8mj',
          type: 'arc',
          config: {
            dataId: '40eogm50r',
            label: 'begin trip -> dropoff arc',
            color: [125, 201, 127],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat0: 'Begin Trip Lat',
              lng0: 'Begin Trip Lng',
              lat1: 'Dropoff Lat',
              lng1: 'Dropoff Lng'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              thickness: 1,
              colorRange: {
                name: 'Global Warming',
                type: 'sequential',
                category: 'Uber',
                colors: [
                  '#5A1846',
                  '#900C3F',
                  '#C70039',
                  '#E3611C',
                  '#F1920E',
                  '#FFC300'
                ]
              },
              sizeRange: [0, 10],
              targetColor: [237, 233, 250]
            },
            hidden: false,
            textLabel: [
              {
                field: null,
                color: [255, 255, 255],
                size: 18,
                offset: [0, 0],
                anchor: 'start',
                alignment: 'center'
              }
            ]
          },
          visualChannels: {
            colorField: null,
            colorScale: 'quantile',
            sizeField: null,
            sizeScale: 'linear'
          }
        },
        {
          id: 'k8xzs4f',
          type: 'line',
          config: {
            dataId: '40eogm50r',
            label: 'begin trip -> dropoff line',
            color: [235, 233, 228],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat0: 'Begin Trip Lat',
              lng0: 'Begin Trip Lng',
              lat1: 'Dropoff Lat',
              lng1: 'Dropoff Lng',
              alt0: null,
              alt1: null
            },
            isVisible: false,
            visConfig: {
              opacity: 0.8,
              thickness: 2,
              colorRange: {
                name: 'Global Warming',
                type: 'sequential',
                category: 'Uber',
                colors: [
                  '#5A1846',
                  '#900C3F',
                  '#C70039',
                  '#E3611C',
                  '#F1920E',
                  '#FFC300'
                ]
              },
              sizeRange: [0, 10],
              targetColor: null,
              elevationScale: 1
            },
            hidden: false,
            textLabel: [
              {
                field: null,
                color: [255, 255, 255],
                size: 18,
                offset: [0, 0],
                anchor: 'start',
                alignment: 'center'
              }
            ]
          },
          visualChannels: {
            colorField: null,
            colorScale: 'quantile',
            sizeField: null,
            sizeScale: 'linear'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            '40eogm50r': [
              {
                name: 'Product Type',
                format: null
              },
              {
                name: 'Request Time',
                format: null
              },
              {
                name: 'Begin Trip Time',
                format: null
              },
              {
                name: 'Begin Trip Address',
                format: null
              },
              {
                name: 'Dropoff Address',
                format: null
              }
            ]
          },
          compareMode: false,
          compareType: 'absolute',
          enabled: true
        },
        brush: {
          size: 5.1,
          enabled: false
        },
        geocoder: {
          enabled: false
        },
        coordinate: {
          enabled: false
        }
      },
      layerBlending: 'normal',
      splitMaps: [],
      animationConfig: {
        currentTime: null,
        speed: 1
      }
    },
    mapState: {
      bearing: 24,
      dragRotate: true,
      latitude: 46.53882497742701,
      longitude: 6.706902419371991,
      pitch: 50,
      zoom: 8.923280378006325,
      isSplit: false
    },
    mapStyle: {
      styleType: 'dark',
      topLayerGroups: {},
      visibleLayerGroups: {
        label: true,
        road: true,
        border: false,
        building: true,
        water: true,
        land: true,
        '3d building': false
      },
      threeDBuildingColor: [
        9.665468314072013, 17.18305478057247, 31.1442867897876
      ],
      mapStyles: {}
    }
  }
}

export default {
  tripsData,
  tripsRawData,
  tripsKeplerData,
  tripsGraphData,
  genericDateViewer
}
