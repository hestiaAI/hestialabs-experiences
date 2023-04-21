<template>
  <div>
    <div :style="'max-width:1200px;margin: auto;'">
      <h3>Dashboard Example</h3>
      <Dashboard v-if="values" v-bind="{graphs, values}"/>
    </div>
  </div>
</template>
<script>
import Dashboard from './components/Dashboard.vue'
import * as d3 from 'd3'
export default {
  components: {
    Dashboard
  },
  data() {
    return {
      graphs: [
        {
          title: 'Number of requests',
          valueLabel: '',
          chart: 'TimelineChart',
          dateAccessor: 'time',
          dateFormat: '%Q',
          cols: 6,
        },
        {
          valueLabel: '',
          cols: '6',
          chart: 'WeekChart',
          dateAccessor: 'time',
          dateFormat: '%Q'
        },
        {
          valueLabel: '',
          cols: '6',
          chart: 'HourChart',
          dateAccessor: 'time',
          dateFormat: '%Q'
        },
        {
          title: 'App',
          valueLabel: '',
          cols: '6',
          chart: 'TopChart',
          valueAccessor: 'App'
        },
        {
          title: 'Category',
          valueLabel: '',
          cols: '6',
          chart: 'PieChart',
          valueAccessor: 'Category'
        },
        {
          title: 'Number of login',
          valueLabel: 'tets',
          cols: '6',
          chart: 'BarTimelineChart',
          dateAccessor: 'time',
          dateFormat: '%Q'
        }
      ],
      values: null
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.values = await d3.dsv(',', '/data/tracker-control.csv', (data) => {
        return data
      })
      console.log(this.values)
    }
  }
}
</script>
<style scoped></style>
