<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          We found <strong>{{ total }}</strong> trips that were recorded in your
          file. <br />
          <br />
          This map shows what trips Google think you did:
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
      return this.values.map(v => {
        return {
          ...v,
          startLongitude: v.startLongitude * 1e-7,
          startLatitude: v.startLatitude * 1e-7,
          endLongitude: v.endLongitude * 1e-7,
          endLatitude: v.endLatitude * 1e-7,
          startAddress: v.startAddress === 'undefined' ? null : v.startAddress,
          endAddress: v.endAddress === 'undefined' ? null : v.endAddress,
          startName: v.startName === 'undefined' ? null : v.startName,
          endName: v.endName === 'undefined' ? null : v.endName,
          transitPath: this.parseTransitPath(v.transitPath)
        }
      })
    },
    total() {
      return this.results.length
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
    parseTransitPath(transitPath) {
      if (transitPath !== 'undefined') {
        const dico = JSON.parse(transitPath)
        const name = dico.name
        return (
          name +
          ': ' +
          dico.transitStops[0].name +
          ' -> ' +
          dico.transitStops[dico.transitStops.length - 1].name
        )
      } else {
        return null
      }
    },
    drawViz() {},
    onTableFilter(newItems) {
      this.filteredRows = newItems
    }
  }
}
</script>
