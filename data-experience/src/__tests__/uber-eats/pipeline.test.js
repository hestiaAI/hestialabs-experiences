import experience from '@hestia.ai/uber-eats'
import FileManager from '~/utils/file-manager'
import { arrayEqualNoOrder, getCustomPipelineFromBlock } from '~/utils/test-utils'
import { mockUberEatsFileManager } from './testSetup.js'

const { preprocessors, files, keepOnlyFiles } = experience.options
const fileManager = new FileManager(preprocessors, null, files, keepOnlyFiles)

mockUberEatsFileManager(fileManager) // sets up the beforeAll and mocks

describe('ubereats – combined_data_pipeline', () => {
  test('returns combined online, payments and trips data', async() => {
    const pipeline = getCustomPipelineFromBlock(
      experience,
      'combined_data_pipeline'
    )

    const result = await pipeline({ fileManager })

    expect(result.headers).toEqual(['online', 'payments', 'trips'])
    expect(result.items).toHaveLength(1)

    const item = result.items[0]

    // Online data
    expect(item.online.headers).toEqual(['begin', 'end', 'hours'])
    arrayEqualNoOrder(item.online.items, [
      { begin: '2023-10-14T08:00:00.000Z', end: '2023-10-14T12:30:00.000Z', hours: 4.5, state: 'online' }
    ])

    // Payments (raw csv)
    expect(item.payments.headers).toEqual(['cityName', 'amountLocal', 'currencyCode'])
    expect(item.payments.items).toHaveLength(2)

    // Trips (raw csv)
    expect(item.trips.headers).toEqual([
      'cityName',
      'courierAcceptTimestampLocal',
      'courierAcceptTimestampUtc',
      'courierAcceptToPickupDistanceMiles',
      'courierAcceptToPickupDurationSeconds',
      'courierAcceptTripLat',
      'courierAcceptTripLng',
      'courierAppVersion',
      'courierArrivalPickupTimestampLocal',
      'courierBegintripLat',
      'courierBegintripLng',
      'courierBegintripTimestampLocal',
      'courierBegintripToDropoffMiles',
      'courierBegintripToDropoffSeconds',
      'courierCommissionRate',
      'courierDevice',
      'courierArrivalDropoffTimestampLocal',
      'courierDropoffTimestampLocal',
      'deliveryStatus',
      'dropoffDeliveryDistanceKm',
      'restaurantRequestTimestampLocal',
      'licensePlate'
    ])
    expect(item.trips.items).toHaveLength(1)
  })
})

describe('ubereats – csv_courier_trips', () => {
  test('returns raw courier trip csv', async() => {
    const pipeline = getCustomPipelineFromBlock(
      experience,
      'csv_courier_trips'
    )

    const result = await pipeline({ fileManager })

    expect(result.headers).toEqual(['trips'])
    expect(result.items).toHaveLength(1)

    const trips = result.items[0].trips

    expect(trips.headers).toEqual([
      'cityName',
      'courierAcceptTimestampLocal',
      'courierAcceptTimestampUtc',
      'courierAcceptToPickupDistanceMiles',
      'courierAcceptToPickupDurationSeconds',
      'courierAcceptTripLat',
      'courierAcceptTripLng',
      'courierAppVersion',
      'courierArrivalPickupTimestampLocal',
      'courierBegintripLat',
      'courierBegintripLng',
      'courierBegintripTimestampLocal',
      'courierBegintripToDropoffMiles',
      'courierBegintripToDropoffSeconds',
      'courierCommissionRate',
      'courierDevice',
      'courierArrivalDropoffTimestampLocal',
      'courierDropoffTimestampLocal',
      'deliveryStatus',
      'dropoffDeliveryDistanceKm',
      'restaurantRequestTimestampLocal',
      'licensePlate'
    ])
    expect(trips.items).toHaveLength(1)
  })
})
