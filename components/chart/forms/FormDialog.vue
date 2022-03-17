<template>
  <VDialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template #activator="{ on, attrs }">
      <VTooltip top>
        <template #activator="{ on: tooltip }">
          <VBtn icon class="ml-4" v-bind="attrs" v-on="{ ...tooltip, ...on }">
            <VIcon>$vuetify.icons.mdiChartBar</VIcon>
          </VBtn>
        </template>
        <span>Convert to graph</span>
      </VTooltip>
    </template>
    <VCard tile>
      <VToolbar dark color="primary">
        <VBtn icon dark @click="dialog = false">
          <VIcon>$vuetify.icons.mdiClose</VIcon>
        </VBtn>
        <VToolbarTitle>Convert to graph</VToolbarTitle>
      </VToolbar>
      <VRow justify="center" class="pa-3 ma-3">
        <VCol>
          <FormAllChart v-bind="{ headers, values }" @submit="submit" />
        </VCol>
        <VDivider vertical />
        <VCol>
          <VDataTable v-if="!formsInfo" v-bind="{ headers, items: values }" />
          <ChartView
            v-else
            :data="{ headers, items: values }"
            :viz-props="formsInfo.graphProps"
            :graph-name="`base/${formsInfo.graphName}`"
          />
        </VCol>
      </VRow>
    </VCard>
  </VDialog>
</template>

<script>
import FormAllChart from './FormAllChart.vue'
export default {
  components: { FormAllChart },
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
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      formsInfo: null
    }
  },
  methods: {
    submit(formsInfo) {
      console.log('submit', formsInfo)
      this.formsInfo = formsInfo
    }
  }
}
</script>
