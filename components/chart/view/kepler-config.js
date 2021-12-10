// On https://kepler.gl/demo you can export a map as json.
// The exported json has an attribute "config".
// The value of such a config attribute has been copy-pasted here:
export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: '76iirit',
          type: 'point',
          config: {
            dataId: 'f1171e9su',
            label: 'Point',
            color: [227, 26, 26],
            highlightColor: [252, 242, 26, 255],
            columns: { lat: 'latitude', lng: 'longitude', altitude: null },
            isVisible: true,
            visConfig: {
              radius: 7.1,
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
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            f1171e9su: [
              { name: 'filename', format: null },
              { name: 'path', format: null },
              { name: 'description', format: null }
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
      latitude: 46.49515248727138,
      longitude: 6.595938722071041,
      pitch: 0,
      zoom: 8.412676476920423,
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
