
/* ------------------------------------------------------------------ */
/* Courier lifetime trip data                                         */
/* ------------------------------------------------------------------ */

export const courierTripsCsv = `cityName,courierAcceptTimestampLocal,courierAcceptTimestampUtc,courierAcceptToPickupDistanceMiles,courierAcceptToPickupDurationSeconds,courierAcceptTripLat,courierAcceptTripLng,courierAppVersion,courierArrivalPickupTimestampLocal,courierBegintripLat,courierBegintripLng,courierBegintripTimestampLocal,courierBegintripToDropoffMiles,courierBegintripToDropoffSeconds,courierCommissionRate,courierDevice,courierArrivalDropoffTimestampLocal,courierDropoffTimestampLocal,deliveryStatus,dropoffDeliveryDistanceKm,restaurantRequestTimestampLocal,licensePlate
Basel,2023-10-15 12:10:00,2023-10-15 11:10:00,0.45,420,47.5596,7.5886,5.120.20001,2023-10-15 12:18:00,47.5612,7.5921,2023-10-15 12:20:00,0.62,360,0.0,android,2023-10-15 12:30:00,2023-10-15 12:32:00,completed,0.055,2023-10-15 12:09:30,EX-1234`

/* ------------------------------------------------------------------ */
/* Driver payments                                                    */
/* ------------------------------------------------------------------ */

export const driverPaymentsCsv = `cityName,amountLocal,currencyCode,classification,category,recognizeTimestampLocal
Basel,6.50,CHF,delivery.fare.base,driver_payment_fares,2023-10-15 12:10:05`

/* ------------------------------------------------------------------ */
/* Driver online / offline                                            */
/* ------------------------------------------------------------------ */

export const driverOnlineOfflineCsv = `earnerState,cityId,beginTimestampUtc,endTimestampUtc,durationMs,beginTimestampLocal,endTimestampLocal
offline,9999,2023-10-14T06:00:00.000Z,2023-10-14T10:30:00.000Z,16200000,2023-10-14T08:00:00.000Z,2023-10-14T12:30:00.000Z`

/* ------------------------------------------------------------------ */
/* Expected transformed values                                        */
/* ------------------------------------------------------------------ */

export const onlineExpectedItems = [
  {
    begin: '2023-10-14T08:00:00.000Z',
    end: '2023-10-14T12:30:00.000Z',
    hours: 16200000 / 1000 / 3600,
    state: 'offline'
  }
]
