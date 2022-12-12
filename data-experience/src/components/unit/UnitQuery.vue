<template>
  <div>
    <VOverlay :value="overlay !== ''" absolute opacity="0.5">
      <div
        class="d-flex flex-column align-center"
        style="width: 100%; height: 100%"
      >
        <div class="mb-3">
          {{ $tev(k('overlay'), overlay) }}
        </div>
      </div>
    </VOverlay>
    <VCard v-if="fileManager !== null" class="pa-2 mb-6" flat>
      <VRow>
        <VCol cols="1" />
        <VCol cols="10">
          <VCardTitle class="justify-center">
            {{ $tev(k('title'), title) }}
          </VCardTitle>
        </VCol>
        <VCol cols="1" align-self="center" class="full-height text-center">
          <VTooltip
            v-if="['genericDateViewer', 'genericLocationViewer'].includes(currentTab)"
            left
          >
            <template #activator="{ on }">
              <VIcon v-on="on">
                $vuetify.icons.mdiFileMultipleOutline
              </VIcon>
            </template>
            <span
              v-t="'All files are used'"
            />
          </VTooltip>
          <UnitFilesDialog
            v-else-if="
              fileGlobs.length
                > 0"
            :file-globs="fileGlobs"
            :file-manager="fileManager"
          />
        </VCol>
      </VRow>

      <VRow v-if="text || $te(k('text'))">
        <VCol>
          <VContainer>
            {{ $tev(k('text'), text) }}
          </VContainer>
        </VCol>
      </VRow>
      <template v-if="missingFiles.length > 0">
        <BaseAlert class="mt-4">
          {{ $tc('File', missingFiles.length) }} {{ $t('not found') }}:
          {{ missingFiles.join(', ') }}
        </BaseAlert>
      </template>
      <template v-else>
        <UnitPipelineCustom
          v-if="customPipeline"
          v-bind="{
            id,
            customPipeline,
            customPipelineOptions
          }"
          @update="onUnitResultsUpdate"
        />
        <UnitPipelineSql
          v-else-if="sql"
          v-bind="{ id, sql }"
          @update="onUnitResultsUpdate"
        />
        <VRow v-if="errorMessage">
          <VCol>
            <BaseAlert type="error">
              {{ errorMessage }}
            </BaseAlert>
          </VCol>
        </VRow>
        <VImg v-if="image" :src="image" />
        <template v-if="clonedResult">
          <VRow>
            <VCol>
              <UnitVegaViz
                v-if="vizVega"
                :spec-file="vizVega"
                :data="clonedResultPostprocessed"
                class="text-center"
              />
              <ChartView
                v-else-if="vizVue"
                v-bind="{
                  graphName: vizVue,
                  data: clonedResultPostprocessed,
                  ...vizPropsTranslated
                }"
              />
              <UnitKepler
                v-else-if="vizKepler"
                :args="clonedResultPostprocessed"
              />
            </VCol>
          </VRow>
          <VContainer v-if="showTable">
            <UnitFilterableTable v-bind="clonedResult" />
          </VContainer>
        </template>
      </template>
    </VCard>
  </div>
</template>

<script>
import { mapState } from '@/utils/store-helper'
import { cloneDeep, merge } from 'lodash-es'
import UnitPipelineSql from './UnitPipelineSql.vue'
import UnitFilesDialog from './files/UnitFilesDialog.vue'
import ChartView from '@/components/chart/ChartView.vue'
import UnitKepler from '@/components/unit/UnitKepler.vue'
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'
import UnitVegaViz from '@/components/unit/UnitVegaViz.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import UnitPipelineCustom from './UnitPipelineCustom.vue'

export default {
  name: 'UnitQuery',
  components: { UnitPipelineSql, UnitFilesDialog, ChartView, UnitKepler, UnitFilterableTable, UnitVegaViz, BaseAlert, UnitPipelineCustom },
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    files: {
      type: Array,
      default: null
    },
    postprocessor: {
      type: Function,
      required: true
    },
    visualization: {
      type: [String, Object],
      default: ''
    },
    sql: {
      type: String,
      default: ''
    },
    customPipeline: {
      type: [String, Function],
      default: undefined
    },
    customPipelineOptions: {
      type: [Object, Array],
      default: undefined
    },
    showTable: {
      type: Boolean,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    overlay: {
      type: String,
      default: ''
    },
    vizProps: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const { visualization: v } = this
    let vizKepler = false
    let vizVue = false
    let vizVega = false
    if (typeof v === 'string') {
      vizKepler = v.startsWith('/kepler') && v
      vizVue = v.endsWith('.vue') && v
    } else if (typeof v === 'object') {
      vizVega = v
    }
    return {
      errorMessage: '',
      // `result` keeps track of the internal result from the pipeline.
      // Note: we should not fetch the result from Vuex because
      // then the UnitQuery component instance will react when
      // other instances add to the results object in the store.
      result: null,
      vizKepler,
      vizVue,
      vizVega
    }
  },
  computed: {
    ...mapState(['fileManager', 'experienceConfig', 'currentTab']),
    clonedResult() {
      return cloneDeep(this.result)
    },
    clonedResultPostprocessed() {
      return this.postprocessor(this.clonedResult)
    },
    fileGlobs() {
      const fileIds = this.files ?? []
      return fileIds.map(id => this.fileManager.idToGlob[id])
    },
    missingFiles() {
      return this.fileGlobs
        .map(glob => [glob, this.fileManager.findMatchingFilePaths(glob)])
        .filter(([_, files]) => files.length === 0)
        .map(([glob, _]) => glob)
    },
    vizPropsTranslated() {
      // translations override all props...
      // we trust that they only affect texts
      // NOTE: we need to deepClone the vizProps before doing the merge
      // because the lodash merge function recursively mutates the first argument
      // and it will cause a vuex mutation error otherwise.
      return merge(cloneDeep(this.vizProps), this.$tev(this.k('vizProps'), {}) || {})
    }
  },
  watch: {
    fileManager(value) {
      if (!value) {
        // When fileManager is reset,
        // we set result to null to ensure
        // the viz component is not mounted
        // before new results from the pipeline
        // are available (see clonedResult)
        this.result = null
      }
    }
  },
  methods: {
    onUnitResultsUpdate({ result, error }) {
      if (error) {
        console.error(error)
        this.errorMessage = error instanceof Error ? error.message : error
        return
      }
      this.$store.commit('xp/setResult', {
        result
      })
      this.result = result
    },
    // Convert local translation key to global vue-i18n
    k(key) {
      return `experiences.${this.experienceConfig.slug}.viewBlocks.${this.currentTab}.${key}`
    }
  }
}
</script>
