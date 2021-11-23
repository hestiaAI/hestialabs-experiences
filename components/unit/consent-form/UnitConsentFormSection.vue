<template>
  <div>
    <h2>{{ section.title }}</h2>

    <p>
      {{ section.description }}
    </p>

    <VRadioGroup
      v-if="section.type === 'radio'"
      v-model="selected"
      :readonly="readonly"
      @change="updateConsent"
    >
      <VRadio
        v-for="(option, j) in section.options"
        :key="`${index}-${j}`"
        :label="option"
        :value="option"
      ></VRadio>
    </VRadioGroup>

    <template v-if="section.type === 'checkbox'">
      <VCheckbox
        v-for="(option, j) in section.options"
        :key="`${index}-${j}`"
        v-model="selected"
        :label="option"
        :value="option"
        dense
        :readonly="readonly"
        @change="updateConsent"
      />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    section: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: this.section.selected
    }
  },
  methods: {
    updateConsent(event) {
      this.$emit('change', { index: this.index, selected: this.selected })
    }
  }
}
</script>
