<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="9">
        <v-row>
          <v-col cols="12">
            <div id="volume-chart">
              <strong>Number of tracking over time</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
              </p>
            </div>

            <div id="range-chart">
              <p class="muted pull-right" style="margin-right: 15px">
                select a time range to zoom in
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <div id="category-chart">
              <strong>Purposes of tracking</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
              </p>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div id="app-chart">
              <strong>Applications that use trackers</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
              </p>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="3">
        <div id="advertiser-chart">
          <strong>Companies behind tracking</strong>
          <a class="reset" style="display: none">reset</a>
          <p class="filters">
            <span>
              Current filter:
              <span class="filter"></span>
            </span>
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <div id="dc-data-count" class="dc-data-count">
        <span class="filter-count"></span>
        selected out of
        <span class="total-count"></span>
        records |
        <a class="reset">Reset All</a>
      </div>
    </v-row>
    <unit-query-results v-bind="{ headers: header, items: results }" />
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
// import crossfilter from 'crossfilter2'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  name: 'Uber',
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      header: [
        { text: 'App', value: 'App' },
        { text: 'Uid', value: 'uid' },
        { text: 'More Info', value: 'url' },
        { text: 'Date', value: 'dateStr' },
        { text: 'Tracker', value: 'Tracker' },
        { text: 'daddr', value: 'daddr' },
        { text: 'Category', value: 'Category' }
      ],
      results: []
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    drawViz() {
      console.log(this.values)
      // Create and bind charts to their respective divs
      /*
      const volumeChart = new dc.LineChart('#volume-chart')
      const rangeChart = new dc.BarChart('#range-chart')
      const categoryChart = new dc.PieChart('#category-chart')
      const advertiserChart = new dc.RowChart('#advertiser-chart')
      const appChart = new dc.RowChart('#app-chart')
      const tableCount = new dc.DataCount('.dc-data-count')
      */
    }
  }
}
</script>
<style>
@import 'assets/styles/dc.css';

body {
  font-family: sans-serif;
  color: #22313f;
}

.dc-chart g.row text {
  fill: #22313f;
  font-weight: bold;
}

#range-chart g.y {
  display: none;
}

.reset {
  margin-left: 1rem;
}

.v-application a.reset {
  color: rgb(85, 3, 30);
}

p.filters {
  font-size: 0.8rem;
  font-style: italic;
}
</style>
