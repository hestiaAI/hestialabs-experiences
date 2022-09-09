<template>
  <VDialog
    v-model="dialog"
    fullscreen
    hide-overlay
    class="dialog"
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
    <VCard tile class="dialog-card">
      <VToolbar dark color="primary">
        <VBtn icon dark @click="dialog = false">
          <VIcon>$vuetify.icons.mdiClose</VIcon>
        </VBtn>
        <VToolbarTitle>Convert to graph</VToolbarTitle>
      </VToolbar>
      <VRow justify="center" class="pa-3 inner-dialog">
        <VCol cols="6" lg="4" class="border-right">
          <UnitDashboardForm v-bind="{ headers }" @submit="submit" />
        </VCol>
        <VDivider vertical />
        <VCol cols="6" lg="8">
          <VCard flat class="ma-3">
            <div v-if="!formsInfo">
              <BaseAlert type="warning">
                Please fill in the form on the left to draw the
                graph(s)
              </BaseAlert>
              <VDataTable v-bind="{ headers, items: values }" />
            </div>
            <div v-else>
              <ChartViewDashboard v-bind="{ 'graphs':formsInfo, headers, values }" />
            </div>
          </VCard>
        </VCol>
      </VRow>
    </VCard>
  </VDialog>
</template>

<script>
import UnitDashboardForm from './forms/UnitDashboardForm.vue'
import ChartViewDashboard from '@/components/chart/view/ChartViewDashboard.vue'
export default {
  components: { UnitDashboardForm, ChartViewDashboard },
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
<style scoped>
.dialog {
  z-index: 3000;
}
.dialog-card {
  height: 100%;
  overflow: hidden
}
.inner-dialog {
  height: 100%;
}
.border-right {
  border-right: 0.8px solid rgb(202, 200, 200);
}
</style>
