<template>
  <VCard class="mb-3">
    <VCardTitle>
      <BaseIcon :icon="form.icon" />
      <span class="ml-3">{{ form.name }}</span>
    </VCardTitle>
    <VContainer fluid>
      <VRow>
        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            v-model="formValues.title"
            label="Title of the graph"
            :counter="20"
            :rules="[
              v => (!v || v.length <= 20) || 'Title must be less than 20 characters',
            ]"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            v-model="formValues.valueLabel"
            label="Value Label"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            v-model="formValues.height"
            label="Height"
            type="number"
            placeholder="250"
            hint="Value in pixels"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            v-model="formValues.cols"
            label="Width"
            type="number"
            :rules="[(v => v == null || v <= 12 && v >= 1) || 'Width must be between 1 and 12']"
            :min="1"
            :max="12"
            placeholder="6"
            hint="Integer between 1 and 12"
          />
        </VCol>
      </VRow>
      <component
        :is="form.component"
        v-bind="{ headers }"
        v-model="formValues"
      />
    </VContainer>
  </VCard>
</template>

<script>
import BaseIcon from '~/components/base/BaseIcon.vue'
export default {
  components: {
    BaseIcon
  },
  model: {
    prop: 'form',
    event: 'change'
  },
  props: {
    headers: {
      type: Array,
      required: true
    },
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formValues: this.form
    }
  },
  watch: {
    formValues() {
      console.log(this.formValues)
      this.$emit('change', this.formValues)
    }
  }
}
</script>
<style scoped></style>
