<template>
  <client-only placeholder="Loading...">
    <keep-alive>
      <component :is="isComponent" v-bind="props">
        <template #file-input="{ loading, disabled, onFileChange }">
          <file-input
            :accept="accept"
            :disabled="disabled"
            hide-details
            :label="label"
            :loading="loading"
            :multiple="multiple"
            show-size
            :handle-change="onFileChange"
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
      return this.ext.split(',')
    },
    accept() {
      return this.extensions.map(ext => `.${ext}`).join()
    },
    label() {
      const exts = this.ext.replace(/\s/g, '').replace(/,/g, ', ')
      return `Select file${this.multiple ? 's' : ''} (${exts})`
    },
    props() {
      const {
        isSingleFileExperience,
        preprocessorFunc,
        extensions,
        accept,
        label
      } = this
      const { preprocessor, ...rest } = this.$props
      return {
        ...rest,
        isSingleFileExperience,
        preprocessorFunc,
        extensions,
        accept,
        label
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
      this.extensions.includes('zip') &&
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
