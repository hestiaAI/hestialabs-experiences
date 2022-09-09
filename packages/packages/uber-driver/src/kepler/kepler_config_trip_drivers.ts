export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'v9ny5hj',
          type: 'point',
          config: {
            dataId: 't891ck4z',
            label: 'Begin Trip',
            color: [82, 151, 218],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'begintripLatitude',
              lng: 'begintripLongitude',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 11,
              fixedRadius: false,
              opacity: 0.8,
              outline: false,
              thickness: 2,
              strokeColor: null,
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
              strokeColorRange: {
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
              radiusRange: [0, 50],
              filled: true
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
            strokeColorField: null,
            strokeColorScale: 'quantile',
            sizeField: null,
            sizeScale: 'linear'
          }
        },
        {
          id: 'eh0kte4',
          type: 'point',
          config: {
            dataId: 't891ck4z',
            label: 'Dropoff Trip',
            color: [234, 68, 68],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'dropoffLatitude',
              lng: 'dropoffLongitude',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 11,
              fixedRadius: false,
              opacity: 0.8,
              outline: false,
              thickness: 2,
              strokeColor: null,
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
              strokeColorRange: {
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
              radiusRange: [0, 50],
              filled: true
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
            strokeColorField: null,
            strokeColorScale: 'quantile',
            sizeField: null,
            sizeScale: 'linear'
          }
        },
        {
          id: 'w7ia4nn',
          type: 'line',
          config: {
            dataId: 't891ck4z',
            label: 'Trips',
            color: [146, 38, 198],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat0: 'begintripLatitude',
              lng0: 'begintripLongitude',
              lat1: 'dropoffLatitude',
              lng1: 'dropoffLongitude',
              alt0: null,
              alt1: null
            },
            isVisible: true,
            visConfig: {
              opacity: 0.5,
              thickness: 0.8,
              colorRange: {
                name: 'ColorBrewer RdYlGn-6',
                type: 'diverging',
                category: 'ColorBrewer',
                colors: [
                  '#1a9850',
                  '#91cf60',
                  '#d9ef8b',
                  '#fee08b',
                  '#fc8d59',
                  '#d73027'
                ],
                reversed: true
              },
              sizeRange: [0, 10],
              targetColor: null,
              elevationScale: 100
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
            colorField: { name: 'fare', type: 'real' },
            colorScale: 'quantile',
            sizeField: null,
            sizeScale: 'linear'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            t891ck4z: [
              { name: 'requestTime', format: null },
              { name: 'begintripTime', format: null },
              { name: 'dropoffTime', format: null },
              { name: 'status', format: null },
              { name: 'fare', format: null },
              { name: 'currency', format: null }
            ]
          },
          compareMode: false,
          compareType: 'absolute',
          enabled: true
        },
        brush: { size: 0.5, enabled: false },
        geocoder: { enabled: false },
        coordinate: { enabled: false }
      },
      layerBlending: 'normal',
      splitMaps: [],
      animationConfig: { currentTime: null, speed: 1 }
    },
    mapState: {
      bearing: 0,
      dragRotate: false,
      latitude: 46.20995481116978,
      longitude: 6.0981121347609335,
      pitch: 0,
      zoom: 10.999249159748345,
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
