<template>
  <div class="layout">
    <!-- LEFT SIDE — Kepler Map -->
    <div class="map-div">
      <h3>Map of Routes</h3>
      <UnitKepler
        ref="keplerRef"
        :height="780"
        :args="keplerArgs"
      />
    </div>

    <!-- RIGHT SIDE — Selected Trips -->
    <div class="selected-routes">
      <h3>Selected Routes</h3>

      <div class="trip-list">
        <div
          v-for="(trip, index) in tripsFiltered"
          :key="index"
          class="trip-item"
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
</template>

<script>
import UnitKepler from '@/components/unit/UnitKepler.vue'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import keplerConfigPoints from './kepler_config_points.js'
import mixin from '@/components/chart/view/mixin'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default {
  name: 'MyRoutes',
  components: { UnitKepler },
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
      keplerRef: null
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

    // Period metadata
    periodStart() {
      return this.pipelineBlock.props?.periodStart
    },
    periodEnd() {
      return this.pipelineBlock.props?.periodEnd
    },
    tripsFiltered() {
      const filtered = this.trips.filter((t) => {
        if (!t.deliveryStatus || t.deliveryStatus.toLowerCase() !== 'completed') return false
        const accept = dayjs(t.courierAcceptTimestampLocal)
        return accept.isSameOrAfter(this.periodStart) && accept.isSameOrBefore(this.periodEnd)
      })
      console.log('Filtered trips:', filtered)
      return filtered
    },
    keplerData() {
      return {
        info: { id: 'trips', label: 'Trips' },
        data: {
          fields: [
            { name: 'latitude', type: 'real' },
            { name: 'longitude', type: 'real' },
            { name: 'type', type: 'string' },
            { name: 'fromLat', type: 'real' },
            { name: 'fromLng', type: 'real' },
            { name: 'toLat', type: 'real' },
            { name: 'toLng', type: 'real' }
          ],
          rows: this.tripsFiltered.flatMap(t => [
            [
              Number(t.courierAcceptTripLat),
              Number(t.courierAcceptTripLng),
              'accept',
              Number(t.courierAcceptTripLat),
              Number(t.courierAcceptTripLng),
              Number(t.courierBegintripLat),
              Number(t.courierBegintripLng)
            ],
            [
              Number(t.courierBegintripLat),
              Number(t.courierBegintripLng),
              'begin',
              Number(t.courierAcceptTripLat),
              Number(t.courierAcceptTripLng),
              Number(t.courierBegintripLat),
              Number(t.courierBegintripLng)
            ]
          ])
        }
      }
    },
    keplerArgs() {
      return {
        keplerData: this.keplerData,
        config: keplerConfigPoints,
        mapboxToken: this.mapboxToken
      }
    }
  },
  watch: {
    keplerData: {
      handler(newData) {
        this.keplerRef?.callIframeFunction('update', {
          data: newData.data,
          info: newData.info,
          config: keplerConfigPoints
        })
      },
      deep: true
    }
  },
  methods: {
    formatTime(timestamp) {
      if (!timestamp) return '-'
      return dayjs(timestamp).format('HH:mm:ss')
    },
    formatDate(timestamp) {
      if (!timestamp) return '-'
      return dayjs(timestamp).format('DD.MM.YY')
    },
    selectTrip(trip) {
      const filtered = {
        info: { id: 'trips', label: 'Trips' },
        data: {
          fields: this.keplerData.data.fields,
          rows: [
            [
              Number(trip.courierAcceptTripLat),
              Number(trip.courierAcceptTripLng),
              'accept',
              Number(trip.courierAcceptTripLat),
              Number(trip.courierAcceptTripLng),
              Number(trip.courierBegintripLat),
              Number(trip.courierBegintripLng)
            ],
            [
              Number(trip.courierBegintripLat),
              Number(trip.courierBegintripLng),
              'begin',
              Number(trip.courierAcceptTripLat),
              Number(trip.courierAcceptTripLng),
              Number(trip.courierBegintripLat),
              Number(trip.courierBegintripLng)
            ]
          ]
        }
      }

      this.keplerRef?.callIframeFunction('update', filtered)
    }
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  width: 95%;
  height: 78vh;
  overflow: hidden;
  margin: 16px 0px 0px 16px;
}

.map-div {
  flex: 0 0 70%;
  background-color: #e8e8e8;
  border: 2px solid #ccc;
  border-radius: 10px;
  margin-right: 16px;
  padding: 16px;
}

.selected-routes {
  flex: 1;
  background-color: #e8e8e8;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 16px;
  overflow-y: auto;
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
</style>
