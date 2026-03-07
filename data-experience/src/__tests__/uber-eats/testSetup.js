import NodeFile from '~/utils/node-file'

export function mockUberEatsFileManager(fileManager) {
  const driverOnlineFile = new NodeFile(
    'test/Driver/online_offline.csv',
    '' // CSV content not needed, we mock getCsvItemsFromId
  )

  const driverPaymentsFile = new NodeFile(
    'test/Driver/payments.csv',
    ''
  )

  const courierTripsFile = new NodeFile(
    'test/Courier/trips.csv',
    ''
  )

  beforeAll(() => {
    jest
      .spyOn(fileManager, 'getCsvItemsFromId')
      .mockImplementation(async(id) => {
        if (id === 'DriverOnlineOffline') {
          return [{
            headers: ['beginTimestampLocal', 'endTimestampLocal', 'durationMs', 'earnerState'],
            items: [{
              beginTimestampLocal: '2023-10-14T08:00:00.000Z',
              endTimestampLocal: '2023-10-14T12:30:00.000Z',
              durationMs: '16200000',
              earnerState: 'online'
            }]
          }]
        }

        if (id === 'DriverPayments') {
          return [{
            headers: ['cityName', 'amountLocal', 'currencyCode'],
            items: [{}, {}]
          }]
        }

        if (id === 'CourierLifetimeTripData') {
          return [{
            headers: [
              'cityName', 'courierAcceptTimestampLocal', 'courierAcceptTimestampUtc',
              'courierAcceptToPickupDistanceMiles', 'courierAcceptToPickupDurationSeconds',
              'courierAcceptTripLat', 'courierAcceptTripLng', 'courierAppVersion',
              'courierArrivalPickupTimestampLocal', 'courierBegintripLat', 'courierBegintripLng',
              'courierBegintripTimestampLocal', 'courierBegintripToDropoffMiles',
              'courierBegintripToDropoffSeconds', 'courierCommissionRate', 'courierDevice',
              'courierArrivalDropoffTimestampLocal', 'courierDropoffTimestampLocal', 'deliveryStatus',
              'dropoffDeliveryDistanceKm', 'restaurantRequestTimestampLocal', 'licensePlate'
            ],
            items: [
              {
                cityName: 'Basel',
                courierAcceptTimestampLocal: '2023-10-15T12:10:00.000Z',
                courierAcceptTimestampUtc: '2023-10-15T11:10:00.000Z',
                courierAcceptToPickupDistanceMiles: 0.45,
                courierAcceptToPickupDurationSeconds: 420,
                courierAcceptTripLat: 47.5596,
                courierAcceptTripLng: 7.5886,
                courierAppVersion: '5.120.20001',
                courierArrivalPickupTimestampLocal: '2023-10-15T12:18:00.000Z',
                courierBegintripLat: 47.5612,
                courierBegintripLng: 7.5921,
                courierBegintripTimestampLocal: '2023-10-15T12:20:00.000Z',
                courierBegintripToDropoffMiles: 0.62,
                courierBegintripToDropoffSeconds: 360,
                courierCommissionRate: 0,
                courierDevice: 'android',
                courierArrivalDropoffTimestampLocal: '2023-10-15T12:30:00.000Z',
                courierDropoffTimestampLocal: '2023-10-15T12:32:00.000Z',
                deliveryStatus: 'completed',
                dropoffDeliveryDistanceKm: 0.055,
                restaurantRequestTimestampLocal: '2023-10-15T12:09:30',
                licensePlate: 'EX-1234'
              }
            ]
          }]
        }

        return []
      })

    return { driverOnlineFile, driverPaymentsFile, courierTripsFile }
  })
}
