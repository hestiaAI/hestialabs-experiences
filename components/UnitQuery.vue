<template>
  <div>
    <!-- advanced view -->
    <template v-if="$store.state.power">
      <v-row>
        <v-col cols="12" lg="6">
          <unit-custom-pipeline
            v-if="customPipeline"
            v-bind="{ inputFiles, customPipeline }"
            @update="onUnitResultsUpdate"
          />
          <unit-sparql
            v-else
            v-bind="{ selectedExample, query, queryDisabled }"
            class="mr-lg-6"
            @update="onUnitResultsUpdate"
            @change="onChangeSelector"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <unit-filterable-table v-bind="{ headers, items }" />
        </v-col>
        <template v-if="result">
          <v-col
            v-for="(specFile, vegaIndex) in vegaFiles"
            :key="vegaIndex"
            cols="12"
            style="text-align: center"
          >
            <unit-vega-viz
              :spec-file="specFile"
              :values="processedVegaItems[vegaIndex]"
              :div-id="`viz-${query.name}-${specFile.name}`"
            />
          </v-col>
        </template>
      </v-row>
    </template>

    <!-- default view -->
    <template v-else>
      <v-card v-if="defaultViewElements" class="pa-2 my-6">
        <v-card-title class="justify-center">{{
          defaultViewElements.title
        }}</v-card-title>
        <v-row>
          <v-col cols="8" class="mx-auto">
            {{ defaultViewElements.text }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <unit-custom-pipeline
              v-if="customPipeline !== undefined"
              v-bind="{
                inputFiles,
                customPipeline,
                parameterName: defaultViewElements.parameter
              }"
              @update="onUnitResultsUpdate"
            />
            <unit-sparql
              v-else
              v-bind="{ selectedExample, query, queryDisabled }"
              class="mr-lg-6"
              @update="onUnitResultsUpdate"
            />
          </v-col>
        </v-row>
        <template v-if="finished">
          <template v-if="result">
            <v-row>
              <v-col
                v-for="(specFile, vegaIndex) in vegaFiles"
                :key="'vega-' + vegaIndex"
                style="text-align: center"
              >
                <unit-vega-viz
                  :spec-file="specFile"
                  :values="processedVegaItems[vegaIndex]"
                  :div-id="`viz-${index}-${specFile.name}`"
                />
              </v-col>
            </v-row>
            <v-row
              v-for="(graphName, vizVueIndex) in vizVueGraphs"
              :key="'viz-vue-' + vizVueIndex"
            >
              <v-col>
                <vue-graph-by-name
                  :graph-name="graphName"
                  :values="result.items"
                />
              </v-col>
            </v-row>
            <v-row
              v-for="(src, vizUrlIndex) in vizUrls"
              :key="'viz-url-' + vizUrlIndex"
            >
              <v-col>
                <unit-iframe :src="src" :values="items" />
              </v-col>
            </v-row>
            <v-row v-if="showTable">
              <v-col>
                <unit-filterable-table v-bind="{ headers, items }" />
              </v-col>
            </v-row>
          </template>
          <template v-else>
            <v-row>
              <v-col>
                <p><i>No relevant data found</i></p>
              </v-col>
            </v-row>
          </template>
        </template>
      </v-card>
    </template>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import csvProcessors from '@/manifests/csv-processors'
export default {
  props: {
    visualizations: Object,
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
    inputFiles: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      result: undefined,
      finished: false
    }
  },
  computed: {
    headers() {
      const headers = this.result?.headers ? this.result?.headers : []
      const headersForTable = headers.map(h => ({ text: h, value: h }))
      return headersForTable
    },
    items() {
      return this.result?.items ? this.result?.items : []
    },
    exampleVisualizations() {
      const { name } = this.selectedExample
      return this.visualizations?.[name] || []
    },
    showTable() {
      return this.headers.length !== 0 && this.defaultViewElements.showTable
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
    },
    processedVegaItems() {
      return this.vegaFiles.map(specFile => {
        const processor = this.findProcessor(specFile)
        if (processor) {
          return processor(this.headers, this.items)[1]
        }
        return this.items
      })
    }
  },
  methods: {
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
      const { headers = [], items = [] } = result
      // Vuetify DataTable component expects text and value properties
      this.finished = true
      this.$emit('update', { index: this.index, headers, items })
    },
    onChangeSelector(query) {
      this.$emit('change', query)
    }
  }
}
</script>
