<template>
  <div class="layout">
    <div class="controls-bar">
      <div class="period-switch">
        <button
          v-for="p in ['week', 'month', 'uncompleted']"
          :key="p"
          :class="['switch-btn', { active: mode === p }]"
          @click="setPeriodMode(p)"
        >
          {{ p.toUpperCase() }}
        </button>
      </div>

      <div class="week-nav">
        <button class="nav-btn" @click="prevPeriod">←</button>
        <div class="week-label">
          {{ periodLabel }}
        </div>
        <button class="nav-btn" @click="nextPeriod">→</button>
      </div>
    </div>

    <div class="content-area">
      <!-- LEFT SIDE — Kepler Map -->
      <div class="map-div">
        <h3>{{ mapTitle }}</h3>
        <div ref="mapContainer" class="map-frame"></div>
      </div>

      <!-- RIGHT SIDE — Selected Trips -->
      <div class="selected-routes">
        <div class="title-row">
          <h3>Selected Routes</h3>
          <button
            class="clear-btn"
            @click="clearMapSelection"
          >
            Unselect
          </button>
        </div>

        <div class="trip-list">
          <div v-if="tripsFiltered.length === 0" class="no-data">
            No trips available for this period.
          </div>
          <div
            v-else
            v-for="(trip, index) in tripsFiltered"
            :key="index"
            class="trip-item"
            :class="{ selected: selectedTrips.includes(trip) }"
            @click="selectTrip(trip)"
          >
            <div class="trip-header">
              <strong>
                {{ trip.cityName || 'Unknown City' }} —
                {{ formatDate(trip.courierAcceptTimestampLocal) }}
              </strong>
            </div>

            <div class="trip-info">
              <div class="info-row">
                <span class="label">Start</span>
                <span class="value">{{ formatTime(trip.courierAcceptTimestampLocal) }}</span>
              </div>
              <div class="info-row">
                <span class="label">End</span>
                <span class="value">{{ formatTime(trip.courierDropoffTimestampLocal) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Distance</span>
                <span class="value">{{ trip.dropoffDeliveryDistanceKm }} km</span>
              </div>
              <div class="info-row">
                <span class="label">Status</span>
                <span class="value">{{ trip.deliveryStatus }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl from 'maplibre-gl'
import bbox from '@turf/bbox'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import keplerConfigPoints from './kepler_config_points.js'
import mixin from '@/components/chart/view/mixin'
import { periodStore } from './store/periodStore'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default {
  name: 'MyRoutes',
  mixins: [mixin],
  props: {
    data: {
      type: Object,
      required: false
    },
    mapboxToken: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      map: null,
      selectedTrips: []
    }
  },
  computed: {
    // Access the first value from the pipeline
    pipelineBlock() {
      return this.values?.[0] ?? {}
    },

    // Trips array
    trips() {
      return this.pipelineBlock.trips?.items ?? []
    },

    // Map title based on mode
    mapTitle() {
      return this.mode === 'week' || this.mode === 'month'
        ? 'Map of Routes Completed'
        : 'Map of Routes Uncompleted'
    },

    // Period label for display
    periodLabel() {
      if (periodStore.mode === 'uncompleted') return 'All time'
      if (periodStore.mode === 'month') return this.periodStart.format('MMMM YYYY')
      return `${this.periodStart.format('DD.MM.YYYY')} – ${this.periodEnd.format('DD.MM.YYYY')}`
    },

    // Current period mode
    mode: {
      get() { return periodStore.mode },
      set(v) { periodStore.mode = v }
    },

    // Period metadata
    periodStart() {
      return dayjs(periodStore.periodStart)
    },

    // Period metadata
    periodEnd() {
      return dayjs(periodStore.periodEnd)
    },

    // Filtered trips based on period and mode
    tripsFiltered() {
      let result

      if (this.mode === 'uncompleted') {
        // UNCOMPLETED → not completed
        result = this.trips.filter((t) => {
          return !t.deliveryStatus || t.deliveryStatus.toLowerCase() !== 'completed'
        })
      } else {
        // WEEK / MONTH → completed within period
        result = this.trips.filter((t) => {
          if (!t.deliveryStatus || t.deliveryStatus.toLowerCase() !== 'completed') {
            return false
          }

          const accept = dayjs(t.courierAcceptTimestampLocal)
          return accept.isSameOrAfter(this.periodStart) &&
                accept.isSameOrBefore(this.periodEnd)
        })
      }

      // Sort newest → oldest
      return result.sort((a, b) =>
        dayjs(b.courierAcceptTimestampLocal).valueOf() -
        dayjs(a.courierAcceptTimestampLocal).valueOf()
      )
    },

    routesGeoJson() {
      const trips = this.selectedTrips.length
        ? this.selectedTrips
        : this.tripsFiltered

      return {
        type: 'FeatureCollection',
        features: trips.map(trip => ({
          type: 'Feature',
          properties: {
            id: this.makeTripId(trip),
            type: 'trip'
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [
                Number(trip.courierAcceptTripLng),
                Number(trip.courierAcceptTripLat)
              ],
              [
                Number(trip.courierBegintripLng),
                Number(trip.courierBegintripLat)
              ]
            ]
          }
        }))
      }
    }
  },
  watch: {
    tripsFiltered() {
      this.updateMapData()
    },
    selectedTrips() {
      this.updateMapData()
    },

    // React to period changes
    periodStart() {
      this.onPeriodChanged()
    },

    // React to period changes
    periodEnd() {
      this.onPeriodChanged()
    },

    // React to mode changes
    mode() {
      this.onPeriodChanged()
    }
  },
  mounted() {
    // Continue tutorial if applicable
    if (window.__continueRoutesTour) {
      window.__continueRoutesTour()
      window.__continueRoutesTour = null
    }

    this.map = new maplibregl.Map({
      container: this.$refs.mapContainer,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [7.447, 46.948],
      zoom: 8
    })

    this.map.on('load', () => {
      this.addRoutesSource()
      this.addLayers()
      this.updateMapData()
      this.registerClickHandler()

      if (this.routesGeoJson.features.length > 0) {
        const bounds = bbox(this.routesGeoJson)
        this.map.fitBounds(bounds, {
          padding: 40,
          linear: true,
          duration: 1000
        })
      }
    })
  },
  methods: {
    addRoutesSource() {
      this.map.addSource('routes', {
        type: 'geojson',
        data: this.routesGeoJson
      })
    },

    addLayers() {
      // Lines
      this.map.addLayer({
        id: 'routes-line',
        type: 'line',
        source: 'routes',
        paint: {
          'line-color': '#4a4a4a',
          'line-width': 3,
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            1,
            0.4
          ]
        }
      })

      // Accept points
      this.map.addLayer({
        id: 'routes-points',
        type: 'circle',
        source: 'routes',
        paint: {
          'circle-radius': 6,
          'circle-color': '#2ecc71'
        }
      })
    },

    updateMapData() {
      if (!this.map?.getSource('routes')) return

      const data = this.routesGeoJson
      this.map.getSource('routes').setData(this.routesGeoJson)

      if (data.features.length > 0) {
        const bounds = bbox(data)
        this.map.fitBounds(bounds, {
          padding: 40,
          linear: true,
          duration: 1000
        })
      }
    },

    registerClickHandler() {
      this.map.on('click', 'routes-line', (e) => {
        const feature = e.features[0]
        const id = feature.properties.id

        // Clear previous
        this.clearMapSelection()

        this.map.setFeatureState(
          { source: 'routes', id },
          { selected: true }
        )

        const bounds = bbox(this.routesGeoJson)
        this.map.fitBounds(bounds, {
          padding: 40,
          linear: true,
          duration: 1000
        })
      })
    },

    clearMapSelection() {
      const features = this.map.querySourceFeatures('routes')
      features.forEach((f) => {
        this.map.setFeatureState(
          { source: 'routes', id: f.properties.id },
          { selected: false }
        )
      })
    },

    /**
     * Handle period changes
     */
    onPeriodChanged() {
      // Unselect everything
      this.selectedTrips = []

      // Force map redraw with full filtered dataset
      this.$nextTick(() => {
        this.keplerRef?.callIframeFunction('update', {
          keplerData: this.keplerData,
          config: keplerConfigPoints,
          mapboxToken: this.mapboxToken
        })
      })
    },

    /**
     * Set the period mode (week, month, total)
     * @param mode 'week' | 'month' | 'uncompleted'
     */
    setPeriodMode(mode) {
      this.clearSelection()
      periodStore.setMode(mode)
      if (mode === 'week') {
        const monday = dayjs(periodStore.periodStart).startOf('week').add(1, 'day')
        const sunday = monday.add(6, 'day').endOf('day')
        periodStore.setPeriod(monday.toISOString(), sunday.toISOString())
      } else if (mode === 'month') {
        const start = dayjs(periodStore.periodStart).startOf('month')
        const end = start.endOf('month')
        periodStore.setPeriod(start.toISOString(), end.toISOString())
      }
    },

    /**
     * Navigate to previous period
     */
    prevPeriod() {
      this.clearSelection()
      if (periodStore.mode === 'week') {
        const newStart = this.periodStart.subtract(7, 'day')
        const newEnd = newStart.add(6, 'day').endOf('day')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      } else if (periodStore.mode === 'month') {
        const newStart = this.periodStart.subtract(1, 'month').startOf('month')
        const newEnd = newStart.endOf('month')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      }
    },

    /**
     * Navigate to next period
     */
    nextPeriod() {
      this.clearSelection()
      if (periodStore.mode === 'week') {
        const newStart = this.periodStart.add(7, 'day')
        const newEnd = newStart.add(6, 'day').endOf('day')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      } else if (periodStore.mode === 'month') {
        const newStart = this.periodStart.add(1, 'month').startOf('month')
        const newEnd = newStart.endOf('month')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      }
    },

    /**
     * Format timestamp to HH:mm:ss
     * @param timestamp
     */
    formatTime(timestamp) {
      if (!timestamp) return '-'
      return dayjs(timestamp).format('HH:mm:ss')
    },

    /**
     * Format timestamp to DD.MM.YY
     * @param timestamp
     */
    formatDate(timestamp) {
      if (!timestamp) return '-'
      return dayjs(timestamp).format('DD.MM.YY')
    },

    /**
     * Create a unique ID for a trip
     * @param trip
     */
    makeTripId(trip) {
      return `${trip.courierAcceptTimestampLocal}_${trip.courierBegintripTimestampLocal}_${trip.courierBegintripToDropoffMiles}`
    },

    /**
     * Select or unselect a trip
     * @param trip
     */
    selectTrip(trip) {
      const id = this.makeTripId(trip)

      const index = this.selectedTrips.findIndex(
        t => this.makeTripId(t) === id
      )

      if (index >= 0) {
        this.selectedTrips.splice(index, 1)
      } else {
        this.selectedTrips.push(trip)
      }

      this.keplerRef?.callIframeFunction('update', {
        keplerData: this.keplerData,
        config: keplerConfigPoints
      })
    }
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 16px 0px 0px 16px;
  position: relative;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
}

.period-switch {
  display: flex;
  gap: 6px;
}

.switch-btn {
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #bbb;
  background: #e0e0e0;
  color: #333;
  cursor: pointer;
  font-size: 0.85rem;
}

.switch-btn.active {
  background: #bcbcbc;
  font-weight: 700;
}

.switch-btn:hover {
  background: #d2d2d2;
}

.period-switch .switch-btn:nth-child(3) {
  margin-left: 20px;
}

.week-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #bbb;
  background: white;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 1rem;
}

