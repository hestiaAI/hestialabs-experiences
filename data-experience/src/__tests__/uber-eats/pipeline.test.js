import experience from '@hestia.ai/uber-eats'
import FileManager from '~/utils/file-manager'
import NodeFile from '~/utils/node-file'
import { arrayEqualNoOrder, getCustomPipelineFromBlock } from '~/utils/test-utils'

import {
  driverOnlineOfflineCsv,
  driverPaymentsCsv,
  courierTripsCsv,
  onlineExpectedItems
} from './samples.helpers'

const { preprocessors, files, keepOnlyFiles } = experience.options

const fileManager = new FileManager(
  preprocessors,
  null,
  files,
  keepOnlyFiles
)

// Files must match the IDs used in getCsvItemsFromId
const driverOnlineFile = new NodeFile(
  'test/Driver/online_offline.csv',
  driverOnlineOfflineCsv,
  { id: 'DriverOnlineOffline' }
)

const driverPaymentsFile = new NodeFile(
  'test/Driver/payments.csv',
  driverPaymentsCsv,
  { id: 'DriverPayments' }
)

const courierTripsFile = new NodeFile(
  'test/Courier/trips.csv',
  courierTripsCsv,
  { id: 'CourierLifetimeTripData' }
)

describe('ubereats – combined_data_pipeline', () => {
  beforeAll(async () => {
    await fileManager.init([
      driverOnlineFile,
      driverPaymentsFile,
      courierTripsFile
    ])
  })

  test('returns combined online, payments and trips data', async () => {
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
    arrayEqualNoOrder(item.online.items, onlineExpectedItems)

    // Payments (raw csv)
    expect(item.payments.headers).toEqual(['date', 'amount', 'currency'])
    expect(item.payments.items).toHaveLength(2)

    // Trips (raw csv)
    expect(item.trips.headers).toEqual([
      'city_name',
      'courier_accept_timestamp_local',
      'courier_accept_timestamp_utc',
      'courier_accept_to_pickup_distance_miles',
      'courier_accept_to_pickup_duration_seconds',
      'courier_accept_trip_lat',
      'courier_accept_trip_lng',
      'courier_app_version',
      'courier_arrival_pickup_timestamp_local',
      'courier_begintrip_lat',
      'courier_begintrip_lng',
      'courier_begintrip_timestamp_local',
      'courier_begintrip_to_dropoff_miles',
      'courier_begintrip_to_dropoff_seconds',
      'courier_commission_rate',
      'courier_device',
      'courier_arrival_dropoff_timestamp_local',
      'courier_dropoff_timestamp_local',
      'delivery_status',
      'dropoff_delivery_distance_km',
      'restaurant_request_timestamp_local',
      'license_plate'
    ])
    expect(item.trips.items).toHaveLength(2)
  })
})

describe('ubereats – csv_courier_trips', () => {
  beforeAll(async () => {
    await fileManager.init([courierTripsFile])
  })

  test('returns raw courier trip csv', async () => {
    const pipeline = getCustomPipelineFromBlock(
      experience,
      'csv_courier_trips'
    )

    const result = await pipeline({ fileManager })

    expect(result.headers).toEqual(['trips'])
    expect(result.items).toHaveLength(1)

    const trips = result.items[0].trips

    expect(item.trips.headers).toEqual([
      'city_name',
      'courier_accept_timestamp_local',
      'courier_accept_timestamp_utc',
      'courier_accept_to_pickup_distance_miles',
      'courier_accept_to_pickup_duration_seconds',
      'courier_accept_trip_lat',
      'courier_accept_trip_lng',
      'courier_app_version',
      'courier_arrival_pickup_timestamp_local',
      'courier_begintrip_lat',
      'courier_begintrip_lng',
      'courier_begintrip_timestamp_local',
      'courier_begintrip_to_dropoff_miles',
      'courier_begintrip_to_dropoff_seconds',
      'courier_commission_rate',
      'courier_device',
      'courier_arrival_dropoff_timestamp_local',
      'courier_dropoff_timestamp_local',
      'delivery_status',
      'dropoff_delivery_distance_km',
      'restaurant_request_timestamp_local',
      'license_plate'
    ])
    expect(trips.items).toHaveLength(2)
  })
})

