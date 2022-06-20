<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          This map shows the places that were visited by at least k
          participants:
        </p>
      </VCol>
    </VRow>
    <template v-if="total > 0">
      <VRow>
        <VCol cols="12">
          <UnitIframe src="/kepler" :args="keplerArgs" />
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12">
          <UnitFilterableTable
            v-bind="{ headers, items: results }"
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
import keplerConfig from './kepler_config_places.js'
export default {
  mixins: [mixin],
  data () {
    return {
      filteredRows: []
    }
  },
  computed: {
    results () {
      const res = this.filter_k_anonymity(this.values)
      return res
    },
    total () {
      return this.results.length
    },
    filtered () {
      return this.filteredRows.length
    },
    keplerData () {
      return {
        fields: this.headers.map((h) => {
          return {
            name: h
          }
        }),
        rows: this.filteredRows.map(r => this.headers.map(h => r[h]))
      }
    },
    keplerArgs () {
      return {
        keplerData: this.keplerData,
        config: keplerConfig
      }
    }
  },
  methods: {
    avg (arr) {
      const sum = arr.reduce((a, b) => a + b, 0)
      return sum / arr.length || 0
    },
    drawViz () {},
    onTableFilter (newItems) {
      this.filteredRows = newItems
    },
    filter_k_anonymity (values) {
      const grouped = _.groupBy(values, n => [n.name, n.address])
      const keys = Object.keys(grouped)
      const table = []
      for (let i = 0; i < keys.length; i++) {
        const x = keys[i]
        const lat = grouped[x].map(v => v.latitude)
        const lon = grouped[x].map(v => v.longitude)
        const k_ = grouped[x].map(v => v.k)
        table.push({
          latitude: lat,
          longitude: lon,
          address: x.substring(x.indexOf(',') + 1),
          name: x.substring(0, x.indexOf(',')),
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
        const lat = []
        const lon = []
        for (let j = 0; j < elem.k.length; j++) {
          if (elem.k[j] <= kMax) {
            lat.push(elem.latitude[j])
            lon.push(elem.longitude[j])
          }
        }
        res.push({
          latitude: this.avg(lat),
          longitude: this.avg(lon),
          address: elem.address,
          name: elem.name,
          k: kMax
        })
      }
      res = res.filter(x => x.k > 0)
      return res
    }
  }
}
</script>
