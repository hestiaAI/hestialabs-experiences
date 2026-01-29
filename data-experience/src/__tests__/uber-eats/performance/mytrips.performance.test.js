import { mount } from '@vue/test-utils'
import MyTrips from '@/components/chart/view/uberEats/MyTrips.vue'
import { performance } from 'perf_hooks'

// Helper to generate mock trips
function generateMockTrips(count) {
  return Array.from({ length: count }, (_, i) => ({
    _id: `trip_${i}`,
    _acceptTs: Date.now() - Math.random() * 1000000000,
    _isCompleted: Math.random() > 0.5,
    courierAcceptTripLat: 48 + Math.random() * 10,
    courierAcceptTripLng: 2 + Math.random() * 10,
    courierBegintripLat: 48 + Math.random() * 10,
    courierBegintripLng: 2 + Math.random() * 10,
    dropoffDeliveryDistanceKm: Math.random() * 20,
    courierAcceptTimestampLocal: new Date().toISOString(),
    courierBegintripTimestampLocal: new Date().toISOString(),
    deliveryStatus: Math.random() > 0.5 ? 'Completed' : 'Uncompleted'
  }))
}

// Mock periodStore for min/max date
jest.mock('@/components/chart/view/uberEats/store/periodStore', () => ({
  periodStore: {
    allTimeStart: new Date('2020-01-01').toISOString(),
    allTimeEnd: new Date('2030-01-01').toISOString()
  }
}))

describe('MyTrips performance test', () => {
  const testCounts = [100, 1000, 10000, 100000]

  testCounts.forEach((count) => {
    it(`Performance test with ${count} trips`, () => {
      const trips = generateMockTrips(count)

      const wrapper = mount(MyTrips, {
        propsData: {
          data: {
            values: [
              {
                trips: { items: trips }
              }
            ]
          }
        },
        stubs: ['maplibregl-map'] // stub MapLibre
      })

      const vm = wrapper.vm

      // Measure GeoJSON building
      let t0 = performance.now()
      const routesGeoJson = vm.routesGeoJson
      const endRadiusGeoJson = vm.endRadiusGeoJson
      let t1 = performance.now()
      console.log(`[${count}] GeoJSON + delivery areas: ${(t1 - t0).toFixed(2)} ms`)

      // Measure filtering & sorting
      t0 = performance.now()
      const filtered = vm.filteredTrips
      const sorted = vm.sortedTrips
      t1 = performance.now()
      console.log(`[${count}] Filtering + sorting: ${(t1 - t0).toFixed(2)} ms`)

      // Optional: simulate selecting first 10 trips
      t0 = performance.now()
      filtered.slice(0, 10).forEach(trip => vm.selectTrip(trip))
      t1 = performance.now()
      console.log(`[${count}] Selecting 10 trips: ${(t1 - t0).toFixed(2)} ms`)
    })
  })
})