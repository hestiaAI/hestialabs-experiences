<template>
  <keep-alive>
    <component
      :is="component"
      v-bind="$props"
      :preprocessor-func="preprocessorFunc"
    />
  </keep-alive>
</template>

<script>
import preprocessors from '@/manifests/preprocessors'

export default {
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    files: {
      type: Array,
      default: () => []
    },
    preprocessor: {
      type: String,
      default: null
    },
    ext: {
      type: String,
      required: true,
      validator(val) {
        // JS files allowed for experimenting with individual twitter files
        const validExtensions = ['zip', 'csv', 'json', 'js', 'xml']
        return val.split(',').every(v => validExtensions.includes(v))
      }
    },
    examples: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    component() {
      return `the-data-experience-${
        this.$store.state.power ? 'power' : 'default'
      }`
    },
    preprocessorFunc() {
      if (!this.preprocessor) {
        // identity
        return val => val
      }
      return preprocessors[this.preprocessor]
    }
  }
}
</script>
