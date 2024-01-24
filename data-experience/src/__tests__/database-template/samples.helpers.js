export const testTripsData = `City,Product Type,tripOrOrderStatus,requestTime,beginTripTime,beginTripLat,beginTripLng,beginTripAddress,dropoffTime,dropoffLat,dropoffLng,dropoffAddress,distanceMiles,fareAmount,fareCurrency
42,uberX,COMPLETED,2021-07-19 14:23:45 +0000 UTC,2021-07-19 14:52:45 +0000 UTC,42.2342,3.14159,"Sesame Street, UK",2021-07-19 15:28:45 +0000 UTC,23.42,2.71828,"23 Plouf Street, Smurfbridge H7 2FU, UK",6.66,23,GBP
42,uberX,COMPLETED,2021-07-21 09:28:49 +0000 UTC,2021-07-21 09:41:49 +0000 UTC,42.2342,3.14159,"Sesame Street, UK",2021-07-21 10:07:49 +0000 UTC,23.42,2.71828,"23 Plouf Street, Smurfbridge H7 2FU, UK",6.66,23,GBP
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
    requestTime: '2021-07-19 14:23:45 +0000 UTC',
    beginTripTime: '2021-07-19 14:52:45 +0000 UTC',
    beginTripLat: '42.2342',
    beginTripLng: '3.14159',
    beginTripAddress: 'Sesame Street, UK',
    dropoffTime: '2021-07-19 15:28:45 +0000 UTC',
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
    requestTime: '2021-07-21 09:28:49 +0000 UTC',
    beginTripTime: '2021-07-21 09:41:49 +0000 UTC',
    beginTripLat: '42.2342',
    beginTripLng: '3.14159',
    beginTripAddress: 'Sesame Street, UK',
    dropoffTime: '2021-07-21 10:07:49 +0000 UTC',
    dropoffLat: '23.42',
    dropoffLng: '2.71828',
    dropoffAddress: '23 Plouf Street, Smurfbridge H7 2FU, UK',
    distanceMiles: '6.66',
    fareAmount: '23',
    fareCurrency: 'GBP'
  }
]

export const courierTasks = `"Task creation time ","Task completion time","Is pickup task","Completed with vehicle type","Arrived at","Started at","Arrival time","Departed at"
"2021-04-24 16:19:34.025","2021-04-24 17:13:35.463",TRUE,"BICYCLE","2021-04-24 16:56:59.914","2021-04-24 16:55:03.975","2021-04-24 17:12:54",
"2021-05-07 15:07:02.476","2021-05-07 15:26:22.875",FALSE,"BICYCLE","2021-05-07 15:24:14.696","2021-05-07 15:19:55.534","2021-05-07 15:25:54",`

export const courierTasksHeaders = [
  'beginDate'
]

export const courierTasksItems = [
  {
    beginDate: '2021-04-24 16:19:34.025'
  },
  {
    beginDate: '2021-05-07 15:07:02.476'
  }
]

export const courierTasksAll = `"Task creation time ","Task completion time","Is pickup task","Completed with vehicle type","Arrived at","Started at","Arrival time","Departed at"
"2021-04-24 16:19:34.025","2021-04-24 17:13:35.463",TRUE,"BICYCLE","2021-04-24 16:56:59.914","2021-04-24 16:55:03.975","2021-04-24 17:12:54",
"2021-05-07 15:07:02.476","2021-05-07 15:26:22.875",FALSE,"BICYCLE","2021-05-07 15:24:14.696","2021-05-07 15:19:55.534","2021-05-07 15:25:54",
"2021-04-24 16:43:28.318","2021-04-24 17:22:08.96",TRUE,"BICYCLE","2021-04-24 17:20:23.608","2021-04-24 17:17:20.728","2021-04-24 17:21:20",
"2021-04-16 16:36:22.13","2021-04-16 16:48:58.293",TRUE,"BICYCLE","2021-04-16 16:41:59.532","2021-04-16 16:39:45.597","2021-04-16 16:49:34",
"2021-04-24 16:19:34.025","2021-04-24 17:17:17.544",FALSE,"BICYCLE","2021-04-24 17:15:29.318","2021-04-24 17:13:37.043","2021-04-24 17:16:45",
"2021-04-10 11:13:30.969","2021-04-10 11:22:33.466",TRUE,"BICYCLE","2021-04-10 11:19:15.922","2021-04-10 11:15:22.737","2021-04-10 11:22:55",
"2021-04-10 11:13:30.969","2021-04-10 11:33:06.738",FALSE,"BICYCLE","2021-04-10 11:30:46.502","2021-04-10 11:22:36.42","2021-04-10 11:33:41",
"2021-04-13 12:38:15.312",,TRUE,,,,"2021-04-13 12:58:48",
"2021-04-13 12:38:15.312",,FALSE,,,,"2021-04-13 13:19:42",`
