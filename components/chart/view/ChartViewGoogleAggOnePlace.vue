<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          Total time spend at the {{ placeName }} : {{ total_time }} <br />
          <br />
          Mean time spend at the {{ placeName }}: {{ mean_time }} <br />
          <br />
          This map shows the other candidates proposed by Google associated to
          the {{ placeName }}:
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
import _ from 'lodash'
import mixin from './mixin'
export default {
  mixins: [mixin],
  props: {
    keplerConfig: {
      type: Object,
      default: () => null
    },
    placeName: {
      type: String,
      default: () => ''
    }
  },
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
      const table = this.values.filter(x => x.winnerName === this.placeName)
      const uniq = _.uniqBy(table, x => x.loserName)
      const names = uniq.map(v => {
        return {
          name: v.loserName,
          latitude: v.loserLatitude,
          longitude: v.loserLongitude,
          confidence: v.loserConfidence
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
        config: this.keplerConfig
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
      const values = this.values.filter(x => x.winnerName === this.placeName)
      const table = values.map(x => [x.startTimestamp, x.endTimestamp])
      const uniq = _.uniqBy(table, x => x[0])
      const dur = uniq.map(v => this.compute_duration(v[0], v[1]))
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
