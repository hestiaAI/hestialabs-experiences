/**
 * Kepler.gl map configuration for displaying UberEats trips.
 *
 * This configuration defines:
 *
 * 1. Layers:
 *    - "trips-layer": Displays individual trip points with different colors for
 *      'accept' (green) and 'begin' (red) events. Uses the 'type' field to determine color.
 *    - "trip-lines-layer": Draws lines from the accept location to the begin location
 *      for each trip. The lines are semi-transparent with adjustable thickness.
 *
 * 2. Interaction:
 *    - Tooltip configuration shows relevant trip data when hovering over points or lines.
 *
 * 3. Map state:
 *    - Initial view centered on latitude 46.948, longitude 7.447 with zoom level 8.
 *
 * 4. Map style:
 *    - Dark theme.
 *
 * This config can be passed to the KeplerGl component or used in the iframe update
 * method to display trips on the map with the specified visual styling.
 */
export default {
  version: 'v1',
  config: {
    visState: {
      layers: [
        {
          id: 'trips',
          type: 'point',
          config: {
            dataId: 'trips',
            label: 'Trips',
            columns: { lat: 'latitude', lng: 'longitude' },
            isVisible: true,
            visConfig: {
              radius: 8,
              fixedRadius: true,
              opacity: 0.9,
              outline: false,
              filled: true,
              colorRange: {
                name: 'Accept/Begin Colors',
                type: 'custom',
                category: 'Custom',
                colors: ['#2ecc71', '#4742dd'] // green=accept, red=begin
              }
            }
          },
          visualChannels: {
            colorField: { name: 'type', type: 'string' },
            colorScale: 'ordinal',
            sizeField: null,
            sizeScale: 'linear'
          }
        },
        {
          id: 'trip-lines-layer',
          type: 'line',
          config: {
            dataId: 'trips',
            label: 'Trip Lines',
            columns: {
              lat0: 'fromLat',
              lng0: 'fromLng',
              lat1: 'toLat',
              lng1: 'toLng'
            },
            isVisible: true,
            visConfig: {
              colorRange: { colors: ['#4a4a4a'] },
              opacity: 0.8,
              thickness: 2
            }
          },
          visualChannels: {
            colorField: { name: 'type', type: 'string' },
            colorScale: 'ordinal'
          }
        },
        {
          id: 'trip-radius-layer',
          type: 'point',
          pickable: false,
          config: {
            dataId: 'trips',
            label: 'Trip Radius',
            columns: { lat: 'latitude', lng: 'longitude' },
            isVisible: true,
            enable3d: false,
            visConfig: {
              radius: 30,
              fixedRadius: true,
              radiusUnits: 'meters',
              opacity: 0.3,
              colorRange: { colors: ['#2d8ee3'] },
              stroke: false,
              filled: true,
              hoverHighlightColor: [0, 0, 0, 0]
            },
            enableHighlight: false,
            highlightColor: [0, 0, 0, 0]
          },
          visualChannels: {
            sizeField: { name: 'radius', type: 'integer' },
            sizeScale: 'linear',
            colorField: { name: 'type', type: 'string' },
            colorScale: 'ordinal'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            trips: [
              { name: 'latitude', format: null },
              { name: 'longitude', format: null },
              { name: 'type', format: null },
              { name: 'fromLat', format: null },
              { name: 'fromLng', format: null },
              { name: 'toLat', format: null },
              { name: 'toLng', format: null }
            ]
          }
        }
      }
    },
    mapState: { latitude: 46.948, longitude: 7.447, zoom: 8 },
    mapStyle: { styleType: 'dark' }
  }
}
