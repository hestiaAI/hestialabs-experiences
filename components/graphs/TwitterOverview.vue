<template>
  <v-container>
    <v-row> YAAAY </v-row>
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
  name: 'TwitterOverview',
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
