<template>
  <VContainer>
    <VRow>
      <VCol v-if="placeName === ''" cols="12">
        <VSelect
          v-model="placeSelected"
          :items="listOfNames"
          :label="messages['Place']"
        />
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <p class="text-subtitle-2">
          {{ messages['total-time-spent'] }} {{ placeSelected }}: {{ total_time }}. <br>
          <br>
          {{ messages['mean-time-spent'] }} {{ placeSelected }}: {{ mean_time }}. <br>
          <br>
          {{ messages['entropy'] }} {{ placeSelected }}: {{ computeEntropy() }}. <br>
          {{ messages['entropy-info'] }} {{ placeSelected }}.
        </p>
      </VCol>
    </VRow>
    <template v-if="getFilteredList().length !== 0">
      <VRow>
        <VCol cols="12">
          <p class="text-subtitle-2">
            {{ messages['other-candidates'] }} {{ placeSelected }}:
          </p>
          <UnitKepler :args="keplerArgs" />
        </VCol>
      </VRow>
    </template>
  </VContainer>
</template>

<script>
import { uniqBy, groupBy, orderBy } from 'lodash-es'
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
    return {
      listOfNames: this.getOrderedList(),
      placeSelected: this.getSelectedName()
    }
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
      const table = this.values.filter(x => x.winnerName === this.placeSelected)
      const uniq = uniqBy(table, x => x.loserName)

      const names = uniq.map((v) => {
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
        fields: headers.map((h) => {
          return {
            name: this.messages?.keplerFields[h] || h
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
    getSelectedName() {
      const list = this.getOrderedList()
      if (this.placeName !== '') {
        return this.placeName
      } else {
        return list[0]
      }
    },
    getOrderedList() {
      const grouped = groupBy(this.values, 'winnerName')
      let list = Object.keys(grouped).map((x) => { return { winnerName: x, count: grouped[x].length } })
      list = orderBy(list, 'count', 'desc').map(x => x.winnerName)
      return list
    },
    getFilteredList() {
      return this.values.filter(x => x.winnerName === this.placeSelected)
    },
    compute_duration(d1, d2) {
      const date1 = new Date(d1).getTime()
      const date2 = new Date(d2).getTime()
      const res = Math.floor(Math.abs(date1 - date2) / 1000)
      return res
    },
    get_durations() {
      const values = this.values.filter(x => x.winnerName === this.placeSelected)
      const table = values.map(x => [x.startTimestamp, x.endTimestamp])
      const uniq = uniqBy(table, x => x[0])
      const dur = uniq.map(v => this.compute_duration(v[0], v[1]))
      return dur
    },
    computeEntropy() {
      const list = this.getProbababilities()
      let res = 0
      for (let i = 0; i < list.length; i++) {
        let sum = 0
        for (let j = 0; j < list[i].length; j++) {
          sum += list[i][j] * Math.log2(list[i][j])
        }
        res += -sum
      }
      return (res / list.length).toPrecision(4)
    },
    getProbababilities() {
      const list = this.getFilteredList()
      const grouped = groupBy(list, x => x.startTimestamp)
      const keys = Object.keys(grouped)
      const res = []
      for (let i = 0; i < keys.length; i++) {
        const elem = grouped[keys[i]]
        const arr = [elem[0].winnerConfidence / 100]
        for (let j = 0; j < elem.length; j++) {
          arr.push(elem[j].loserConfidence / 100)
        }
        res.push(arr)
      }
      return res
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
    }
  }
}
</script>
