<template>
  <div class="layout">
    <div class="controls-bar">
      <button
        class="switch-btn filters-btn"
        :class="{ open: showFilters }"
        @click="showFilters = !showFilters"
      >
        Filters
        <span class="chevron">▾</span>
      </button>
    </div>

    <div v-if="showFilters" class="filters-panel">
      <!-- Time range -->
      <div class="filter-group">
        <div class="filter-title">Time range</div>
        <label>
          From
          <input type="date" v-model="filters.from" :min="minDate" :max="maxDate" />
        </label>

        <label>
          To
          <input type="date" v-model="filters.to" :min="minDate" :max="maxDate" />
        </label>
      </div>

      <!-- Status -->
      <div class="filter-group">
        <div class="filter-title">Delivery status</div>
        <label>
          <input type="checkbox" v-model="filters.status.completed" />
          Completed
        </label>

        <label>
          <input type="checkbox" v-model="filters.status.uncompleted" />
          Uncompleted
        </label>
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
        <!-- Map legend -->
        <div class="map-legend">
          <div class="legend-item">
            <span class="legend-dot green"></span>
            <span>Delivery accept point</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot blue"></span>
            <span>Delivery start point</span>
          </div>
          <div class="legend-item">
            <span class="legend-line"></span>
            <span>Path from accept to start point</span>
          </div>
          <div class="legend-item">
            <span class="legend-area"></span>
            <span>Delivery area</span>
          </div>
        </div>
        <div
          v-if="sortedTrips.length > maxMapTrips"
          class="map-warning"
        >
          Showing {{ maxMapTrips }} of {{ sortedTrips.length }} trips.
          Please narrow your filters.
        </div>
        <div class="map-container">
          <div ref="mapContainer" class="map-frame"></div>

          <div
            v-if="showMapEmptyState"
            class="map-empty-overlay"
          >
            Nothing to show.<br />
            Please adjust your filters.
          </div>
        </div>
      </div>

      <!-- RIGHT SIDE — Selected Trips -->
      <div class="selected-routes">
        <div class="title-row">
          <h3>Selected Trips</h3>
          <button
            class="clear-btn"
            @click="clearMapSelection"
          >
            Unselect
          </button>
        </div>

        <div class="trip-list">
          <div v-if="sortedTrips.length === 0" class="no-data">
            No trips available to show. Please adjust the filters.
          </div>
          <div
            v-else
            v-for="(trip, index) in limitedTripsForList"
            :key="index"
            class="trip-item"
            :class="{ selected: selectedTripsIds.has(trip._id) }"
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
                <span class="label">
                  Delivery distance
                  <span class="info-wrapper">
                    <span class="info-icon">i</span>
                    <span class="tooltip">
                      Distance from pickup location to customer.
                    </span>
                  </span>
                </span>
                <span class="value">{{ Number(trip.dropoffDeliveryDistanceKm).toFixed(3) }} km</span>
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

const MAX_MAP_TRIPS = 500

