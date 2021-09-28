<template>
  <v-row>
    <v-col cols="12" lg="6">
      <unit-sparql
        :rdf="rdf"
        :selected-example="selectedExample"
        class="mr-lg-6"
        @update="onUnitSparqlUpdate"
        @change="onSparqlSelectorChange"
      />
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
</template>

<script>
import csvProcessors from '@/manifests/csv-processors'

export default {
  props: {
    selectedExample: {
      type: Object,
      required: true
    },
    rdf: {
      type: String,
      required: true
    },
    visualizations: {
      type: Object,
      required: true
    },
    csvProcessorNames: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      headers: [],
      items: [],
      vegaFiles: [],
      queryName: ''
    }
  },
  computed: {
    exampleVisualizations() {
      const exampleName = this.selectedExample.name
      return this.visualizations?.[exampleName] || {}
    },
    exampleProcessors() {
      const exampleName = this.selectedExample.name
      return this.csvProcessorNames?.[exampleName] || {}
    }
  },
  methods: {
    onUnitSparqlUpdate({ headers = [], items = [], error }) {
      // Pre-viz processing
      const processorName = this.exampleProcessors?.[this.queryName] || null
      if (processorName) {
        ;[headers, items] = csvProcessors[processorName](headers, items)
      }
      // Vuetify DataTable component expects text and value properties
      this.headers = headers.map(h => ({ text: h, value: h }))
      this.items = items
    },
    onSparqlSelectorChange({ name = '' }) {
      // Select relevant visualizations
      this.queryName = name
      const vizNames = this.exampleVisualizations[name]
      this.vegaFiles = this.selectedExample.vega.filter(s =>
        vizNames?.includes(s.name)
      )
    }
  }
}
</script>
