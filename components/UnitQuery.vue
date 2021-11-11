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
        <template v-if="items.length">
          <v-col
            v-for="(specFile, index) in vegaFiles"
            :key="index"
            cols="12"
            style="text-align: center"
          >
            <unit-vega-viz
              :spec-file="specFile"
              :values="processedItems[index]"
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
          <template v-if="items.length">
            <v-row>
              <v-col
                v-for="(specFile, index) in vegaFiles"
                :key="'vega-' + index"
                style="text-align: center"
              >
                <unit-vega-viz
                  :spec-file="specFile"
                  :values="processedItems[index]"
                  :div-id="`viz-${i}-${specFile.name}`"
                />
              </v-col>
            </v-row>
            <v-row
              v-for="(graphName, index) in vueGraphNames"
              :key="'vue-' + index"
            >
              <v-col>
                <vue-graph-by-name
                  :graph-name="graphName"
                  :values="items"
                  :graph-id="defaultViewElements.graphId"
                />
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
import UnitFilterableTable from '~/components/UnitFilterableTable'

export default {
  components: { UnitFilterableTable },
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
    i: {
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
      headers: [],
      items: [],
      finished: false
    }
  },
  computed: {
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
    vueGraphNames() {
      return this.vizNames.filter(n => n.endsWith('.vue'))
    },
    vegaFiles() {
      return this.selectedExample.vega.filter(s =>
        this.vizNames.includes(s.name)
      )
    },
    processedItems() {
      // For each viz
      return this.vegaFiles.map(spec => {
        if (this.customPipeline === undefined) {
          // Find the viz definition for this query
          const preprocessor = this.exampleVisualizations.filter(
            v => this.query.name === v.query && spec.name === v.vega
          )
          // If it has a preprocessor defined, run it
          if (preprocessor.length === 1 && preprocessor[0].preprocessor) {
            return csvProcessors[preprocessor[0].preprocessor](
              this.headers,
              this.items
            )[1]
          }
        }
        return this.items
      })
    }
  },
  methods: {
    onUnitResultsUpdate({ headers = [], items = [], error }) {
      // Vuetify DataTable component expects text and value properties
      this.headers = headers.map(h => ({ text: h, value: h }))
      this.items = items
      this.finished = true
      this.$emit('update', { i: this.i, headers, items })
    },
    onChangeSelector(query) {
      this.$emit('change', query)
    }
  }
}
</script>
