<template>
  <div>
    <the-example-selector
      :value.sync="selectedExample"
      :items="examples"
      :disabled="examples.length === 1"
      class="mb-6 mt-4"
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
      <unit-rdf
        v-bind="{ rml, inputFiles }"
        class="mr-lg-6"
        @update="onUnitRdfUpdate"
      />
    </div>
    <v-expand-transition>
      <div v-show="toRDF" class="io-block" transition="expand-transition">
        <unit-sparql :rdf="rdf" class="mr-lg-6" @update="onUnitSparqlUpdate">
          <template #selector="{ change }">
            <the-sparql-selector
              :items="selectedExample.sparql"
              :disabled="!selectedExample.sparql.length"
              @change="change"
            />
          </template>
        </unit-sparql>
        <div class="mr-lg-6">
          <h2 class="my-3">Query Results</h2>
          <the-query-results-data-table
            v-bind="{ headers, items }"
            :hide-default-footer="!headers.length"
            :loading="false"
          />
        </div>
      </div>
    </v-expand-transition>

    <div class="io-block">
      <unit-retrieve-data :rdf="rdfAgg" @update="onUnitRetrieveDataUpdate" />
    </div>
    <v-expand-transition>
      <div class="io-block" transition="expand-transition">
        <unit-sparql
          :rdf="rdfAgg"
          class="mr-lg-6"
          @update="onUnitSparqlAggUpdate"
        >
          <template #selector="{ change }">
            <the-sparql-selector
              :items="selectedExample.sparql"
              :disabled="!selectedExample.sparql.length"
              @change="change"
            />
          </template>
        </unit-sparql>
        <div class="mr-lg-6">
          <h2 class="my-3">Aggregated Data Query Results</h2>
          <the-query-results-data-table
            :headers="headersAgg"
            :items="itemsAgg"
            :hide-default-footer="!headersAgg.length"
            :loading="false"
          />
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */

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
      toRDF: true,
      headers: [],
      items: [],
      rdfAgg: '',
      headersAgg: [],
      itemsAgg: []
    }
  },
  computed: {
    runQueryDisabled() {
      return !this.rdf
    }
  },
  methods: {
    onUnitRmlUpdate({ rml = '', error }) {
      this.rml = rml
    },
    onUnitFilesUpdate({ inputFilesRocketRML: i, error }) {
      this.inputFiles = i
    },
    onUnitRdfUpdate({ rdf = '', toRDF = this.toRDF, error }) {
      this.rdf = rdf
      this.toRDF = toRDF
    },
    onUnitSparqlUpdate({ headers = [], items = [], error }) {
      // Vuetify DataTable component expects text and value properties
      this.headers = headers.map(h => ({ text: h, value: h }))
      this.items = items
    },
    onUnitSparqlAggUpdate({ headers = [], items = [], error }) {
      this.headersAgg = headers.map(h => ({ text: h, value: h }))
      this.itemsAgg = items
    },
    onUnitRetrieveDataUpdate({ rdfAgg = '', error }) {
      this.rdfAgg = rdfAgg
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
