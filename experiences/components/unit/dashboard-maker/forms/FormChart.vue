<template>
  <VCard>
    <VContainer fluid>
      <VRow>
        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            v-model="form.title"
            label="Title of the graph"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            v-model="form.valueLabel"
            label="Value Label"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            v-model="form.height"
            label="Height"
            type="number"
            hint="Value in pixels"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            v-model="form.cols"
            label="Width"
            type="number"
            :rules="[v => v <= 12 && v >= 1]"
            :min="1"
            :max="12"
            hint="Integer between 1 and 12"
          />
        </VCol>
        <VCol cols="12">
          <VSelect
            v-model="selected"
            :items="items"
            label="Pick a Chart"
            :rules="[v => !!v || 'Chart type is required']"
            item-text="name"
            item-value="component"
          >
            <template #selection="{ item }">
              <BaseIcon :icon="item.icon" />
              <span class="ml-3">{{ item.name }}</span>
            </template>
            <template #item="{ item }">
              <BaseIcon :icon="item.icon" />
              <span class="ml-3">{{ item.name }}</span>
            </template>
          </VSelect>
        </VCol>
        <div v-if="selected">
          <component
            :is="selected"
            v-bind="{ headers, values }"
            @change="change"
          />
        </div>
      </VRow>
    </VContainer>
  </VCard>
</template>

<script>
import BaseIcon from '~/components/base/BaseIcon.vue'
export default {
  components: {
    BaseIcon
  },
  props: {
    headers: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    form: {},
    valid: false,
    selected: null,
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
        this.$emit('submit', this.form)
      }
    },
    change(props) {
      this.form = Object.assign({}, this.form, props)
      console.log(this.form)
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
