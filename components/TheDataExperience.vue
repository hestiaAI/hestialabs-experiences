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
              allowMissingFiles,
              samples: data,
              isGenericViewer,
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
import { validExtensions } from '@/manifests/utils'
import UnitFiles from '~/components/UnitFiles'

// https://github.com/nuxt/components/issues/13#issuecomment-902590143
const TheDataExperienceDefault = () =>
  import('@/components/TheDataExperienceDefault.vue')

const TheDataExperiencePower = () =>
  import('@/components/TheDataExperiencePower.vue')

export default {
  name: 'TheDataExperience',
  components: { UnitFiles },
  props: {
    title: {
      type: String,
      required: true
    },
    dataPortal: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    ext: {
      type: String,
      required: true,
      validator(val) {
        return (
          val === 'all' ||
          val.split(',').every(v => validExtensions.includes(v))
        )
      }
    },
    files: {
      type: Array,
      default: () => []
    },
    defaultView: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    preprocessors: {
      type: Object,
      default: () => {}
    },
    postprocessors: {
      type: Object,
      default: undefined
    },
    allowMissingFiles: {
      type: Boolean,
      default: false
    },
    customPipelines: {
      type: Object,
      default: undefined
    },
    isGenericViewer: {
      type: Boolean,
      default: false
    },
    showDataExplorer: {
      type: Boolean,
      default: true
    },
    sparql: {
      type: Object,
      default: () => {}
    },
    sql: {
      type: Object,
      default: () => {}
    },
    vega: {
      type: Object,
      default: () => {}
    },
    yarrrml: {
      type: String,
      default: ''
    },
    databaseBuilder: {
      type: Function,
      default: undefined
    }
  },
  computed: {
    extensions() {
      return this.ext === 'all'
        ? []
        : this.ext
            .replace(/\s/g, '')
            .split(',')
            .map(ext => `.${ext}`)
    },
    props() {
      const propNames = [
        'title',
        'dataPortal',
        'defaultView',
        'customPipelines',
        'preprocessors',
        'postprocessors',
        'isGenericViewer',
        'showDataExplorer',
        'files',
        'allowMissingFiles',
        'sparql',
        'sql',
        'vega',
        'yarrrml',
        'databaseBuilder'
      ]
      return Object.fromEntries(propNames.map(k => [k, this[k]]))
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
