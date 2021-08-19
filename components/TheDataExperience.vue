<template>
  <client-only placeholder="Loading...">
    <keep-alive>
      <the-data-experience-power v-if="$store.state.power" v-bind="props" />
      <the-data-experience-default v-else v-bind="props" />
    </keep-alive>
  </client-only>
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
    preprocessorFunc() {
      if (!this.preprocessor) {
        // identity
        return val => val
      }
      return preprocessors[this.preprocessor]
    },
    props() {
      const { preprocessor, ...rest } = this.$props
      return {
        ...rest,
        preprocessorFunc: this.preprocessorFunc
      }
    }
  }
}
</script>
