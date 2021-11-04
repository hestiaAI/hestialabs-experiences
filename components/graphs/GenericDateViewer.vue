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
