<template>
  <div>
    <template v-if="$store.state.power">
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
        <template v-if="items.length">
          <v-col
            v-for="specFile in vegaFiles"
            :key="`viz-${query.name}-${specFile.name}`"
            cols="12"
            style="text-align: center"
          >
            <unit-vega-viz
              :spec-file="specFile"
              :values="items"
              :div-id="`viz-${query.name}-${specFile.name}`"
            />
          </v-col>
        </template>
      </v-row>
    </template>

    <template v-else>
      <v-card class="pa-2 my-6" align="center">
        <p>
          {{ defaultViewElements.text }}
        </p>
        <v-row>
          <v-col>
            <unit-sparql
              v-bind="{ rdf, selectedExample, query }"
              class="mr-lg-6"
              @update="onUnitSparqlUpdate"
            />
          </v-col>
        </v-row>
        <template v-if="finished">
          <template v-if="items.length">
            <v-row>
              <v-col
                v-for="specFile in vegaFiles"
                :key="`viz-${query.name}-${specFile.name}`"
                style="text-align: center"
              >
                <unit-vega-viz
                  :spec-file="specFile"
                  :values="items"
                  :div-id="`viz-${query.name}-${specFile.name}`"
                />
              </v-col>
            </v-row>
            <v-row v-if="showTable">
              <v-col>
                <unit-query-results v-bind="{ headers, items }" />
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
    defaultViewElements: {
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
      const exampleName = this.selectedExample.name
      return this.visualizations?.[exampleName] || {}
    },
    exampleProcessors() {
      const exampleName = this.selectedExample.name
      return this.csvProcessorNames?.[exampleName] || {}
    },
    showTable() {
      return this.headers.length !== 0 && this.defaultViewElements.showTable
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
      this.finished = true
    },
    onChangeSelector(query) {
      this.$emit('change', query)
    }
  }
}
</script>
