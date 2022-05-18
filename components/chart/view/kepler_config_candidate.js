export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'di6sjwk',
          type: 'point',
          config: {
            dataId: 'data',
            label: 'winner',
            color: [210, 0, 0],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'winnerLatitude',
              lng: 'winnerLongitude',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 8,
              fixedRadius: false,
              opacity: 0.8,
              outline: true,
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
                name: 'Custom Palette',
                type: 'custom',
                category: 'Custom',
                colors: ['#12939A', '#6aca1f', '#dba71c']
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
            strokeColorField: {
              name: 'winnerSemanticType',
              type: 'string'
            },
            strokeColorScale: 'ordinal',
            sizeField: null,
            sizeScale: 'linear'
          }
        },
        {
          id: 'cc20vld',
          type: 'point',
          config: {
            dataId: 'data',
            label: 'loser',
            color: [254, 242, 26],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'loserLatitude',
              lng: 'loserLongitude',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 10,
              fixedRadius: false,
              opacity: 0.8,
              outline: true,
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
                name: 'Custom Palette',
                type: 'custom',
                category: 'Custom',
                colors: ['#12939A', '#72d228', '#d0a531']
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
            strokeColorField: {
              name: 'loserSemanticType',
              type: 'string'
            },
            strokeColorScale: 'ordinal',
            sizeField: null,
            sizeScale: 'linear'
          }
        },
        {
          id: '4am7zj',
          type: 'line',
          config: {
            dataId: 'data',
            label: 'winner -> loser line',
            color: [218, 0, 0],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat0: 'winnerLatitude',
              lng0: 'winnerLongitude',
              alt0: null,
              lat1: 'loserLatitude',
              lng1: 'loserLongitude',
              alt1: null
            },
            isVisible: true,
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
              sizeRange: [0.5, 10],
              targetColor: [254, 242, 26],
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
            sizeField: {
              name: 'loserConfidence',
              type: 'real'
            },
            sizeScale: 'linear'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            data: [
              {
                name: 'winnerAddress',
                format: null
              },
              {
                name: 'winnerName',
                format: null
              },
              {
                name: 'winnerConfidence',
                format: null
              },
              {
                name: 'winnerSemanticType',
                format: null
              },
              {
                name: 'loserAddress',
                format: null
              },
              {
                name: 'loserName',
                format: null
              },
              {
                name: 'loserConfidence',
                format: null
              },
              {
                name: 'loserSemanticType',
                format: null
              },
              {
                name: 'timestamp',
                format: null
              }
            ]
          },
          compareMode: false,
          compareType: 'absolute',
          enabled: true
        },
        brush: {
          size: 0.5,
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
      bearing: 0,
      dragRotate: false,
      latitude: 46.532766228529596,
      longitude: 6.629735388007509,
      pitch: 0,
      zoom: 12.205264650981901,
      isSplit: false
    },
    mapStyle: {
      styleType: 'light',
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
