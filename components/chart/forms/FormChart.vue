<template>
  <VContainer>
    <VForm ref="form" v-model="valid" lazy-validation>
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
      <div v-if="selected">
        <component :is="selected" v-bind="{ headers, values }"></component>
      </div>
    </VForm>
  </VContainer>
</template>

<script>
import FormChartLine from './FormChartLine.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
export default {
  components: {
    FormChartLine,
    BaseIcon
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
  data: () => ({
    formValues: {},
    valid: false,
    selected: null,
    items: [
      {
        name: 'Line Chart',
        icon: 'mdiChartLine',
        component: 'FormChartLine'
      },
      {
        name: 'Bar Chart',
        icon: 'mdiChartBar',
        component: 'FormChartBar',
        disabled: true
      },
      {
        name: 'Pie Chart',
        icon: 'mdiChartPie',
        component: 'FormChartPie',
        disabled: true
      }
    ]
  }),
  methods: {
    updateGraph() {
      if (this.$refs.form.validate()) {
        this.$emit('submit', {
          graphName: this.select,
          graphProps: this.formValues
        })
      }
    },
    reset() {
      this.$refs.form.reset()
      this.$emit('submit', null)
    }
  }
}
</script>
<style scoped></style>
