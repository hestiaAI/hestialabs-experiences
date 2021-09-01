<template>
  <client-only placeholder="Loading...">
    <keep-alive>
      <component :is="isComponent" v-bind="props">
        <template #unit-files="{ update, ...slotProps }">
          <unit-files
            v-bind="{
              extensions,
              files,
              multiple,
              preprocessor,
              samples: data,
              ...slotProps
            }"
            @update="update"
          >
          </unit-files>
        </template>
      </component>
    </keep-alive>
  </client-only>
</template>

<script>
import { validExtensions } from '@/manifests'

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
      default: undefined
    }
  },
  computed: {
    extensions() {
      return this.ext
        .replace(/\s/g, '')
        .split(',')
        .map(ext => `.${ext}`)
    },
    props() {
      const propNames = ['examples']
      const props = Object.fromEntries(propNames.map(k => [k, this[k]]))
      return props
    },
    isComponent() {
      if (this.$store.state.power) {
        return TheDataExperiencePower
      }
      return TheDataExperienceDefault
    }
  }
}
</script>
