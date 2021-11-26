<template>
  <div>
    <h2 v-if="section.title">{{ section.title }}</h2>

    <template v-if="section.description">
      <!-- For security reasons, HTML is not rendered on zip import -->
      <p v-if="readonly">
        {{ section.description }}
      </p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-else v-html="section.description"></p>
    </template>

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

    <template v-if="section.type === 'input'">
      <VTextField
        v-if="readonly"
        dense
        :readonly="readonly"
        :value="section.value"
        :label="section.name"
      ></VTextField>
      <VTextField
        v-else
        v-model="value"
        dense
        :label="section.name"
        @change="updateConsent"
      ></VTextField>
    </template>

    <template v-if="section.type === 'multiline'">
      <VTextarea
        v-if="readonly"
        dense
        auto-grow
        outlined
        rows="3"
        :readonly="readonly"
        :value="section.value"
        :label="section.name"
      ></VTextarea>
      <VTextarea
        v-else
        v-model="value"
        dense
        auto-grow
        outlined
        rows="3"
        :label="section.name"
        @change="updateConsent"
      ></VTextarea>
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
      selected: this.section.selected,
      value: ''
    }
  },
  methods: {
    updateConsent() {
      this.$emit('change', {
        index: this.index,
        selected: this.selected,
        value: this.value
      })
    }
  }
}
</script>
