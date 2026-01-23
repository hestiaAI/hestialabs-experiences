<template>
  <div class="layout">
    <div class="controls-bar">
      <div class="period-switch">
        <button
          v-for="p in ['week', 'month', 'total']"
          :key="p"
          class="switch-btn"
          :class="{ active: mode === p }"
          @click="setPeriodMode(p)"
        >
          {{ p === 'total' ? 'Uncompleted' : p.toUpperCase() }}

          <span v-if="p === 'total'" class="info-wrapper">
            <span class="info-icon">i</span>
            <span class="tooltip">
              These are all the trips that have not been completed successfully
            </span>
          </span>
        </button>
      </div>

      <div class="week-nav">
        <button
          class="nav-btn"
          v-if="mode !== 'total'"
          @click="prevPeriod"
        >
          ←
        </button>
        <div class="week-label">{{ periodLabel }}</div>
        <button
          class="nav-btn"
          v-if="mode !== 'total'"
          @click="nextPeriod"
        >
          →
        </button>
      </div>
    </div>

    <div class="content-area">
      <!-- LEFT SIDE — MapLibre Map -->
      <div class="map-div">
        <div class="map-header">
          <h3>{{ mapTitle }}</h3>

          <label class="area-toggle">
            <input
              type="checkbox"
              v-model="showDeliveryArea"
            />
            Show delivery area
          </label>
        </div>
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
import * as turf from '@turf/turf'
import bbox from '@turf/bbox'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
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
    }
  },
  data() {
    return {
      map: null,
      selectedTrips: [],
      showDeliveryArea: true
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
      if (periodStore.mode === 'total') return 'All time'
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
      const startTs = this.periodStart.valueOf()
      const endTs = this.periodEnd.valueOf()

      const selectedSet = new Set(this.selectedTrips.map(t => this.makeTripId(t)))

      const result = this.trips.filter((t) => {
        const status = t.deliveryStatus?.toLowerCase()

        if (this.mode === 'total') {
          return status !== 'completed'
        }

        if (status !== 'completed') return false

        const ts = Date.parse(t.courierAcceptTimestampLocal)
        return ts >= startTs && ts <= endTs
      })

      // Single sort (newest first + selected on top)
      result.sort((a, b) => {
        const aSel = selectedSet.has(this.makeTripId(a))
        const bSel = selectedSet.has(this.makeTripId(b))
        if (aSel !== bSel) return aSel ? -1 : 1

        return (
          Date.parse(b.courierAcceptTimestampLocal) -
          Date.parse(a.courierAcceptTimestampLocal)
        )
      })

      return result
    },

    // GeoJSON for all routes
    routesGeoJson() {
      const trips = this.selectedTrips.length
        ? this.selectedTrips
        : this.tripsFiltered

      const features = []

      // Create LineString and Point features for each trip
      trips.forEach((trip) => {
        const id = this.makeTripId(trip)

        const startLng = +trip.courierAcceptTripLng
        const startLat = +trip.courierAcceptTripLat
        const endLng = +trip.courierBegintripLng
        const endLat = +trip.courierBegintripLat

        features.push({
          type: 'Feature',
          properties: { id, type: 'trip' },
          geometry: {
            type: 'LineString',
            coordinates: [[startLng, startLat], [endLng, endLat]]
          }
        })

        features.push({
          type: 'Feature',
          properties: { id: id + '_start', pointType: 'start' },
          geometry: {
            type: 'Point',
            coordinates: [startLng, startLat]
          }
        })

        features.push({
          type: 'Feature',
          properties: {
            id: id + '_end',
            pointType: 'end',
            radius: Number(trip.dropoffDeliveryDistanceKm) * 1000
          },
          geometry: {
            type: 'Point',
            coordinates: [endLng, endLat]
          }
        })
      })

      return { type: 'FeatureCollection', features }
    },

    // GeoJSON for delivery area circles
    endRadiusGeoJson() {
      const trips = this.selectedTrips.length
        ? this.selectedTrips
        : this.tripsFiltered

      return {
        type: 'FeatureCollection',
        features: trips.map(trip =>
          turf.circle(
            [+trip.courierBegintripLng, +trip.courierBegintripLat],
            Number(trip.dropoffDeliveryDistanceKm) * 1000,
            {
              units: 'meters',
              steps: 32, // ⬅ was 64, visually identical, 2× faster
              properties: { id: this.makeTripId(trip) + '_radius' }
            }
          )
        )
      }
    }
  },
  watch: {
    // React to trip selection changes
    tripsFiltered() {
      this.$nextTick(() => {
        this.updateMapData()
        this.zoomToVisibleTrips()
      })
    },

    // React to trip selection changes
    selectedTrips() {
      this.$nextTick(() => {
        this.updateMapData()
        this.zoomToVisibleTrips()
      })
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
    },

    // Show/hide delivery area
    showDeliveryArea(val) {
      if (!this.map) return

      const visibility = val ? 'visible' : 'none'

      if (this.map.getLayer('endRadius-fill')) {
        this.map.setLayoutProperty('endRadius-fill', 'visibility', visibility)
      }
    }
  },
  mounted() {
    // Continue tutorial if applicable
    if (window.__continueRoutesTour) {
      window.__continueRoutesTour()
      window.__continueRoutesTour = null
    }

    // Initialize MapLibre map
    this.map = new maplibregl.Map({
      container: this.$refs.mapContainer,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [7.447, 46.948],
      zoom: 8
    })

    // Add sources and layers when map is ready
    this.map.on('load', () => {
      this.addRoutesSource()
      this.addLayers()

      this.map.setLayoutProperty(
        'endRadius-fill',
        'visibility',
        this.showDeliveryArea ? 'visible' : 'none'
      )

      // Wait until Vue has computed the geojson
      this.$nextTick(() => {
        this.updateMapData()
        this.zoomToVisibleTrips()
      })

      this.registerHandler()
    })

    window.addEventListener('resize', this.resizeMap)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeMap)
  },
  methods: {
    /**
     * Handle map resize
     */
    resizeMap() {
      if (this.map) {
        this.map.resize()
      }
    },
    /**
     * Add GeoJSON sources to the map
     */
    addRoutesSource() {
      this.map.addSource('routes', {
        type: 'geojson',
        data: this.routesGeoJson,
        promoteId: 'id'
      })

      this.map.addSource('endRadius', {
        type: 'geojson',
        data: this.endRadiusGeoJson
      })
    },

    /**
     * Add map layers for routes and points
     */
    addLayers() {
      // Hitbox for lines (for easier interaction)
      this.map.addLayer({
        id: 'routes-line-hitbox',
        type: 'line',
        source: 'routes',
        paint: {
          'line-width': 22,
          'line-opacity': 0 // invisible
        },
        filter: ['==', ['geometry-type'], 'LineString']
      })

      // Lines
      this.map.addLayer({
        id: 'routes-line',
        type: 'line',
        source: 'routes',
        paint: {
          'line-width': 4,
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            '#ff8c00', // selected color
            ['boolean', ['feature-state', 'hover'], false],
            '#f1c40f', // hover color
            '#4a4a4a' // default line color
          ],
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            1,
            0.4
          ]
        },
        filter: ['==', ['geometry-type'], 'LineString']
      })

      // Start points (green)
      this.map.addLayer({
        id: 'routes-start-points',
        type: 'circle',
        source: 'routes',
        paint: {
          'circle-radius': 6,
          'circle-color': '#2ecc71',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff'
        },
        filter: ['==', ['get', 'pointType'], 'start']
      })

      // End points (blue)
      this.map.addLayer({
        id: 'routes-end-points',
        type: 'circle',
        source: 'routes',
        paint: {
          'circle-radius': 6,
          'circle-color': '#3498db',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff'
        },
        filter: ['==', ['get', 'pointType'], 'end']
      })

      // Delivery area circle around end point
      this.map.addLayer({
        id: 'endRadius-fill',
        type: 'fill',
        source: 'endRadius',
        paint: {
          'fill-color': 'rgba(52, 152, 219, 0.2)',
          'fill-outline-color': 'rgba(52, 152, 219, 0.4)'
        }
      })
    },

    /**
     * Update map data sources
     */
    updateMapData() {
      // Update routes
      if (this.map?.getSource('routes')) {
        this.map.getSource('routes').setData(this.routesGeoJson)
      }

      // Update delivery areas
      if (this.map?.getSource('endRadius')) {
        this.map.getSource('endRadius').setData(this.endRadiusGeoJson)
      }
    },

    /**
     * Zoom to show all routes
     */
    zoomToVisibleTrips() {
      if (!this.map) return

      const features = [
        ...this.routesGeoJson.features,
        ...this.endRadiusGeoJson.features
      ]

      if (!features.length) return

      this.map.resize()

      const bounds = bbox({
        type: 'FeatureCollection',
        features
      })

      this.map.fitBounds(bounds,
        {
          padding: 40,
          linear: true,
          duration: 800
        })
    },

    /**
     * Register map interaction handlers
     */
    registerHandler() {
      // Click on route line hitbox
      this.map.on('click', 'routes-line-hitbox', (e) => {
        const id = e.features[0].id
        const trip = this.tripsFiltered.find(t => this.makeTripId(t) === id)
        if (!trip) return

        this.selectTrip(trip)
      })

      let hoveredLineId = null

      // Hover on route line hitbox
      this.map.on('mousemove', 'routes-line-hitbox', (e) => {
        if (e.features.length === 0) return

        const id = e.features[0].id

        // Reset previous hover
        if (hoveredLineId !== null && hoveredLineId !== id) {
          this.map.setFeatureState(
            { source: 'routes', id: hoveredLineId },
            { hover: false }
          )
        }

        // Set new hover
        hoveredLineId = id
        this.map.setFeatureState(
          { source: 'routes', id },
          { hover: true }
        )
      })

      // Remove hover when leaving hitbox
      this.map.on('mouseleave', 'routes-line-hitbox', () => {
        if (hoveredLineId !== null) {
          this.map.setFeatureState(
            { source: 'routes', id: hoveredLineId },
            { hover: false }
          )
        }
        hoveredLineId = null
      })
    },

    /**
     * Clear all map selections
     */
    clearMapSelection() {
      this.selectedTrips = []

      // clear feature states
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
        this.updateMapData()
      })
    },

    /**
     * Set the period mode (week, month, total)
     * @param mode 'week' | 'month' | 'total'
     */
    setPeriodMode(mode) {
      this.selectedTrips = []
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

      this.$nextTick(() => {
        this.updateMapData()
      })
    },

    /**
     * Navigate to previous period
     */
    prevPeriod() {
      this.selectedTrips = []

      if (periodStore.mode === 'week') {
        const newStart = this.periodStart.subtract(7, 'day')
        const newEnd = newStart.add(6, 'day').endOf('day')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      } else if (periodStore.mode === 'month') {
        const newStart = this.periodStart.subtract(1, 'month').startOf('month')
        const newEnd = newStart.endOf('month')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      }

      this.$nextTick(() => {
        this.updateMapData()
      })
    },

    /**
     * Navigate to next period
     */
    nextPeriod() {
      this.selectedTrips = []

      if (periodStore.mode === 'week') {
        const newStart = this.periodStart.add(7, 'day')
        const newEnd = newStart.add(6, 'day').endOf('day')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      } else if (periodStore.mode === 'month') {
        const newStart = this.periodStart.add(1, 'month').startOf('month')
        const newEnd = newStart.endOf('month')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      }

      this.$nextTick(() => {
        this.updateMapData()
      })
    },

    /**
     * Format timestamp to HH:mm:ss
     * @param timestamp
     */
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const d = new Date(timestamp)
      return (
        String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0') + ':' +
        String(d.getSeconds()).padStart(2, '0')
      )
    },

    /**
     * Format timestamp to DD.MM.YY
     * @param timestamp
     */
    formatDate(timestamp) {
      if (!timestamp) return '-'
      const d = new Date(timestamp)
      return (
        String(d.getDate()).padStart(2, '0') + '.' +
        String(d.getMonth() + 1).padStart(2, '0') + '.' +
        String(d.getFullYear()).slice(-2)
      )
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
  height: 32px;
  justify-content: center;
}