.nav-btn:hover {
  background: #f3f3f3;
}

.week-label {
  font-weight: 700;
  color: #333;
  font-size: 1rem;
}

.content-area {
  display: flex;
  flex: 1;
}

.map-div {
  flex: 0 0 70%;
  background-color: #e8e8e8;
  border: 2px solid #ccc;
  border-radius: 10px;
  margin-right: 16px;
  padding: 16px;
}

.map-div, .selected-routes {
  height: 600px;
}

.map-frame {
  width: 100%;
  height: 100%;
}

.selected-routes {
  flex: 1;
  background-color: #e8e8e8;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 16px;
  overflow-y: auto;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.clear-btn {
  padding: 4px 6px;
  border-radius: 6px;
  background: #cfcfcf;
  border: 1px solid #aaa;
  cursor: pointer;
  font-size: 0.8rem;
}

.clear-btn:hover {
  background: #bbbbbb;
}

.trip-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trip-item {
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  cursor: pointer;
}

.trip-item.selected {
  background: #d7ebff;
  border: 2px solid #4a9eff;
}

.trip-item:hover {
  background: #f7f7f7;
}

.trip-header {
  font-size: 1.1em;
  border-bottom: 1px solid #ddd;
  padding-bottom: 6px;
  margin-bottom: 6px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
}

.no-data {
  text-align: center;
  padding: 24px 0;
  font-size: 0.95rem;
  color: #666;
}

.map-unavailable {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 84%;
  font-size: 1rem;
  color: #555;
  background-color: #f0f0f0;
  border-radius: 8px;
  text-align: center;
  padding: 16px;
  margin-top: 4px;
}

/* Mobile layout */
@media (max-width: 768px) {
  .layout {
    margin: 8px;
  }

  .controls-bar {
    flex-direction: column;
  }

  .period-switch {
    justify-content: center;
    margin-bottom: 8px;
  }

  .week-nav {
    justify-content: center;
    margin-bottom: 12px;
  }

  .content-area {
    flex-direction: column;
  }

  .map-div {
    flex: none;
    width: 100%;
    margin-right: 0;
    margin-bottom: 12px;
  }

  .selected-routes {
    width: 100%;
    height: auto;
    max-height: 420px;
  }

  .nav-btn {
    padding: 8px 12px;
  }
}
</style>
