<template>
  <VRow>
    <VCol cols="12" sm="6">
      <VSelect
        v-model="formValues.valueAccessor"
        :menu-props="{ top: true, offsetY: true }"
        :items="columns"
        label="Value accessor*"
        hint="Column name of the values to be displayed/compared in the graph"
        :rules="[ v => !!v || 'Value accessor is required']"
        @change="onChange"
      />
    </VCol>
    <VCol cols="12" sm="6">
      <VSelect
        v-model="formValues.sumAccessor"
        :menu-props="{ top: true, offsetY: true }"
        :items="columns"
        label="Sum accessor"
        hint="If defined, calculates the sum of the column named sumAccessor over valueAccessor. Otherwise, takes the count of the unique {valueAccessor}."
        @change="onChange"
      />
    </VCol>
    <VCol cols="12" sm="6">
      <VTextField
        v-model="formValues.defaultValue"
        label="Default value"
        type="number"
        hint="If one of valueAccessor is null, replace the value with a default"
        placeholder="0"
        @change="onChange"
      />
    </VCol>
  </VRow>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    headers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      formValues: {
        type: 'PieChart.vue',
        ...this.value
      }
    }
  },
  computed: {
    columns() {
      return this.headers.map(h => h?.value || h)
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.formValues)
    }
  }
}
</script>
<style scoped></style>
