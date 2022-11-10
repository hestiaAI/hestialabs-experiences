export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'kwztgie',
          type: 'point',
          config: {
            dataId: 'mpwc0gxho',
            label: 'Previous Dropoff',
            color: [88, 121, 218],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'previousDropoffLatitude',
              lng: 'previousDropoffLongitude',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 13,
              fixedRadius: false,
              opacity: 1,
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
          id: '9ks6a0k',
          type: 'point',
          config: {
            dataId: 'mpwc0gxho',
            label: 'Next Begin Trip',
            color: [234, 68, 68],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'nextBegintripLatitude',
              lng: 'nextBegintripLongitude',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 13,
              fixedRadius: false,
              opacity: 1,
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
          id: 'gylcb69i',
          type: 'line',
          config: {
            dataId: 'mpwc0gxho',
            label: 'Previous Dropoff -> Next Begin Trip',
            color: [130, 154, 227],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat0: 'previousDropoffLatitude',
              lng0: 'previousDropoffLongitude',
              alt0: null,
              lat1: 'nextBegintripLatitude',
              lng1: 'nextBegintripLongitude',
              alt1: null
            },
            isVisible: true,
            visConfig: {
              opacity: 0.5,
              thickness: 2.5,
              colorRange: {
                name: 'Uber Viz Diverging 1.5',
                type: 'diverging',
                category: 'Uber',
                colors: [
                  '#C22E00',
                  '#DD7755',
                  '#F8C0AA',
                  '#BAE1E2',
                  '#5DBABF',
                  '#00939C'
                ],
                reversed: true
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
            colorField: { name: 'notaskMinutes', type: 'real' },
            colorScale: 'quantile',
            sizeField: null,
            sizeScale: 'linear'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            mpwc0gxho: [
              { name: 'previousDropoffTime', format: null },
              { name: 'nextBegintripTime', format: null },
              { name: 'notaskMinutes', format: null },
              { name: 'nopassengerMinutes', format: null },
              { name: 'nopassengerPythagoreanDistance', format: null }
            ]
          },
          compareMode: false,
          compareType: 'absolute',
          enabled: true
        },
        brush: { size: 14.9, enabled: false },
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
      latitude: 46.22097346892646,
      longitude: 6.173827464945636,
      pitch: 0,
      zoom: 10.71497195707132,
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
