<template>
  <VContainer>
    <VOverlay :value="overlay" absolute opacity="0.5">
      <div
        class="d-flex flex-column align-center"
        style="width: 100%; height: 100%"
      >
        <div class="mb-3">
          {{ $tev(k('overlay'), overlay) }}
        </div>
      </div>
    </VOverlay>
    <VCard class="pa-2 mb-6" flat>
      <VRow>
        <VCol cols="10" offset="1">
          <VCardTitle class="justify-center">
            {{ $tev(k('title'), title) }}
          </VCardTitle>
        </VCol>
        <VCol cols="1" align-self="center" class="full-height text-center">
          <slot name="infoDialog"></slot>
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
          <p>
          {{ $tc('File', missingFiles.length) }} {{ $t('not found') }}
          </p>
          <p>
          {{ missingFiles.join(', ') }}
          </p>
        </BaseAlert>
      </template>
      <template v-else>
        <VImg v-if="image" :src="image" />
        <template v-if="clonedData">
          <VRow>
            <VCol>
              <UnitVegaViz
                v-if="vizVega"
                :spec-file="vizVega"
                :data="clonedDataPostprocessed"
                class="text-center"
              />
              <ChartView
                v-else-if="vizVue"
                v-bind="{
                  graphName: vizVue,
                  data: clonedDataPostprocessed,
                  ...vizPropsTranslated
                }"
              />
              <UnitKepler
                v-else-if="vizKepler"
                :args="clonedDataPostprocessed"
              />
            </VCol>
          </VRow>
          <VContainer v-if="showTable">
            <UnitFilterableTable v-bind="clonedData" />
          </VContainer>
        </template>
      </template>
    </VCard>
  </VContainer>
</template>

<script>
import { cloneDeep, merge } from 'lodash-es'

import { mapState, mapGetters } from '@/utils/store-helper'

import ChartView from '@/components/chart/ChartView.vue'
import UnitKepler from '@/components/unit/UnitKepler.vue'
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'
import UnitVegaViz from '@/components/unit/UnitVegaViz.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'

export default {
  name: 'UnitViewBlock',
  components: {
    ChartView,
    UnitKepler,
    UnitFilterableTable,
    UnitVegaViz,
    BaseAlert
  },
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
    missingFiles: {
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
    },
    // `data` is the result from the pipeline.
    // Note: we should not fetch the data from Vuex because
    // then the UnitPipelineViewBlock component instance will react when
    // other instances add to the results object in the store.
    data: {
      required: false,
      default: null
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
      vizKepler,
      vizVue,
      vizVega
    }
  },
  computed: {
    ...mapState(['experienceConfig', 'bubbleConfig', 'currentTab']),
    ...mapGetters(['experienceNameAndTag']),
    clonedData() {
      return cloneDeep(this.data)
    },
    clonedDataPostprocessed() {
      return this.postprocessor(this.clonedData)
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
  methods: {
    // Convert local translation key to global vue-i18n
    k(key) {
      const nameAndTag = this.experienceNameAndTag
      return `experiences.${nameAndTag}.viewBlocks.${this.currentTab}.${key}`
    }
  }
}
</script>
