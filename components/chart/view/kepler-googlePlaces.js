export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'r0pwmf4',
          type: 'point',
          config: {
            dataId: 'nv8yqrwls',
            label: 'Point',
            color: [248, 149, 112],
            highlightColor: [252, 242, 26, 255],
            columns: { lat: 'latitude', lng: 'longitude', altitude: null },
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
                size: 15,
                offset: [0, 0],
                anchor: 'start',
                alignment: 'center'
              }
            ]
          },
          visualChannels: {
            colorField: { name: 'visitConfidence', type: 'integer' },
            colorScale: 'quantile',
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
            nv8yqrwls: [
              { name: 'address', format: null },
              { name: 'name', format: null },
              { name: 'startTimestamp', format: null },
              { name: 'endTimestamp', format: null },
              { name: 'placeVisitType', format: null },
              { name: 'placeVisitImportance', format: null },
              { name: 'visitConfidence', format: null },
              { name: 'locationConfidence', format: null },
              { name: 'editConfirmationStatus', format: null }
            ]
          },
          compareMode: false,
          compareType: 'relative',
          enabled: true
        },
        brush: { size: 8.8, enabled: false },
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
      latitude: 49.060239891628996,
      longitude: 6.51254921120827,
      pitch: 0,
      zoom: 5.595283711785517,
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
