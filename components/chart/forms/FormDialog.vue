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
      <VRow justify="center" class="pa-3">
        <VCol cols="6" lg="4">
          <FormChart v-bind="{ headers, values }" @submit="submit" />
        </VCol>
        <VDivider vertical />
        <VCol cols="6" lg="8">
          <VTabs v-model="tab">
            <VTabsSlider color="primary"></VTabsSlider>
            <VTab>Table</VTab>
            <VTab>Graph</VTab>
          </VTabs>
          <VTabsItems v-model="tab" class="mt-10">
            <VTabItem>
              <VCard flat class="ma-3">
                <VDataTable v-bind="{ headers, items: values }" />
              </VCard>
            </VTabItem>
            <VTabItem>
              <VCard flat class="ma-3">
                <BaseAlert v-if="!formsInfo" type="warning"
                  >Please fill in the form on the left to draw the
                  graph</BaseAlert
                >
                <ChartView
                  v-else
                  :data="{ headers, items: values }"
                  :viz-props="formsInfo.graphProps"
                  :graph-name="`base/${formsInfo.graphName}`"
                />
              </VCard>
            </VTabItem>
          </VTabsItems>
        </VCol>
      </VRow>
    </VCard>
  </VDialog>
</template>

<script>
import FormChart from './FormChart.vue'
export default {
  components: { FormChart },
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
      formsInfo: null,
      tab: 0
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
