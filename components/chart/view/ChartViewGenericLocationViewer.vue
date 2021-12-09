<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p class="text-h6">Number of location records in your files</p>
        <p v-if="total === 0" class="text-subtitle-2">
          No location were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          We found <strong>{{ total }}</strong> locations in your file(s).
        </p>
      </VCol>
    </VRow>
    <VRow v-if="total > 0">
      <VCol cols="12">
        <UnitIframe src="/kepler" :data="myKeplerInput" />
      </VCol>
    </VRow>
    <VRow v-if="total > 0">
      <VCol cols="12">
        <UnitFilterableTable
          v-bind="{ data: { headers: header, items: results } }"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
<script>
import mixin from './mixin'
import keplerConfig from './kepler-config'
console.log(keplerConfig)
export default {
  mixins: [mixin],
  data() {
    return {
      total: 0,
      results: [],
      header: [
        { text: 'File', value: 'filename' },
        { text: 'Path', value: 'path' },
        { text: 'Latitude', value: 'latitude' },
        { text: 'Longitude', value: 'longitude' },
        { text: 'Description', value: 'description' }
      ],
      myKeplerInput: {
        keplerData: {
          fields: [
            { name: 'City' },
            { name: 'Product Type' },
            { name: 'Trip or Order Status' },
            { name: 'Request Time' },
            { name: 'Begin Trip Time' },
            { name: 'Begin Trip Lat' },
            { name: 'Begin Trip Lng' },
            { name: 'Begin Trip Address' },
            { name: 'Dropoff Time' },
            { name: 'Dropoff Lat' },
            { name: 'Dropoff Lng' },
            { name: 'Dropoff Address' },
            { name: 'Distance (miles)' },
            { name: 'Fare Amount' },
            { name: 'Fare Currency' }
          ],
          rows: [
            [
              666,
              'UberX',
              'COMPLETED',
              '2020-06-01 12:34:40 +0000 UTC',
              '2020-06-01 12:46:40 +0000 UTC',
              42.2342,
              3.14159,
              'Sesame Street, UK',
              '2020-06-01 13:12:40 +0000 UTC',
              23.42,
              2.71828,
              '23 Plouf Street, Smurfbridge H7 2FU, UK',
              6.66,
              23,
              'GBP'
            ],
            [
              666,
              'UberX',
              'COMPLETED',
              '2020-06-12 15:05:15 +0000 UTC',
              '2020-06-12 15:25:15 +0000 UTC',
              23.42,
              2.71828,
              '23 Plouf Street, Smurfbridge H7 2FU, UK',
              '2020-06-12 15:48:15 +0000 UTC',
              42.2342,
              3.14159,
              'Sesame Street, UK',
              12.66,
              42,
              'GBP'
            ],
            [
              666,
              'UberX',
              'COMPLETED',
              '2020-06-15 14:10:31 +0000 UTC',
              '2020-06-15 14:13:31 +0000 UTC',
              42.2342,
              3.14159,
              'Sesame Street, UK',
              '2020-06-15 14:57:31 +0000 UTC',
              23.42,
              2.71828,
              '23 Plouf Street, Smurfbridge H7 2FU, UK',
              6.66,
              23,
              'GBP'
            ],
            [
              666,
              'UberX',
              'COMPLETED',
              '2020-07-02 18:21:00 +0000 UTC',
              '2020-07-02 18:34:00 +0000 UTC',
              42.2342,
              3.14159,
              'Sesame Street, UK',
              '2020-07-02 18:47:00 +0000 UTC',
              23.42,
              2.71828,
              '23 Plouf Street, Smurfbridge H7 2FU, UK',
              6.66,
              23,
              'GBP'
            ],
            [
              666,
              'UberX',
              'COMPLETED',
              '2020-07-05 23:12:09 +0000 UTC',
              '2020-07-05 23:52:09 +0000 UTC',
              23.42,
              2.71828,
              '23 Plouf Street, Smurfbridge H7 2FU, UK',
              '2020-07-06 00:41:09 +0000 UTC',
              42.2342,
              3.14159,
              'Sesame Street, UK',
              8.66,
              30,
              'GBP'
            ],
            [
              451,
              'UberX',
              'COMPLETED',
              '2020-07-13 07:31:23 +0000 UTC',
              '2020-07-13 08:06:23 +0000 UTC',
              23.42,
              2.71828,
              '23 Plouf Street, Smurfbridge H7 2FU, UK',
              '2020-07-13 08:35:23 +0000 UTC',
              42.2342,
              3.14159,
              'Sesame Street, UK',
              6.66,
              23,
              'GBP'
            ],
            [
              42,
              'uberX',
              'COMPLETED',
              '2020-07-19 14:23:45 +0000 UTC',
              '2020-07-19 14:52:45 +0000 UTC',
              42.2342,
              3.14159,
              'Sesame Street, UK',
              '2020-07-19 15:28:45 +0000 UTC',
              23.42,
              2.71828,
              '23 Plouf Street, Smurfbridge H7 2FU, UK',
              6.66,
              23,
              'GBP'
            ],
            [
              42,
              'uberX',
              'COMPLETED',
              '2020-07-21 09:28:49 +0000 UTC',
              '2020-07-21 09:41:49 +0000 UTC',
              42.2342,
              3.14159,
              'Sesame Street, UK',
              '2020-07-21 10:07:49 +0000 UTC',
              23.42,
              2.71828,
              '23 Plouf Street, Smurfbridge H7 2FU, UK',
              6.66,
              23,
              'GBP'
            ],
            [
              42,
              'uberX',
              'COMPLETED',
              '2020-08-04 17:51:50 +0000 UTC',
              '2020-08-04 18:34:50 +0000 UTC',
              42.2342,
              3.14159,
              'Sesame Street, UK',
              '2020-08-04 18:53:50 +0000 UTC',
              23.42,
              2.71828,
              '23 Plouf Street, Smurfbridge H7 2FU, UK',
              6.66,
              23,
              'GBP'
            ]
          ]
        },
        config: keplerConfig
      }
    }
  },
  methods: {
    drawViz() {
      this.total = this.values.length
      this.results = this.values
      this.results.forEach(i => (i.description = JSON.stringify(i.description)))
    }
  }
}
</script>
