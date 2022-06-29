export const testTripsData = `City,Product Type,Trip or Order Status,Request Time,Begin Trip Time,Begin Trip Lat,Begin Trip Lng,Begin Trip Address,Dropoff Time,Dropoff Lat,Dropoff Lng,Dropoff Address,Distance (miles),Fare Amount,Fare Currency
42,uberX,COMPLETED,2020-07-19 14:23:45 +0000 UTC,2020-07-19 14:52:45 +0000 UTC,42.2342,3.14159,"Sesame Street, UK",2020-07-19 15:28:45 +0000 UTC,23.42,2.71828,"23 Plouf Street, Smurfbridge H7 2FU, UK",6.66,23,GBP
42,uberX,COMPLETED,2020-07-21 09:28:49 +0000 UTC,2020-07-21 09:41:49 +0000 UTC,42.2342,3.14159,"Sesame Street, UK",2020-07-21 10:07:49 +0000 UTC,23.42,2.71828,"23 Plouf Street, Smurfbridge H7 2FU, UK",6.66,23,GBP
`

export const tripsHeaders = [
  'city',
  'productType',
  'tripOrOrderStatus',
  'requestTime',
  'beginTripTime',
  'beginTripLat',
  'beginTripLng',
  'beginTripAddress',
  'dropoffTime',
  'dropoffLat',
  'dropoffLng',
  'dropoffAddress',
  'distanceMiles',
  'fareAmount',
  'fareCurrency'
]

export const tripsItems = [
  {
    city: '42',
    productType: 'uberX',
    tripOrOrderStatus: 'COMPLETED',
    requestTime: '2020-07-19 14:23:45 +0000 UTC',
    beginTripTime: '2020-07-19 14:52:45 +0000 UTC',
    beginTripLat: '42.2342',
    beginTripLng: '3.14159',
    beginTripAddress: 'Sesame Street, UK',
    dropoffTime: '2020-07-19 15:28:45 +0000 UTC',
    dropoffLat: '23.42',
    dropoffLng: '2.71828',
    dropoffAddress: '23 Plouf Street, Smurfbridge H7 2FU, UK',
    distanceMiles: '6.66',
    fareAmount: '23',
    fareCurrency: 'GBP'
  },
  {
    city: '42',
    productType: 'uberX',
    tripOrOrderStatus: 'COMPLETED',
    requestTime: '2020-07-21 09:28:49 +0000 UTC',
    beginTripTime: '2020-07-21 09:41:49 +0000 UTC',
    beginTripLat: '42.2342',
    beginTripLng: '3.14159',
    beginTripAddress: 'Sesame Street, UK',
    dropoffTime: '2020-07-21 10:07:49 +0000 UTC',
    dropoffLat: '23.42',
    dropoffLng: '2.71828',
    dropoffAddress: '23 Plouf Street, Smurfbridge H7 2FU, UK',
    distanceMiles: '6.66',
    fareAmount: '23',
    fareCurrency: 'GBP'
  }
]
