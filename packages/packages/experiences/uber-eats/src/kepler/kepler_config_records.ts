export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'r9fyctw',
          type: 'point',
          config: {
            dataId: 'data',
            label: 'Point',
            color: [18, 147, 154],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'latitude',
              lng: 'longitude',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 5,
              fixedRadius: false,
              opacity: 0.8,
              outline: false,
              thickness: 2,
              strokeColor: null,
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
            colorField: {
              name: 'activityType',
              type: 'string'
            },
            colorScale: 'ordinal',
            strokeColorField: null,
            strokeColorScale: 'quantile',
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
                name: 'timestamp',
                format: null
              },
              {
                name: 'accuracy',
                format: null
              },
              {
                name: 'source',
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
      latitude: 46.3694608867237,
      longitude: 6.506723131765135,
      pitch: 0,
      zoom: 7.78697017968798,
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
