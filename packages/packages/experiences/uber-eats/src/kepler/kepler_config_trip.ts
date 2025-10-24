export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'g0vqe8g',
          type: 'point',
          config: {
            dataId: 'data',
            label: 'start',
            color: [218, 0, 0],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'startLatitude',
              lng: 'startLongitude',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 10,
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
          id: 'c64x49g',
          type: 'point',
          config: {
            dataId: 'data',
            label: 'end',
            color: [218, 0, 0],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'endLatitude',
              lng: 'endLongitude',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 10,
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
          id: 'xbdqwbb',
          type: 'line',
          config: {
            dataId: 'data',
            label: 'start -> end line',
            color: [30, 150, 190],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat0: 'startLatitude',
              lng0: 'startLongitude',
              alt0: null,
              lat1: 'endLatitude',
              lng1: 'endLongitude',
              alt1: null
            },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              thickness: 2,
              colorRange: {
                name: 'Custom Palette',
                type: 'custom',
                category: 'Custom',
                colors: [
                  '#a6cee3',
                  '#1f78b4',
                  '#b2df8a',
                  '#33a02c',
                  '#fb9a99',
                  '#e31a1c',
                  '#fdbf6f',
                  '#ff7f00',
                  '#cab2d6',
                  '#6a3d9a',
                  '#ffff99',
                  '#b15928',
                  '#49493f',
                  '#f800c0'
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
            colorField: {
              name: 'activityType',
              type: 'string'
            },
            colorScale: 'ordinal',
            sizeField: null,
            sizeScale: 'linear'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            data: [
              {
                name: 'startAddress',
                format: null
              },
              {
                name: 'startName',
                format: null
              },
              {
                name: 'startTimestamp',
                format: null
              },
              {
                name: 'endAddress',
                format: null
              },
              {
                name: 'endName',
                format: null
              },
              {
                name: 'endTimestamp',
                format: null
              },
              {
                name: 'confidence',
                format: null
              },
              {
                name: 'transitPath',
                format: null
              },
              {
                name: 'distanceMeters',
                format: null
              },
              {
                name: 'activityType',
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
      latitude: 45.723304634494724,
      longitude: 4.649325630519184,
      pitch: 0,
      zoom: 5.807773337936039,
      isSplit: false
    },
    mapStyle: {
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
          id: 'tqwsxjb',
          label: 'Mapbox Streets',
          url: 'mapbox://styles/mapbox/streets-v11'
        }
      }
    }
  }
}
