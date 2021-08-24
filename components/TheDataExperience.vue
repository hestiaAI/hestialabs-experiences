<template>
  <client-only placeholder="Loading...">
    <keep-alive>
      <component :is="isComponent" v-bind="props">
        <template #file-input="slotProps">
          <file-input
            :samples="data"
            :extensions="extensions"
            :multiple="multiple"
            v-bind="slotProps"
          >
          </file-input>
        </template>
      </component>
    </keep-alive>
  </client-only>
</template>

<script>
import preprocessors from '@/manifests/preprocessors'

// https://github.com/nuxt/components/issues/13#issuecomment-902590143
const TheDataExperienceDefault = () =>
  import('@/components/TheDataExperienceDefault.vue')
const TheDataExperiencePower = () =>
  import('@/components/TheDataExperiencePower.vue')

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    examples: {
      type: Array,
      required: true
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
    files: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    preprocessor: {
      type: String,
      default: null
    }
  },
  computed: {
    isSingleFileExperience() {
      return !this.files.length && !this.multiple
    },
    preprocessorFunc() {
      if (!this.preprocessor) {
        // identity
        return val => val
      }
      return preprocessors[this.preprocessor]
    },
    extensions() {
      return this.ext
        .replace(/\s/g, '')
        .split(',')
        .map(ext => `.${ext}`)
    },
    props() {
      const { isSingleFileExperience, preprocessorFunc, extensions } = this
      const propNames = ['examples', 'extensions', 'files']
      const props = Object.fromEntries(propNames.map(k => [k, this[k]]))
      return {
        ...props,
        isSingleFileExperience,
        preprocessorFunc,
        extensions
      }
    },
    isComponent() {
      if (this.$store.state.power) {
        return TheDataExperiencePower
      }
      return TheDataExperienceDefault
    }
  },
  mounted() {
    if (
      this.extensions.includes('.zip') &&
      !this.files.length &&
      // Does not apply to the playground since there
      // we allow to list the files to extract
      this.$route.params.key !== 'playground'
    ) {
      throw new TypeError('Extension `zip` requires `files` to be specified')
    }

    if (this.isSingleFileExperience && this.extensions.length !== 1) {
      throw new Error(
        'Single file is expected but multiple extensions are specified.'
      )
    }
  }
}
</script>
