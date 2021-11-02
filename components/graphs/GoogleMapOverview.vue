<template>
  <v-container>
    <v-row>
      <l-map style="height: 300px" :zoom="zoom" :center="center">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker :lat-lng="markerLatLng"></l-marker>
      </l-map>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

// Fix missing marker issue
import { Icon } from 'leaflet'
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  name: 'GoogleMapOverview',
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
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
      results: [],
      zoom: 7,
      center: [-34.9205, -57.953646],
      markerLatLng: [-34.9205, -57.953646],
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: ''
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

      dc.renderAll()
    }
  }
}
</script>
<style>
@import 'assets/styles/dc.css';
@import 'leaflet/dist/leaflet.css';
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