.nav-btn {
  padding: 2px 10px;
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
  width: 240px;
  text-align: center;
}

.content-area {
  display: flex;
  flex: 1;
  justify-content: space-between;
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.area-toggle {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.map-div {
  flex: 0 0 70%;
  display: flex;
  flex-direction: column;
  background-color: #e8e8e8;
  border: 2px solid #ccc;
  border-radius: 10px;
  margin-right: 16px;
  padding: 16px;
  min-height: 0;
}

.map-div, .selected-routes {
  height: 600px;
}

.map-frame {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.selected-routes {
  display: flex;
  flex-direction: column;
  flex: 0 0 28%;
  background-color: #e8e8e8;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 16px;
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
  flex: 1;
  overflow-y: auto;
  gap: 12px;
  padding-right: 4px;
}

.trip-item {
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
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

/* Tooltip wrapper */
.info-wrapper {
  position: relative;
  display: inline-block;
  margin-left: 8px;
}

/* Info icon */
.info-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #666;
  color: white;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  display: inline-block;
  cursor: default;
}

/* Tooltip text */
.tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: 220px;
  background: #333;
  color: #fff;
  text-align: center;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.2;
  transition: opacity 0.2s ease;
  z-index: 10;
}

/* Show tooltip on hover */
.info-wrapper:hover .tooltip {
  visibility: visible;
  opacity: 1;
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
