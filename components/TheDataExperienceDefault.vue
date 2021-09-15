<template>
  <div>
    <slot name="unit-files" :update="onUnitFilesUpdate" />

    <div class="mt-6">
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
      <template v-if="progressQuery">
        <base-progress-circular class="mr-2" />
        <span>Generating Graphs...</span>
      </template>
      <template v-if="successQuery">
        <unit-vega-viz
          v-for="specFile in vegaFiles"
          :key="`spec-${specFile.name}`"
          :spec-file="specFile"
          :values="items"
        />
      </template>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import rdfUtils from '@/utils/rdf'
import parseYarrrml from '@/utils/parse-yarrrml'
import { queryHeadersItems } from '@/utils/sparql'

const DEFAULT_EXAMPLE = 'main'
const DEFAULT_QUERY = 'all'

function getErrorMessage(error) {
  return error instanceof Error ? error.message : error
}

export default {
  props: {
    examples: Array,
    visualizations: Object
  },
  data() {
    return {
      progress: false,
      error: false,
      success: false,
      message: '',
      progressQuery: false,
      errorQuery: false,
      successQuery: false,
      rml: '',
      rdf: '',
      headers: [],
      items: []
    }
  },
  computed: {
    example() {
      return this.examples.find(e => e.name === DEFAULT_EXAMPLE)
    },
    exampleSparql() {
      return this.example.sparql.find(e => e.name === DEFAULT_QUERY)
    },
    exampleVisualizations() {
      return this.visualizations?.[this.example.name] || {}
    },
    vegaFiles() {
      const vizNames = this.exampleVisualizations[this.exampleSparql.name]
      return this.example.vega.filter(s => vizNames?.includes(s.name))
    }
  },
  watch: {
    example: {
      immediate: true,
      async handler(example) {
        // this should be quick ...
        this.rml = await parseYarrrml(example.yarrrml)
      }
    },
    rdf: {
      async handler(rdf) {
        await this.runQuery()
      }
    }
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
      if (error) {
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
    },
    async runQuery() {
      this.errorQuery = false
      this.successQuery = false
      this.progressQuery = true
      try {
        const [headers, items] = await queryHeadersItems(
          this.rdf,
          this.exampleSparql.sparql
        )
        this.headers = headers
        this.items = items
        this.successQuery = true
      } catch (error) {
        console.error(error)
        this.errorQuery = true
      }
      this.progressQuery = false
    }
  }
}
</script>
