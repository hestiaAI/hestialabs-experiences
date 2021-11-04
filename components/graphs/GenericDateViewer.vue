<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-tabs v-model="tab">
          <v-tab key="overview">Overview</v-tab>
          <v-tab key="details">Details</v-tab>
          <v-tab key="visualisation">Visualisation</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item key="overview"></v-tab-item>
          <v-tab-item key="details">
            <unit-filterable-table
              v-bind="{ headers: header, items: results }"
            />
          </v-tab-item>
          <v-tab-item key="visualisation"></v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-radio-group v-model="timeRange" row mandatory>
          <v-radio label="ALL" value="ALL"></v-radio>
          <v-radio label="1D" value="1D"></v-radio>
          <v-radio label="7D" value="7D"></v-radio>
          <v-radio label="1M" value="1M"></v-radio>
          <v-radio label="3M" value="3M"></v-radio>
          <v-radio label="1Y" value="1Y"></v-radio>
          <v-radio label="Custom" value="Custom"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import UnitFilterableTable from '~/components/UnitFilterableTable'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  name: 'GenericDateViewer',
  components: { UnitFilterableTable },
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dateRange: null,
      tab: null,
      header: [
        { text: 'Date', value: 'date' },
        { text: 'Event type', value: 'event_type' },
        { text: 'Event value', value: 'event_value' }
      ],
      results: [
        {
          date: '2019-08-06T18:20:45.829Z',
          event_type: 'Search',
          event_value: 'patate'
        },
        {
          date: '2019-08-06T18:20:45.829Z',
          event_type: 'View',
          event_value: 'link youtube'
        },
        {
          date: '2019-09-06T18:20:45.829Z',
          event_type: 'Search',
          event_value: 'patate'
        },
        {
          date: '2019-08-07T18:20:45.829Z',
          event_type: 'Search',
          event_value: 'patate2'
        }
      ]
    }
  },
  watch: {
    values(oldValues) {
      this.drawViz()
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    drawViz() {
      console.log(this.values)
    }
  }
}
</script>
<style></style>
