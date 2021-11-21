<template>
  <div>
    <!-- advanced view -->
    <template v-if="$store.state.power">
      <VRow>
        <VCol cols="12" lg="6">
          <UnitCustomPipeline
            v-if="customPipeline"
            v-bind="{ fileManager, customPipeline }"
            @update="onUnitResultsUpdate"
          />
          <UnitSparql
            v-else
            v-bind="{ selectedExample, query, queryDisabled }"
            class="mr-lg-6"
            @update="onUnitResultsUpdate"
            @change="onChangeSelector"
          />
        </VCol>
        <VCol cols="12" lg="6">
          <UnitFilterableTable :data="result" />
        </VCol>
        <template v-if="result">
          <VCol
            v-for="(specFile, vegaIndex) in vegaFiles"
            :key="vegaIndex"
            cols="12"
            style="text-align: center"
          >
            <UnitVegaViz
              :spec-file="specFile"
              :data="processResultForVega(result, specFile)"
              :div-id="`viz-${query.name}-${specFile.name}`"
            />
          </VCol>
        </template>
      </VRow>
    </template>

    <!-- default view -->
    <template v-else>
      <VCard v-if="defaultViewElements" class="pa-2 my-6">
        <VCardTitle class="justify-center">{{
          defaultViewElements.title
        }}</VCardTitle>
        <VRow>
          <VCol cols="8" class="mx-auto">
            {{ defaultViewElements.text }}
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <UnitCustomPipeline
              v-if="customPipeline !== undefined"
              v-bind="{
                fileManager,
                customPipeline,
                parameterName: defaultViewElements.parameter
              }"
              @update="onUnitResultsUpdate"
            />
            <UnitSparql
              v-else
              v-bind="{ selectedExample, query, queryDisabled }"
              class="mr-lg-6"
              @update="onUnitResultsUpdate"
            />
          </VCol>
        </VRow>
        <template v-if="finished">
          <template v-if="result">
            <VRow>
              <VCol
                v-for="(specFile, vegaIndex) in vegaFiles"
                :key="'vega-' + vegaIndex"
                style="text-align: center"
              >
                <UnitVegaViz
                  :spec-file="specFile"
                  :data="processResultForVega(result, specFile)"
                  :div-id="`viz-${index}-${specFile.name}`"
                />
              </VCol>
            </VRow>
            <VRow
              v-for="(graphName, vizVueIndex) in vizVueGraphs"
              :key="'viz-vue-' + vizVueIndex"
            >
              <VCol>
                <VueGraphByName :graph-name="graphName" :data="result" />
              </VCol>
            </VRow>
            <VRow
              v-for="(src, vizUrlIndex) in vizUrls"
              :key="'viz-url-' + vizUrlIndex"
            >
              <VCol>
                <UnitIframe :src="src" :data="result" />
              </VCol>
            </VRow>
            <VRow v-if="showTable">
              <VCol>
                <UnitFilterableTable :data="result" />
              </VCol>
            </VRow>
          </template>
          <template v-else>
            <VRow>
              <VCol>
                <p><i>No relevant data found</i></p>
              </VCol>
            </VRow>
          </template>
        </template>
      </VCard>
    </template>
  </div>
</template>

<script>
import csvProcessors from '@/manifests/csv-processors'
import FileManager from '~/utils/file-manager'

export default {
  props: {
    visualizations: {
      type: Object,
      default: () => {}
    },
    selectedExample: {
      type: Object,
      required: true
    },
    query: {
      type: Object,
      default: null
    },
    defaultViewElements: {
      type: Object,
      default: null
    },
    queryDisabled: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    },
    customPipeline: {
      type: Function,
      default: undefined
    },
    fileManager: {
      type: FileManager,
      required: true
    }
  },
  data() {
    return {
      result: undefined,
      finished: false
    }
  },
  computed: {
    exampleVisualizations() {
      const { name } = this.selectedExample
      return this.visualizations?.[name] || []
    },
    showTable() {
      return this.defaultViewElements.showTable
    },
    vizNames() {
      let vizNames
      if (this.defaultViewElements) {
        vizNames = this.defaultViewElements?.visualizations || []
      } else {
        vizNames = this.exampleVisualizations
          .filter(v => v.query === this.query?.name)
          .map(v => v.vega)
      }
      return vizNames
    },
    vizUrls() {
      return this.vizNames.filter(n => n.startsWith('/'))
    },
    vizVueGraphs() {
      return this.vizNames.filter(n => n.endsWith('.vue'))
    },
    vegaFiles() {
      return this.selectedExample.vega.filter(s =>
        this.vizNames.includes(s.name)
      )
    }
  },
  methods: {
    processResultForVega(result, specFile) {
      const processor = this.findProcessor(specFile)
      if (processor) {
        const items = processor(result)[1]
        return { items }
      }
      return result
    },
    findProcessor(specFile) {
      if (this.customPipeline === undefined) {
        // Find the viz definition for this query
        const preprocessor = this.exampleVisualizations.filter(
          v => this.query.name === v.query && specFile.name === v.vega
        )
        // Does it have a preprocessor?
        if (preprocessor.length === 1) {
          return csvProcessors[preprocessor[0]?.preprocessor]
        }
      }
      return undefined
    },
    onUnitResultsUpdate(result) {
      this.result = result
      this.finished = true
      this.$emit('update', { index: this.index, result })
    },
    onChangeSelector(query) {
      this.$emit('change', query)
    }
  }
}
</script>
