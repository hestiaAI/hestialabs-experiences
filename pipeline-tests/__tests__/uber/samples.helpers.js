export const testTripsData = `City,Product Type,Trip or Order Status,Request Time,Begin Trip Time,Begin Trip Lat,Begin Trip Lng,Begin Trip Address,Dropoff Time,Dropoff Lat,Dropoff Lng,Dropoff Address,Distance (miles),Fare Amount,Fare Currency
42,uberX,COMPLETED,2020-07-19 14:23:45 +0000 UTC,2020-07-19 14:52:45 +0000 UTC,42.2342,3.14159,"Sesame Street, UK",2020-07-19 15:28:45 +0000 UTC,23.42,2.71828,"23 Plouf Street, Smurfbridge H7 2FU, UK",6.66,23,GBP
42,uberX,COMPLETED,2020-07-21 09:28:49 +0000 UTC,2020-07-21 09:41:49 +0000 UTC,42.2342,3.14159,"Sesame Street, UK",2020-07-21 10:07:49 +0000 UTC,23.42,2.71828,"23 Plouf Street, Smurfbridge H7 2FU, UK",6.66,23,GBP
`

export const tripsHeaders = [
  'City',
  'Product Type',
  'Trip or Order Status',
  'Request Time',
  'Begin Trip Time',
  'Begin Trip Lat',
  'Begin Trip Lng',
  'Begin Trip Address',
  'Dropoff Time',
  'Dropoff Lat',
  'Dropoff Lng',
  'Dropoff Address',
  'Distance (miles)',
  'Fare Amount',
  'Fare Currency'
]

export const tripsItems = [
  {
    City: '42',
    'Product Type': 'uberX',
    'Trip or Order Status': 'COMPLETED',
    'Request Time': '2020-07-19 14:23:45 +0000 UTC',
    'Begin Trip Time': '2020-07-19 14:52:45 +0000 UTC',
    'Begin Trip Lat': '42.2342',
    'Begin Trip Lng': '3.14159',
    'Begin Trip Address': 'Sesame Street, UK',
    'Dropoff Time': '2020-07-19 15:28:45 +0000 UTC',
    'Dropoff Lat': '23.42',
    'Dropoff Lng': '2.71828',
    'Dropoff Address': '23 Plouf Street, Smurfbridge H7 2FU, UK',
    'Distance (miles)': '6.66',
    'Fare Amount': '23',
    'Fare Currency': 'GBP'
  },
  {
    City: '42',
    'Product Type': 'uberX',
    'Trip or Order Status': 'COMPLETED',
    'Request Time': '2020-07-21 09:28:49 +0000 UTC',
    'Begin Trip Time': '2020-07-21 09:41:49 +0000 UTC',
    'Begin Trip Lat': '42.2342',
    'Begin Trip Lng': '3.14159',
    'Begin Trip Address': 'Sesame Street, UK',
    'Dropoff Time': '2020-07-21 10:07:49 +0000 UTC',
    'Dropoff Lat': '23.42',
    'Dropoff Lng': '2.71828',
    'Dropoff Address': '23 Plouf Street, Smurfbridge H7 2FU, UK',
    'Distance (miles)': '6.66',
    'Fare Amount': '23',
    'Fare Currency': 'GBP'
  }
]
