<template>
  <div>
    <div v-if="$store.state.power">
      <v-row>
        <v-col cols="12" lg="6">
          <unit-sparql
            v-bind="{ rdf, selectedExample, query }"
            class="mr-lg-6"
            @update="onUnitSparqlUpdate"
            @change="onChangeSelector"
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
          <unit-vega-viz
            v-if="items.length"
            :spec-file="specFile"
            :values="items"
          />
        </v-col>
      </v-row>
    </div>

    <div v-else>
      <div>
        {{ infoText }}
      </div>
      <v-row>
        <v-col>
          <unit-sparql
            v-bind="{ rdf, selectedExample, query }"
            class="mr-lg-6"
            @update="onUnitSparqlUpdate"
          />
        </v-col>
      </v-row>
      <v-row v-if="showTable">
        <v-col>
          <unit-query-results v-bind="{ headers, items }" />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="specFile in vegaFiles"
          :key="`spec-${specFile.name}`"
          style="text-align: center"
        >
          <unit-vega-viz
            v-if="items.length"
            :spec-file="specFile"
            :values="items"
          />
        </v-col>
      </v-row>
    </div>
  </div>
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
    },
    query: {
      type: Object,
      default: null
    },
    defaultView: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      headers: [],
      items: []
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
    },
    infoText() {
      return this.defaultView[this.query.name].text
    },
    showTable() {
      return (
        this.headers.length !== 0 && this.defaultView[this.query.name].showTable
      )
    },
    vegaFiles() {
      if (!this.query) {
        return []
      }
      const vizNames = this.exampleVisualizations[this.query.name]
      return this.selectedExample.vega.filter(s => vizNames?.includes(s.name))
    }
  },
  methods: {
    onUnitSparqlUpdate({ headers = [], items = [], error }) {
      // Pre-viz processing
      const processorName = this.exampleProcessors?.[this.query.name] || null
      if (processorName) {
        ;[headers, items] = csvProcessors[processorName](headers, items)
      }
      // Vuetify DataTable component expects text and value properties
      this.headers = headers.map(h => ({ text: h, value: h }))
      this.items = items
    },
    onChangeSelector(query) {
      this.$emit('change', query)
    }
  }
}
</script>
