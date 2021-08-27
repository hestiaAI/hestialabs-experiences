<template>
  <div>
    <the-example-selector
      :value.sync="selectedExample"
      :items="examples"
      :disabled="examples.length === 1"
    />

    <unit-rml
      :yarrrml-example="selectedExample.yarrrml"
      @update="onUnitRmlUpdate"
    />

    <div class="io-block">
      <div class="mr-lg-6">
        <h2 class="mb-2">Files</h2>

        <slot name="unit-files" :update="onUnitFilesUpdate" />
      </div>
      <unit-rdf v-bind="{ rml, inputFiles }" @update="onUnitRdfUpdate" />
    </div>
    <div class="io-block">
      <div class="mr-lg-6">
        <h2 class="my-3">SPARQL</h2>
        <div class="d-flex">
          <v-select
            v-model="sparql"
            :items="selectedExample.sparql"
            item-text="name"
            item-value="sparql"
            style="max-width: 150px"
            hide-details
            label="Select query"
            :disabled="!selectedExample.sparql.length"
            class="ma-2"
          />
          <base-button
            :disabled="runQueryDisabled"
            :progress="sparqlResultsLoading"
            :status="sparqlStatus"
            :error="sparqlError"
            text="Run Query"
            @click="runQuery"
          />
        </div>
        <code-editor
          :value.sync="sparql"
          class="mt-6"
          line-numbers
          language="sparql"
        />
      </div>
      <div class="mr-lg-6">
        <h2 class="my-3">Query Results</h2>
        <code-editor
          v-if="sparqlError"
          :value="sparqlErrorMessage"
          :error="sparqlError"
          class="mt-6"
          readonly
        />
        <the-query-results-data-table
          v-else
          :headers="sparqlResultsHeaders"
          :hide-default-footer="!sparqlResultsHeaders.length"
          :items="sparqlResultsItems"
          :loading="sparqlResultsLoading"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import query from '@/utils/sparql'

export default {
  props: {
    examples: Array
  },
  data() {
    // main example is selected by default
    const selectedExample = this.examples[0]
    return {
      selectedExample,
      inputFiles: undefined,
      rml: '',
      rdf: '',
      sparqlStatus: false,
      sparql: '',
      sparqlError: false,
      sparqlErrorMessage: '',
      sparqlResultsLoading: false,
      sparqlResultsHeaders: [],
      sparqlResultsItems: []
    }
  },
  computed: {
    runQueryDisabled() {
      return !this.rdf
    }
  },
  watch: {
    rml() {
      this.rdfGenerateStatus = false
      this.rdfGenerateMessage = ''
    },
    sparql() {
      this.sparqlStatus = false
    }
  },
  methods: {
    onUnitRmlUpdate({ rml = '', error }) {
      this.rml = rml
    },
    onUnitFilesUpdate({ inputFilesRocketRML: i, error }) {
      this.inputFiles = i
    },
    onUnitRdfUpdate({ rdf = '', error }) {
      this.rdf = rdf
    },
    async runQuery() {
      try {
        this.sparqlError = false
        this.sparqlResultsLoading = true
        const bindings = await query(this.rdf, this.sparql)
        if (bindings.length) {
          const headers = Array.from(bindings[0].keys())
          window.setTimeout(() => {
            this.sparqlResultsItems = bindings.map(map =>
              // map.get(k) returns an N3 Term
              // https://github.com/rdfjs/N3.js/blob/main/src/N3DataFactory.js
              Object.fromEntries(headers.map(h => [h, map.get(h).value]))
            )
            this.sparqlResultsHeaders = headers.map(h => ({
              text: h.substring(1),
              value: h
            }))

            this.sparqlResultsLoading = false
          }, 1000)
        }
      } catch (error) {
        console.error(error)
        this.sparqlError = true
        this.sparqlErrorMessage = error
        this.sparqlResultsLoading = false
      } finally {
        this.sparqlStatus = true
      }
    }
  }
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/settings/_variables'
.io-block
  display: flex
  flex-direction: column
  align-items: center
  > div
    width: 100%
@media #{map-get($display-breakpoints, 'lg-and-up')}
  .io-block
    flex-direction: row
    align-items: flex-start
    > div
      width: 50%
</style>
