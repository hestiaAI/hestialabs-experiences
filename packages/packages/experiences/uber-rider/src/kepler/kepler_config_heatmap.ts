export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'ncot21h',
          type: 'heatmap',
          config: {
            dataId: '6ivdxksmk',
            label: 'new layer',
            color: [136, 87, 44],
            highlightColor: [252, 242, 26, 255],
            columns: { lat: 'beginLat', lng: 'beginLng' },
            isVisible: true,
            visConfig: {
              opacity: 0.69,
              colorRange: {
                name: 'Global Warming',
                type: 'sequential',
                category: 'Uber',
                colors: [
                  '#FFC300',
                  '#F1920E',
                  '#E3611C',
                  '#C70039',
                  '#900C3F',
                  '#5A1846'
                ],
                reversed: true
              },
              radius: 5.2
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
          visualChannels: { weightField: null, weightScale: 'linear' }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            '6ivdxksmk': [
              { name: 'beginTimestampUtc', format: null },
              { name: 'endTimestampUtc', format: null }
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
      latitude: 48.862403289323815,
      longitude: 2.3130846304873494,
      pitch: 0,
      zoom: 10.77200518984696,
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
