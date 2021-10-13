<template>
  <div>
    <v-row>
      <v-col cols="12 mx-auto" sm="6">
        <unit-introduction :company-name="title" :data-portal="dataPortal" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12 mx-auto" sm="6">
        <slot name="unit-files" :update="onUnitFilesUpdate" />
        <template v-if="progress">
          <base-progress-circular class="mr-2" />
          <span>Generating Linked Data...</span>
        </template>
        <template v-else-if="error || success">
          <v-alert
            :type="error ? 'error' : 'success'"
            border="top"
            colored-border
            max-width="600"
            >{{ message }}</v-alert
          >
        </template>
      </v-col>
    </v-row>
    <template v-if="success">
      <v-row v-for="(defaultViewElements, index) in defaultView" :key="index">
        <v-col>
          <unit-query
            :query="queries[index]"
            v-bind="{
              selectedExample,
              rdf,
              visualizations,
              defaultViewElements
            }"
          />
        </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col class="col-sm-6 col-12 mx-auto">
        <div ref="graph"></div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import * as d3 from 'd3'
import rdfUtils from '@/utils/rdf'
import parseYarrrml from '@/utils/parse-yarrrml'

function getErrorMessage(error) {
  return error instanceof Error ? error.message : error
}

export default {
  props: {
    examples: Array,
    visualizations: Object,
    defaultView: Array,
    title: String,
    dataPortal: String
  },
  data() {
    // main example is selected by default
    const selectedExample = this.examples[0]
    return {
      selectedExample,
      progress: false,
      error: false,
      success: false,
      message: '',
      rml: '',
      rdf: ''
    }
  },
  computed: {
    queries() {
      return this.defaultView.map(o =>
        this.selectedExample.sparql.find(s => s.name === o.query)
      )
      // return this.selectedExample.sparql.filter(s =>
      //   Object.keys(this.defaultView).includes(s.name)
      // )
    }
  },
  watch: {
    selectedExample: {
      immediate: true,
      async handler(selectedExample) {
        // this should be quick ...
        this.rml = await parseYarrrml(selectedExample.yarrrml)
      }
    }
  },
  mounted() {
    const d3File = this.selectedExample.d3.find(d => d.name === 'bar-chart.d3')
    const data = [44, 8, 15, 16, 23, 42]
    const chart = d3File.module
      .default()
      .height(300)
      .width(this.$refs.graph.clientWidth)
    d3.select(this.$refs.graph).datum(data).call(chart)
  },
  methods: {
    initState() {
      this.message = ''
      this.error = false
      this.success = false
      this.progress = true
    },
    handleRdfData({ data, elapsed }) {
      this.rdf = data
      this.success = true
      this.message = `Successfully processed in ${elapsed / 1000} sec.`
    },
    handleRdfError(error) {
      console.error(error)
      this.error = true
      this.message = getErrorMessage(error)
    },
    handleRdfEnd() {
      this.progress = false
    },
    async onUnitFilesUpdate({ inputFilesRocketRML, error }) {
      this.initState()
      if (Object.keys(inputFilesRocketRML).length === 0) {
        this.error = true
        this.message = 'No relevant files were found'
        this.progress = false
      } else if (error) {
        this.error = true
        this.message = error
        this.progress = false
      } else if (!this.rml) {
        throw new Error('RML not ready')
      } else {
        try {
          await rdfUtils.generateRDF(
            this.handleRdfData,
            this.handleRdfError,
            this.handleRdfEnd,
            this.rml,
            inputFilesRocketRML
          )
        } catch (error) {
          console.error(error)
          this.error = true
          this.message = error instanceof Error ? error.message : error
          this.progress = false
        }
      }
    }
  }
}
</script>
