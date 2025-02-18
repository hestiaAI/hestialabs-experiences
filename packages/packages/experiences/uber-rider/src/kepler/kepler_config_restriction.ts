export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'ksnf8c',
          type: 'point',
          config: {
            dataId: '570fzs57h',
            label: 'msg',
            color: [183, 136, 94],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'msgLatitude',
              lng: 'msgLongitude',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 10.4,
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
                  '#377eb8',
                  '#e41a1c',
                  '#4daf4a',
                  '#984ea3',
                  '#ff7f00',
                  '#ffff33'
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
            colorField: { name: 'msgRule', type: 'string' },
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
            '570fzs57h': [
              { name: 'msgRule', format: null },
              { name: 'msgPenaltyboxdurationms', format: null },
              { name: 'Time', format: null }
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
      latitude: 48.81737986441635,
      longitude: 2.275128723949621,
      pitch: 0,
      zoom: 10.780011285868596,
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
