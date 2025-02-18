export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'fq212av',
          type: 'line',
          config: {
            dataId: '6ivdxksmk',
            label: 'Trips',
            color: [130, 154, 227],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat0: 'beginLat',
              lng0: 'beginLng',
              alt0: null,
              lat1: 'endLat',
              lng1: 'endLng',
              alt1: null
            },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              thickness: 2,
              colorRange: {
                name: 'ColorBrewer Dark2-6',
                type: 'qualitative',
                category: 'ColorBrewer',
                colors: [
                  '#1b9e77',
                  '#d95f02',
                  '#7570b3',
                  '#e7298a',
                  '#66a61e',
                  '#e6ab02'
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
            colorField: { name: 'earnerState', type: 'string' },
            colorScale: 'ordinal',
            sizeField: null,
            sizeScale: 'linear'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            '6ivdxksmk': [
              { name: 'earnerState', format: null },
              { name: 'cityId', format: null },
              { name: 'vehicleUuid', format: null },
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
      latitude: 48.7996107175326,
      longitude: 2.262185310256901,
      pitch: 0,
      zoom: 10.033387277760834,
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
