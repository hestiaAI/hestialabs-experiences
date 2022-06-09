<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          Total time spend at the TL building: {{ total_time }} <br />
          <br />
          Mean time spend at the TL building: {{ mean_time }} <br />
          <br />
          This map shows the other candidates proposed by Google associated to
          the TL building:
        </p>
      </VCol>
    </VRow>
    <template v-if="total > 0">
      <VRow>
        <VCol cols="12">
          <UnitIframe src="/kepler" :args="keplerArgs" />
        </VCol>
      </VRow>
    </template>
  </VContainer>
</template>
<script>
import mixin from './mixin'
import keplerConfig from './kepler_config_places.js'
export default {
  mixins: [mixin],
  data() {
    return {}
  },
  computed: {
    total() {
      return this.values.length
    },
    total_time() {
      const durations = this.get_durations()
      const sum = durations.reduce((a, b) => a + b, 0)
      return this.convertHMS(sum)
    },
    mean_time() {
      const durations = this.get_durations()
      const sum = durations.reduce((a, b) => a + b, 0)
      const avg = sum / durations.length || 0
      return this.convertHMS(avg)
    },
    associated_names() {
      const table = this.values.filter(
        x => x.startTimestamp === this.values[0].startTimestamp
      )
      const names = table.map(v => {
        return {
          name: v.loserName,
          latitude: v.loserLatitude,
          longitude: v.loserLongitude
        }
      })
      return names
    },
    keplerData() {
      const headers = Object.keys(this.associated_names[0])
      return {
        fields: headers.map(h => {
          return {
            name: h
          }
        }),
        rows: this.associated_names.map(r => headers.map(h => r[h]))
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
    compute_duration(d1, d2) {
      const date1 = new Date(d1).getTime()
      const date2 = new Date(d2).getTime()
      const res = Math.floor(Math.abs(date1 - date2) / 1000)
      return res
    },
    get_durations() {
      const table = this.values.filter(
        x => x.loserName === this.values[0].loserName
      )
      const dur = table.map(v =>
        this.compute_duration(v.startTimestamp, v.endTimestamp)
      )
      return dur
    },
    convertHMS(value) {
      const sec = Math.round(value)
      let hours = Math.floor(sec / 3600) // get hours
      let minutes = Math.floor((sec - hours * 3600) / 60) // get minutes
      let seconds = sec - hours * 3600 - minutes * 60 //  get seconds
      // add 0 if value < 10; Example: 2 => 02
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      return hours + 'h' + minutes + 'm' + seconds + 's' // Return is HH : MM : SS
    },
    drawViz() {}
  }
}
</script>
