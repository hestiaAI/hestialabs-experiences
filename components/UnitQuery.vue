<template>
  <div>
    <!-- advanced view -->
    <template v-if="$store.state.power">
      <v-row>
        <v-col cols="12" lg="6">
          <unit-custom-pipeline
            v-if="customPipeline"
            v-bind="{ fileManager, customPipeline }"
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
          <unit-filterable-table :data="result" />
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
              :data="result"
              :div-id="`viz-${index}-${specFile.name}`"
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
                fileManager,
                customPipeline,
                parameterName: defaultViewElements.parameterName
              }"
              @update="onUnitResultsUpdate"
            />
            <unit-sql
              v-else-if="sql"
              v-bind="{
                sql,
                parameterName: defaultViewElements.parameterName,
                parameterKey: defaultViewElements.parameterKey
              }"
              @update="onUnitResultsUpdate"
            />
            <unit-sparql
              v-else
              v-bind="{ allSparql, sparqlQuery, queryDisabled }"
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
                  :data="result"
                  :div-id="`viz-${index}-${vegaIndex}`"
                />
              </v-col>
            </v-row>
            <v-row
              v-for="(graphName, vizVueIndex) in vizVueGraphs"
              :key="'viz-vue-' + vizVueIndex"
            >
              <v-col>
                <vue-graph-by-name :graph-name="graphName" :data="result" />
              </v-col>
            </v-row>
            <v-row
              v-for="(src, vizUrlIndex) in vizUrls"
              :key="'viz-url-' + vizUrlIndex"
            >
              <v-col>
                <unit-iframe :src="src" :data="result" />
              </v-col>
            </v-row>
            <v-row v-if="showTable">
              <v-col>
                <unit-filterable-table :data="result" />
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
import FileManager from '~/utils/file-manager'

export default {
  props: {
    visualizations: {
      type: Array,
      default: () => []
    },
    sparqlQuery: {
      type: String,
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
    sql: {
      type: String,
      default: ''
    },
    fileManager: {
      type: FileManager,
      required: true
    },
    vega: {
      type: Object,
      default: () => {}
    },
    allSparql: {
      // Only used by the advanced view
      type: Object,
      default: () => {}
    },
    postprocessors: {
      type: Object,
      default: () => {}
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
      return this.visualizations ?? []
    },
    showTable() {
      return this.defaultViewElements.showTable
    },
    vizNames() {
      return this.defaultViewElements.visualizations ?? []
    },
    vizUrls() {
      return this.vizNames.filter(n => n.startsWith('/'))
    },
    vizVueGraphs() {
      return this.vizNames.filter(n => n.endsWith('.vue'))
    },
    vegaFiles() {
      return this.vizNames.map(n => this.vega[n]).filter(n => n)
    }
  },
  methods: {
    onUnitResultsUpdate(result) {
      // Postprocessing
      if (this.defaultViewElements.postprocessor !== undefined) {
        result =
          this.postprocessors[this.defaultViewElements.postprocessor](result)
      }
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
