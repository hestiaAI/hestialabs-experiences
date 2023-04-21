<template>
  <component
    :is="chart"
    v-bind="{...params}"
  />
</template>

<script>
import TimelineChart from './charts/TimelineChart.vue'
import BarTimelineChart from './charts/BarTimelineChart.vue'
import HourChart from './charts/HourChart.vue'
import PieChart from './charts/PieChart.vue'
import TopChart from './charts/TopChart.vue'
import WeekChart from './charts/WeekChart.vue'

export default {
  components: {
    TimelineChart,
    BarTimelineChart,
    HourChart,
    PieChart,
    TopChart,
    WeekChart
  },
  props: {
    chart: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
