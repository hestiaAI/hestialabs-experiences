const keplerConfig = {
  version: 'v1',
  config: {
    visState: {
      layers: [
        {
          id: 'trips',
          type: 'point',
          config: {
            dataId: 'CourierLifetimeTripData',
            label: 'Delivery points',
            columns: {
              lat: 'courier_begintrip_lat',
              lng: 'courier_begintrip_lng'
            }
          }
        }
      ]
    }
  }
}
export default keplerConfig
