<template>
  <VContainer>
    <VTabs v-model="selected">
      <VTab v-for="tab in tabs" :key="tab.name">{{ tab.name }}</VTab>
    </VTabs>
    <VTabsItems v-model="selected">
      <VTabItem v-for="tab in tabs" :key="tab.name + 'content'">
        <component :is="tab.component" v-bind="{ headers, values }"></component>
      </VTabItem>
    </VTabsItems>
  </VContainer>
</template>
<script>
import FormChartLineTab from './tabs/FormChartLineTab.vue'
import FormChartAxisTab from './tabs/FormChartAxisTab.vue'
import FormChartFrameTab from './tabs/FormChartFrameTab.vue'
export default {
  components: {
    FormChartLineTab,
    FormChartAxisTab,
    FormChartFrameTab
  },
  props: {
    headers: {
      type: Array,
      required: true
    },
    values: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selected: null,
      tabs: [
        {
          name: 'Lines',
          component: 'FormChartLineTab'
        },
        {
          name: 'Axis',
          component: 'FormChartAxisTab'
        },
        {
          name: 'Frame',
          component: 'FormChartFrameTab'
        }
      ]
    }
  }
}
</script>
