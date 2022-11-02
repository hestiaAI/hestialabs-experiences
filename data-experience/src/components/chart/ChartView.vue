<template>
  <DataValidator :data="data">
    <div class="chart-view">
      <component
        :is="component"
        v-bind="{
          values: data.items || [],
          headers: data.headers || [],
          ...$attrs
        }"
      />
    </div>
  </DataValidator>
</template>

<script>
import DataValidator from '@/components/misc/DataValidator.vue'

export default {
  name: 'ChartView',
  components: { DataValidator },
  props: {
    data: {
      type: Object,
      required: true
    },
    graphName: {
      type: String,
      required: true
    }
  },
  computed: {
    component() {
      return () => import(`./view/${this.graphName}`)
    }
  }
}
</script>

<style>
/* Global styles for every chart view */
/* Note: DC styles should be overridden in src/assets/dc-custom.css */
.chart-view .range-chart > svg > g > g.axis.y {
  display: none;
}

.chart-view p.filters {
  font-size: 0.8rem;
  font-style: italic;
}

.chart-view a.reset {
  color: rgb(85, 3, 30);
  margin-left: 1rem;
}
</style>
