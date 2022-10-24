<template>
  <DataValidator :data="data">
    <component
      :is="component"
      v-bind="{
        values: data.items || [],
        headers: data.headers || [],
        ...$attrs
      }"
    />
  </DataValidator>
</template>

<script>
export default {
  inheritAttrs: false,
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
      return () => import(`@/components/chart/view/${this.graphName}`)
    }
  }
}
</script>

<style>
/* Import style for dc graphs */
@import 'assets/styles/dc.css';

/* Global style for every graph */
body {
  font-family: sans-serif;
  color: #22313f;
}

.dc-chart g.row text {
  fill: #22313f;
  font-weight: bold;
}

.range-chart > svg > g > g.axis.y {
  display: none;
}

.dc-text-filter-input {
  font-family: inherit;
  border: 0;
  border-bottom: 1px solid gray;
  outline: 0;
  background: transparent;
  max-width: 7em;
}

p.filters {
  font-size: 0.8rem;
  font-style: italic;
}

.v-application a.reset {
  color: rgb(85, 3, 30);
}

.reset {
  margin-left: 1rem;
}
</style>
