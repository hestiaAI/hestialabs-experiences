export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'yiawwh3',
          type: 'point',
          config: {
            dataId: 'data',
            label: 'Point',
            color: [187, 0, 0],
            highlightColor: [252, 242, 26, 255],
            columns: {
              lat: 'latitude',
              lng: 'longitude',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 10,
              fixedRadius: false,
              opacity: 0.8,
              outline: true,
              thickness: 1,
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
                name: 'Uber Viz Qualitative 1.2',
                type: 'qualitative',
                category: 'Uber',
                colors: [
                  '#12939A',
                  '#DDB27C',
                  '#88572C',
                  '#FF991F',
                  '#F15C17',
                  '#223F9A'
                ]
              },
              radiusRange: [10, 30],
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
              name: 'semanticType',
              type: 'string'
            },
            strokeColorScale: 'ordinal',
            sizeField: {
              name: 'duration',
              type: 'real'
            },
            sizeScale: 'sqrt'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            data: [
              {
                name: 'address',
                format: null
              },
              {
                name: 'name',
                format: null
              },
              {
                name: 'startTimestamp',
                format: null
              },
              {
                name: 'endTimestamp',
                format: null
              },
              {
                name: 'semanticType',
                format: null
              },
              {
                name: 'duration',
                format: null
              },
              {
                name: 'placeVisitImportance',
                format: null
              },
              {
                name: 'visitConfidence',
                format: null
              },
              {
                name: 'locationConfidence',
                format: null
              },
              {
                name: 'confidence',
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
      latitude: 46.38494014302197,
      longitude: 6.571780257805701,
      pitch: 0,
      zoom: 7.802552830838788,
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
          icon: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.3391,37.7922,9,0,0/400x300?access_token=pk.eyJ1IjoidWNmLW1hcGJveCIsImEiOiJja2tyMjNhcWIwc29sMnVzMThoZ3djNXhzIn0._hfBNwCD7pCU7RAMOq6vUQ&logo=false&attribution=false',
          id: 'tqwsxjb',
          label: 'Mapbox Streets',
          url: 'mapbox://styles/mapbox/streets-v11'
        }
      }
    }
  }
}
