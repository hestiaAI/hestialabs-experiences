<template>
  <div>
    <v-row class="no-gutters">
      <v-col>
        <the-example-selector
          :value.sync="selectedExample"
          :items="examples"
          :disabled="examples.length === 1"
        />
      </v-col>
    </v-row>

    <unit-rml
      :yarrrml-example="selectedExample.yarrrml"
      @update="onUnitRmlUpdate"
    />

    <v-row>
      <v-col cols="12" lg="6">
        <h2 class="my-3">Files</h2>
        <slot name="unit-files" :update="onUnitFilesUpdate" />
      </v-col>
      <v-col cols="12" lg="6">
        <unit-rdf v-bind="{ rml, inputFiles }" @update="onUnitRdfUpdate" />
      </v-col>
    </v-row>
    <v-row v-show="toRDF">
      <v-col cols="12" lg="6">
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
      </v-col>
      <v-col cols="12" lg="6">
        <unit-query-results v-bind="{ headers, items }" />
      </v-col>
      <v-col
        v-for="specFile in vegaFiles"
        :key="`spec-${specFile.name}`"
        cols="12"
        style="text-align: center"
      >
        <unit-vega-viz :spec-file="specFile" :values="items" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="6">
        <unit-share-data
          :rdf-input="rdf"
          :example="selectedExample"
        ></unit-share-data>
      </v-col>
    </v-row>

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
