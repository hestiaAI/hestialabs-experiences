<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          We found <strong>{{ total }}</strong> mac adresses that were recorded
          in your file. <br />
          <br />
          This map shows where your phone detected them with the size
          corresponding to the number of times it was detected:
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
import mixin from './mixin'
import keplerConfig from './kepler_config_wifi.js'
export default {
  mixins: [mixin],
  data() {
    return {
      filteredRows: []
    }
  },
  computed: {
    results() {
      return this.values.map(v => {
        return {
          ...v,
          longitude: v.longitude * 1e-7,
          latitude: v.latitude * 1e-7,
          mac: this.convert_mac(v.mac)
        }
      })
    },
    total() {
      return this.results.length
    },
    max() {
      return Math.max(this.results.count)
    },
    filtered() {
      return this.filteredRows.length
    },
    keplerData() {
      return {
        fields: this.headers.map(h => {
          return {
            name: h
          }
        }),
        rows: this.filteredRows.map(r => this.headers.map(h => r[h]))
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
    convert_mac(address) {
      let s = String(address.toString(16))
      while (s.length < 12) {
        s = '0' + s
      }
      return this.chunk(s, 2).join(':')
    },
    chunk(str, n) {
      const ret = []
      let i
      let len

      for (i = 0, len = str.length; i < len; i += n) {
        ret.push(str.substr(i, n))
      }

      return ret
    },
    drawViz() {},
    onTableFilter(newItems) {
      this.filteredRows = newItems
    }
  }
}
</script>
