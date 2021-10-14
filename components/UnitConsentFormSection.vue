<template>
  <div>
    <h2>{{ section.title }}</h2>
    <v-radio-group
      v-if="section.type === 'radio'"
      v-model="selected"
      :readonly="readonly"
      @change="updateConsent"
    >
      <v-radio
        v-for="(option, j) in section.options"
        :key="`${name}-${j}`"
        :label="option"
        :value="option"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    section: {
      type: Object,
      required: true
    },
    name: {
      type: String,
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
      checked: []
    }
  },
  methods: {
    updateConsent(event) {
      this.$emit('change', { name: this.name, selected: this.selected })
    }
  }
}
</script>
