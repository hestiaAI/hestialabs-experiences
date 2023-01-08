export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'gzlxnlb',
          type: 'cluster',
          config: {
            dataId: '57hfllte',
            label: 'Publication',
            color: [255, 203, 153],
            highlightColor: [252, 242, 26, 255],
            columns: { lat: 'latitude', lng: 'longitude' },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              clusterRadius: 40,
              colorRange: {
                name: 'ColorBrewer Set1-6',
                type: 'qualitative',
                category: 'ColorBrewer',
                colors: [
                  '#e41a1c',
                  '#377eb8',
                  '#4daf4a',
                  '#984ea3',
                  '#ff7f00',
                  '#ffff33'
                ]
              },
              radiusRange: [0, 50],
              colorAggregation: 'mode'
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
            colorField: { name: 'actionType', type: 'string' },
            colorScale: 'ordinal'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            '57hfllte': [
              { name: 'title', format: null },
              { name: '_date', format: null },
              { name: 'actionType', format: null }
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
      latitude: 46.48268876272195,
      longitude: 7.027939380011415,
      pitch: 0,
      zoom: 8.079269847392451,
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
