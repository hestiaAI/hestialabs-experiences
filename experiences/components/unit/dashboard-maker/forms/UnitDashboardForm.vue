<template>
  <VContainer>
    <VForm ref="form" v-model="valid">
      <div v-for="(form, idx) in forms" :key="idx">
        <FormChart v-bind="{headers}" v-model="form.values" />
      </div>
      <div class="text-center">
        <VMenu offset-y>
          <template #activator="{ on, attrs }">
            <VBtn
              width="100%"
              class="mt-3"
              dark
              color="primary"
              v-bind="attrs"
              v-on="on"
            >
              Add Graph
              <VIcon dark>
                $vuetify.icons.mdiPlus
              </VIcon>
            </VBtn>
          </template>
          <VList>
            <VSubheader>Type of Graph</VSubheader>
            <VListItemGroup
              color="primary"
            >
              <VListItem
                v-for="(item, index) in items"
                :key="index"
                selectable
              >
                <VListItemTitle>
                  <BaseIcon :icon="item.icon" />
                  <span class="ml-3">{{ item.name }}</span>
                </VListItemTitle>
              </VListItem>
            </VListItemGroup>
          </VList>
        </VMenu>
      </div>
      <VSpacer />
      <div v-if="false">
        <BaseButton color="error" @click="reset">
          Reset All
        </BaseButton>
        <BaseButton color="primary">
          Export Config
        </BaseButton>
        <BaseButton color="success">
          Draw
        </BaseButton>
      </div>
    </VForm>
  </VContainer>
</template>

<script>
import FormChart from './FormChart.vue'
export default {
  components: { FormChart },
  props: {
    headers: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    forms: [{}],
    valid: false,
    items: [
      {
        name: 'Timeline Chart',
        icon: 'mdiChartLine',
        component: 'FormChartTimeline'
      },
      {
        name: 'Top Chart',
        icon: 'mdiChartBar',
        component: 'FormChartTop'
      },
      {
        name: 'Pie Chart',
        icon: 'mdiChartPie',
        component: 'FormChartPie'
      },
      {
        name: 'Hour Chart',
        icon: 'mdiClockOutline',
        component: 'FormChartHour'
      },
      {
        name: 'Week Chart',
        icon: 'mdiCalendarWeek',
        component: 'FormChartWeek'
      }
    ]
  }),
  methods: {
    updateGraph() {
      console.log(this.$refs.form.validate())
      if (this.$refs.form.validate()) {
        this.$emit('submit', this.formValues)
      }
    },
    change(props) {
      this.formValues = Object.assign({}, this.formValues, props)
      console.log(this.formValues)
      this.updateGraph()
    },
    reset() {
      this.$refs.form.reset()
      this.$emit('submit', null)
    }
  }
}
</script>
<style scoped></style>
