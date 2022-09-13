<template>
  <VRow>
    <VCol cols="12" sm="6">
      <VSelect
        v-model="formValues.dateAccessor"
        :menu-props="{ top: true, offsetY: true }"
        :items="columns"
        label="Date accessor*"
        hint="Column name that represent date values"
        :rules="[ v => !!v || 'Date accessor is required']"
        @change="onChange"
      />
    </VCol>
    <VCol cols="12" sm="6">
      <VTextField
        v-model="formValues.dateFormat"
        label="Date Format"
        hint="Format of the dates being processed, if not set will use the Date constructor"
        placeholder="%d-%m-%Y"
        @change="onChange"
      />
    </VCol>
    <VCol cols="12" sm="6">
      <VSelect
        v-model="formValues.valueAccessor"
        :menu-props="{ top: true, offsetY: true }"
        :items="columns"
        label="Value accessor"
        hint="The value to consider in respect to the date, if not set, will take the number of records"
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
        type: 'HourChart.vue',
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
