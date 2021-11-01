<template>
  <v-container>
    <v-row>
      <div id="map"></div>
      <div id="#cluster-map-anchor"></div>
      <div id="pie"></div>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import L from 'leaflet'
// import leafletMarkerCluster from 'leaflet.markercluster'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  name: 'GoogleMapOverview',
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
      this.results = this.values
      this.results.forEach(d => {
        d.lat = +d.lat
        d.lon = +d.lon
      })
      const clusterMap = L.map('map', {
        center: [42.69, 25.42],
        zoom: 7
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(clusterMap)

      const ndx = crossfilter(this.results)
      const groupname = 'marker-select'
      /*
      const facilities = ndx.dimension(d => [d.lat, d.lon])
      const facilitiesGroup = facilities.group().reduceCount()
      
      leafletMarkerCluster
        .markerChart('#cluster-map-anchor', groupname)
        .dimension(facilities)
        .group(facilitiesGroup)
        .map(clusterMap)
        .showMarkerTitle(false)
        .fitOnRender(true)
        .fitOnRedraw(true)
        .filterByArea(true)
        .cluster(true)
      */
      const types = ndx.dimension(function (d) {
        return d.type
      })
      const typesGroup = types.group().reduceCount()

      dc.pieChart('#pie', groupname)
        .dimension(types)
        .group(typesGroup)
        .width(200)
        .height(200)
        .renderLabel(true)
        .renderTitle(true)
        .ordering(function (p) {
          return -p.value
        })

      dc.renderAll(groupname)
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
