<template>
  <VContainer>
    <VRow>
      <VCol cols="3">
        <div class="text-h5">Statistics</div>
        <VBtn text small class="ma-3">
          <VIcon>$vuetify.icons.mdiPlus</VIcon> Add Statistic
        </VBtn>
       </VCol>
       <VCol cols="9">
        <VCard flat outlined class="pa-2">
          <div class="d-flex justify-space-between">
            <span>
              From {{ timeFormat(dateExtent[0]) }} to {{ timeFormat(dateExtent[1]) }} the <strong>sum</strong> of <strong>distance</strong> is: <strong>2657</strong>
            </span>
            <VIcon>$vuetify.icons.mdiLock</VIcon>
          </div>
        </VCard>
       </VCol>
    </VRow>
    <VRow>
       <VCol cols="3">
        <span class="text-h5">Status</span>
       </VCol>
       <VCol cols="9">
        <VRadioGroup v-model="options.groupBy" row label="Choose a time period" dense hide-details class="mt-1">
          <VRadio
            v-for="agg in Object.keys(aggregations)"
            :key="agg"
            :label="`${agg}`"
            :value="agg"
          ></VRadio>
        </VRadioGroup>
       </VCol>
    </VRow>
    <VRow>
      <VCol cols="3">
        <VCheckbox
          v-for="(status, index) in statuses"
          :key="index"
          v-model="options.statuses[status]"
          :label="status"
          color="red"
          :value="true"
          hide-details
        ></VCheckbox>
        <VBtn text small class="ma-3">
          <VIcon>$vuetify.icons.mdiPlus</VIcon> Add Status
        </VBtn>
      </VCol>
      <VCol cols="9">
        <GantDiagram :currentExtent="currentExtent" :values="allValues" class="pa-3"></GantDiagram>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <AreaDatePicker v-model="currentExtent" :values="allValues" dateAccessor="begin_ts"></AreaDatePicker>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <UnitFilterableTable v-bind="{ headers: header, items: allValues }" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import mixin from './mixin'
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'
import * as d3 from 'd3'
import AreaDatePicker from './base/AreaDatePicker.vue'
import GantDiagram from './base/GantDiagram.vue'
// import { nest } from 'd3-collection'
// import { sumBy, mapValues } from 'lodash'
export default {
  components: { UnitFilterableTable, AreaDatePicker, GantDiagram },
  mixins: [mixin],
  props: {},
  data() {
    const timeParser = d3.timeParse('%s')
    const timeFormat = d3.timeFormat('%Y-%m-%d %H:%M:%S')
    const dateExtent = d3.extent(this.values, v => timeParser(v.begin_ts))
    return {
      timeParser,
      timeFormat,
      dateExtent,
      currentExtent: dateExtent,
      numberFormatter: d3.format('.2s'),
      aggregations: {
        Year: d3.timeFormat('%Y'),
        Month: d3.timeFormat('%Y/%m'),
        Week: d3.timeFormat('%Y week-%V'),
        Day: d3.timeFormat('%Y/%m/%d')
      },
      options: {
        statuses: {},
        groupBy: 'Year'
      }
    }
  },
  computed: {
    header() {
      if (this.allValues.length) {
        return Object.keys(this.allValues[0])
      } else {
        return []
      }
    },
    statuses() {
      return [...new Set(this.values.map(d => d.status))]
    },
    allValues() {
      const test = this.values.map((v) => {
        return {
          begin_ts: this.timeFormat(this.timeParser(v.begin_ts)),
          end_ts: this.timeFormat(this.timeParser(v.end_ts)),
          status: v.status
        }
      })
      return test
    }
  },
  methods: {
    drawViz() {}
  }
}
</script>
