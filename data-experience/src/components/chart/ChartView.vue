<template>
  <DataValidator :data="data">
    <div>
      <component
        v-if="renderComponent"
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
  data() {
    return {
      renderComponent: true
    }
  },
  computed: {
    component() {
      return () => import(`./view/${this.graphName}`)
    }
  },
  watch: {
    async '$i18n.locale'() {
      this.renderComponent = false
      await this.$nextTick()
      this.renderComponent = true
    }
  }
}
</script>

<style>
/* Import style for dc graphs */
@import 'assets/styles/dc.css';

/* Global style for every graph */
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
