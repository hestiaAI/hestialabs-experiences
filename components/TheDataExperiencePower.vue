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
        <h2 class="my-3">Files</h2>
        <slot name="unit-files" :update="onUnitFilesUpdate" />
      </div>
      <unit-rdf v-bind="{ rml, inputFiles }" @update="onUnitRdfUpdate" />
    </div>
    <v-expand-transition>
      <div v-show="toRDF" class="io-block">
        <unit-sparql
          :rdf="rdf"
          class="mr-lg-6"
          @update="onUnitSparqlUpdate"
          @change="onSparqlSelectorChange"
        >
          <template #selector="{ change, classAttr }">
            <sparql-selector
              :items="selectedExample.sparql"
              :disabled="!selectedExample.sparql.length"
              :class="classAttr"
              @change="change"
            />
          </template>
        </unit-sparql>
        <unit-query-results v-bind="{ headers, items }" />
      </div>
    </v-expand-transition>

    <unit-vega-viz
      v-for="specFile in vegaFiles"
      :key="`spec-${specFile.name}`"
      :spec-file="specFile"
      :values="items"
    />

    <div class="io-block">
      <unit-share-data
        :rdf-input="rdf"
        :example="selectedExample"
      ></unit-share-data>
    </div>

    <block-public-data
      :rdf-local="rdf"
      :example="selectedExample"
    ></block-public-data>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  props: {
    examples: Array,
    visualizations: Object
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
      vegaFiles: []
    }
  },
  computed: {
    runQueryDisabled() {
      return !this.rdf
    },
    exampleVisualizations() {
      const exampleName = this.selectedExample.name
      return this.visualizations?.[exampleName] || {}
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
    onSparqlSelectorChange({ name = '' }) {
      const vizNames = this.exampleVisualizations[name]
      this.vegaFiles = this.selectedExample.vega.filter(s =>
        vizNames?.includes(s.name)
      )
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