export default {
  name: 'MyTrips',
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
      showDeliveryArea: true,
      showFilters: false,
      filters: {
        from: null,
        to: null,
        status: {
          completed: true,
          uncompleted: false
        }
      },
      tripById: new Map(),
      circleCache: new Map()
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

    // Set of selected trip IDs
    selectedTripsIds() {
      return new Set(this.selectedTrips.map(t => t._id))
    },

    // Limit trips for list display
    limitedTripsForList() {
      return this.sortedTrips.slice(0, MAX_MAP_TRIPS)
    },

    // Maximum trips allowed on map
    maxMapTrips() {
      return MAX_MAP_TRIPS
    },

    // Whether to show empty state on map
    showMapEmptyState() {
      return this.limitedTripsForList.length === 0
    },

    // Map title based on filters
    mapTitle() {
      const { from, to } = this.filters
      const fmt = d => dayjs(d).format('DD.MM')
      const fmtWithYear = d => dayjs(d).format('DD.MM.YY')

      if (from && to) {
        return `Map of Trips from ${fmt(from)} to ${fmtWithYear(to)}`
      }

      if (from) {
        return `Map of Trips from ${fmtWithYear(from)}`
      }

      if (to) {
        return `Map of Trips until ${fmtWithYear(to)}`
      }

      return 'Map of Trips'
    },

    // Minimum selectable date
    minDate() {
      return periodStore.allTimeStart
        ? dayjs(periodStore.allTimeStart).format('YYYY-MM-DD')
        : null
    },

    // Maximum selectable date
    maxDate() {
      return periodStore.allTimeEnd
        ? dayjs(periodStore.allTimeEnd).format('YYYY-MM-DD')
        : null
    },

    // Whether any map filters are active
    hasActiveMapFilters() {
      const { from, to } = this.filters

      return (
        !!from ||
        !!to
      )
    },

    // Filtered trips based on user selections
    filteredTrips() {
      const { from, to, status } = this.filters

      if (!from && !to && !status.completed && !status.uncompleted) {
        return []
      }

      const fromTs = from
        ? dayjs(from).startOf('day').valueOf()
        : null

      const toTs = to
        ? dayjs(to).endOf('day').valueOf()
        : null

      return this.trips.filter((trip) => {
        // status filter
        if (trip._isCompleted && !status.completed) return false
        if (!trip._isCompleted && !status.uncompleted) return false

        // time filter
        if (fromTs && trip._acceptTs < fromTs) return false
        if (toTs && trip._acceptTs > toTs) return false

        return true
      })
    },

    // Trips sorted by accept timestamp desc
    sortedTrips() {
      return [...this.filteredTrips]
        .sort((a, b) => b._acceptTs - a._acceptTs)
    },

    // Limit trips for map rendering
    limitedTripsForMap() {
      const trips = this.selectedTrips.length
        ? this.selectedTrips
        : this.sortedTrips

      return trips.slice(0, MAX_MAP_TRIPS)
    },

    // GeoJSON for all routes
    routesGeoJson() {
      const trips = this.limitedTripsForMap

      const features = []

      // Create LineString and Point features for each trip
      trips.forEach((trip) => {
        const id = trip._id

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
      if (!this.showDeliveryArea) {
        return { type: 'FeatureCollection', features: [] }
      }

      const trips = this.limitedTripsForMap

      return {
        type: 'FeatureCollection',
        features: trips.map(trip => this.getTripCircle(trip))
      }
    }
  },
  watch: {
    // React to trip selection changes
    sortedTrips: {
      handler() {
        this.tripById.clear()
        this.sortedTrips.forEach((t) => {
          this.tripById.set(t._id, t)
        })
      },
      immediate: true
    },

    // React to filter changes
    filters: {
      deep: true,
      handler() {
        this.selectedTrips = []

        this.$nextTick(() => {
          this.updateMapData()
          this.zoomToVisibleTrips()
        })
      }
    },

    trips: {
      immediate: true,
      handler(trips) {
        trips.forEach((trip) => {
          // unique id (used everywhere)
          if (!trip._id) {
            trip._id = `${trip.courierAcceptTimestampLocal}_${trip.courierBegintripTimestampLocal}_${trip.courierBegintripToDropoffMiles}`
          }

          if (!trip._acceptTs) {
            trip._acceptTs = Date.parse(trip.courierAcceptTimestampLocal)
          }

          // status flag
          if (trip._isCompleted === undefined) {
            trip._isCompleted = trip.deliveryStatus?.toLowerCase() === 'completed'
          }
        })
      }
    },

    // React to selected trips changes
    selectedTrips: {
      handler() {
        // Re-render the map data so the map shows only selected trips
        this.updateMapData()
      },
      deep: true
    },

    // Show/hide delivery area
    showDeliveryArea(val) {
      if (!this.map) return

      if (this.map.getSource('endRadius')) {
        // refresh data
        this.map.getSource('endRadius').setData(this.endRadiusGeoJson)
      }

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
      bounds: [
        [5.9559, 45.8179],
        [10.4920, 47.8084]
      ],
      fitBoundsOptions: {
        padding: 40
      }
    })

    this.filters.from = periodStore.periodStart
      ? dayjs(periodStore.periodStart).format('YYYY-MM-DD')
      : null

    this.filters.to = periodStore.periodEnd
      ? dayjs(periodStore.periodEnd).format('YYYY-MM-DD')
      : null

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
     * Get or create cached delivery area circle for a trip
     * @param trip
     */
    getTripCircle(trip) {
      let circle = this.circleCache.get(trip._id)

      if (!circle) {
        circle = turf.circle(
          [+trip.courierBegintripLng, +trip.courierBegintripLat],
          Number(trip.dropoffDeliveryDistanceKm) * 1000,
          { units: 'meters', steps: 32 }
        )

        this.circleCache.set(trip._id, circle)
      }

      return circle
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
      if (
        !this.map ||
        typeof this.map.getSource !== 'function'
      ) {
        return
      }

      const routes = this.map.getSource('routes')
      if (routes) {
        routes.setData(this.routesGeoJson)
      }

      const endRadius = this.map.getSource('endRadius')
      if (endRadius) {
        endRadius.setData(this.endRadiusGeoJson)
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
        const trip = this.tripById.get(id)
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
          { source: 'routes', id: f.id },
          { selected: false }
        )
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
     * Select or unselect a trip
     * @param trip
     */
    selectTrip(trip) {
      if (!trip || !trip._id) {
        console.warn('selectTrip called without trip', trip)
        return
      }

      const id = trip._id

      const index = this.selectedTrips.findIndex(
        t => t._id === id
      )

      const selected = index < 0

      if (!selected) {
        this.selectedTrips.splice(index, 1)
      } else {
        this.selectedTrips.push(trip)
      }

      if (this.map?.getSource('routes')) {
        this.map.setFeatureState(
          { source: 'routes', id },
          { selected }
        )
      }
    }
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  width: 98%;
  margin: 16px 0px 0px 12px;
  position: relative;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.filters-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filters-btn .chevron {
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

/* Rotate chevron when open */
.filters-btn.open .chevron {
  transform: rotate(180deg);
}

.filters-panel {
  margin: 0 0 16px 0;
  padding: 12px 16px;
  border: 1px solid #bbbbbb99;
  background: #fff;
  box-shadow:
    0 3px 1px -2px rgba(0,0,0,.2),
    0 2px 2px 0 rgba(0,0,0,.19),
    0 1px 5px 0 rgba(0,0,0,.17);
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;
  margin-right: 24px;
}

.filter-group:first-child label {
  justify-content: space-between;
}

.filter-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #444;
  cursor: pointer;
}

/* Date inputs */
.filter-group input[type="date"] {
  margin-left: 6px;
  padding: 3px 6px;
  border: 1px solid #bbb;
  font-size: 0.8rem;
}

/* Checkbox alignment */
.filter-group input[type="checkbox"] {
  cursor: pointer;
}

.switch-btn {
  padding: 4px 12px;
  border: 1px solid #bbb;
  border-radius: 0;
  background: #fff;
  color: #333;
  cursor: pointer;
  font-size: 0.85rem;
}

.switch-btn.active {
  background: #e6e6e6;
  font-weight: 600;
  box-shadow: inset 0 1px 2px rgba(0,0,0,.15);
}

.switch-btn:hover {
  background: #f2f2f2;
  box-shadow:
    0 3px 1px -2px rgba(0,0,0,.25),
    0 2px 4px 0 rgba(0,0,0,.20),
    0 1px 8px 0 rgba(0,0,0,.18);
  transform: translateY(-1px);
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

.map-container {
  position: relative;
  flex: 1;
  min-height: 0;
}

/* Overlay */
.map-empty-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(240, 240, 240, 0.6);
  color: #555;
  font-size: 1rem;
  text-align: center;
  padding: 16px;
  z-index: 3;

  pointer-events: all;
}

.area-toggle {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.map-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  font-size: 0.8rem;
  color: #444;
  margin-bottom: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

/* Dots */
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot.green {
  background: #2ecc71;
}

.legend-dot.blue {
  background: #3498db;
}

/* Line */
.legend-line {
  width: 18px;
  height: 3px;
  background: #4a4a4a;
  opacity: 0.4;
  border-radius: 2px;
  display: inline-block;
}

/* Area */
.legend-area {
  width: 14px;
  height: 14px;
  background: rgba(52, 152, 219, 0.2);
  border: 1px solid rgba(52, 152, 219, 0.4);
  border-radius: 3px;
  display: inline-block;
}

.map-warning {
  font-size: 0.8rem;
  color: #b45309;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  padding: 6px 10px;
  margin-bottom: 6px;
}

.map-div {
  flex: 0 0 70%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),
            0 2px 2px 0 rgba(0,0,0,.19),
            0 1px 5px 0 rgba(0,0,0,.17);
  border: 1px solid #bbbbbb99;
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
  height: 100%;
}

.selected-routes {
  display: flex;
  flex-direction: column;
  flex: 0 0 28%;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),
              0 2px 2px 0 rgba(0,0,0,.19),
              0 1px 5px 0 rgba(0,0,0,.17);
  border: 1px solid #bbbbbb99;
  padding: 16px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.clear-btn {
  padding: 4px 6px;
  background: #f2f2f2;
  border: 1px solid #aaa;
  cursor: pointer;
  font-size: 0.8rem;

  box-shadow: 0 1px 2px rgba(0,0,0,.15);
  transition: background 0.15s ease, box-shadow 0.15s ease;
}

.clear-btn:hover {
  background: #d9d9d9;
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
  margin: 2px 0 10px 2px;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),
              0 2px 2px 0 rgba(0,0,0,.29),
              0 1px 5px 0 rgba(0,0,0,.27);
  cursor: pointer;
}

.trip-item.selected {
  background: #b2d5fd66;
  border: 2px solid #4a9eff;
}

.trip-item:hover {
  background: #f2f2f2;
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
  margin-left: 4px;
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
    width: 94%;
  }

  .controls-bar {
    flex-direction: column;
  }

  .filters-panel {
    flex-direction: column;
    gap: 16px;
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
