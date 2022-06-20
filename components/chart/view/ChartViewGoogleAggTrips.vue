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
import mixin from './mixin'
import { kAnonymityFilter } from '@/utils/kAnonymity'
export default {
  mixins: [mixin],
  props: {
    keplerConfig: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      filteredRows: []
    }
  },
  computed: {
    results() {
      return this.values
    },
    total() {
      return this.values.length
    },
    get_name_transport() {
      const names = this.values.map(v => {
        return {
          name_of_transport: v.transitPath.substr(
            0,
            v.transitPath.indexOf(':')
          ),
          k: v.k
        }
      })
      const res = kAnonymityFilter(names, ['name_of_transport'], [])
      return res
    },
    header_name_transport() {
      return Object.keys(this.get_name_transport[0])
    },
    get_trips() {
      const trips = this.values.map(v => {
        return {
          ...v,
          start_end: v.transitPath.substr(v.transitPath.indexOf(':') + 1)
        }
      })
      const res = kAnonymityFilter(
        trips,
        ['start_end'],
        ['startLatitude', 'startLongitude', 'endLatitude', 'endLongitude']
      )
      return res
    },
    header_trips() {
      return Object.keys(this.get_trips[0])
    },
    keplerData() {
      return {
        fields: this.header_trips.map(h => {
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
        config: this.keplerConfig
      }
    }
  },
  methods: {
    drawViz() {},
    onTableFilter(newItems) {
      this.filteredRows = newItems
    }
  }
}
</script>
