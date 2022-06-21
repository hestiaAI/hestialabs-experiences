<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          This shows the public tansportation that was used by at least k
          participants:
        </p>
      </VCol>
    </VRow>
    <template v-if="total > 0">
      <VRow>
        <VCol cols="12">
          <UnitFilterableTable
            v-bind="{
              headers: header_name_transport,
              items: get_name_transport
            }"
            @current-items="onTableFilter"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12">
          <p>
            This map shows the trips made in public transport by at least k
            participants:
          </p>
          <UnitIframe src="/kepler" :args="keplerArgs" />
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12">
          <UnitFilterableTable
            v-bind="{ headers: header_trips, items: get_trips }"
            @current-items="onTableFilter"
          />
        </VCol>
      </VRow>
    </template>
  </VContainer>
</template>
<script>
import _ from 'lodash'
import mixin from './mixin'
import keplerConfig from './kepler_config_trip.js'
export default {
  mixins: [mixin],
  data() {
    return {
      filteredRows: []
    }
  },
  computed: {
    results() {
      return this.values.map((v) => {
        return {
          ...v
        }
      })
    },
    total() {
      return this.values.length
    },
    get_name_transport() {
      const names = this.values.map((v) => {
        return {
          name_of_transport: v.transitPath.substr(
            0,
            v.transitPath.indexOf(':')
          ),
          k: v.k
        }
      })
      const res = this.filter_k_anonymity_names(names)
      return res
    },
    header_name_transport() {
      return Object.keys(this.get_name_transport[0])
    },
    get_trips() {
      const trips = this.values.map((v) => {
        return {
          ...v,
          start_end: v.transitPath.substr(v.transitPath.indexOf(':') + 1)
        }
      })
      const res = this.filter_k_anonymity_trips(trips)
      return res
    },
    header_trips() {
      return Object.keys(this.get_trips[0])
    },
    keplerData() {
      return {
        fields: this.header_trips.map((h) => {
          return {
            name: h
          }
        }),
        rows: this.get_trips.map(r => this.header_trips.map(h => r[h]))
      }
    },
    keplerArgs() {
      return {
        keplerData: this.keplerData,
        config: keplerConfig
      }
    }
  },
  methods: {
    avg(arr) {
      const sum = arr.reduce((a, b) => a + b, 0)
      return sum / arr.length || 0
    },
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index
    },
    drawViz() {},
    onTableFilter(newItems) {
      this.filteredRows = newItems
    },
    filter_k_anonymity_names(values) {
      const grouped = _.groupBy(values, n => n.name_of_transport)
      const keys = Object.keys(grouped)
      const table = []
      for (let i = 0; i < keys.length; i++) {
        const x = keys[i]
        const k_ = grouped[x].map(v => v.k)
        table.push({
          name_of_transport: x,
          k: k_
        })
      }
      let res = []
      for (let i = 0; i < table.length; i++) {
        const elem = table[i]
        let kMax = 0
        for (let j = 1; j <= Math.max.apply(Math, elem.k); j++) {
          const l = elem.k.filter(x => x <= j)
          if (l.length >= j) {
            kMax = j
          }
        }
        res.push({
          name_of_transport: elem.name_of_transport,
          k: kMax
        })
      }
      res = res.filter(x => x.k > 0)
      return res
    },
    filter_k_anonymity_trips(values) {
      const grouped = _.groupBy(values, n => n.start_end)
      const keys = Object.keys(grouped)
      const table = []
      for (let i = 0; i < keys.length; i++) {
        const x = keys[i]
        const slat = grouped[x].map(v => v.startLatitude)
        const slon = grouped[x].map(v => v.startLongitude)
        const elat = grouped[x].map(v => v.endLatitude)
        const elon = grouped[x].map(v => v.endLongitude)
        const k_ = grouped[x].map(v => v.k)
        table.push({
          startLatitude: slat,
          startLongitude: slon,
          endLatitude: elat,
          endLongitude: elon,
          start_end: x,
          k: k_
        })
      }
      let res = []
      for (let i = 0; i < table.length; i++) {
        const elem = table[i]
        let kMax = 0
        for (let j = 1; j <= Math.max.apply(Math, elem.k); j++) {
          const l = elem.k.filter(x => x <= j)
          if (l.length >= j) {
            kMax = j
          }
        }
        const slat = []
        const slon = []
        const elat = []
        const elon = []
        for (let j = 0; j < elem.k.length; j++) {
          if (elem.k[j] <= kMax) {
            slat.push(elem.startLatitude[j])
            slon.push(elem.startLongitude[j])
            elat.push(elem.endLatitude[j])
            elon.push(elem.endLongitude[j])
          }
        }
        res.push({
          startLatitude: this.avg(slat),
          startLongitude: this.avg(slon),
          endLatitude: this.avg(elat),
          endLongitude: this.avg(elon),
          start_end: elem.start_end,
          k: kMax
        })
      }
      res = res.filter(x => x.k > 0)
      return res
    }
  }
}
</script>
