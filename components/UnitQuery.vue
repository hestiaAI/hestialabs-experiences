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
export default {
  // TODO refactoring: turn these props into data once everything works
  props: {
    selectedExample: {
      type: Object,
      required: true
    },
    rdf: {
      type: String,
      required: true
    },
    vegaFiles: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    onUnitSparqlUpdate({ headers = [], items = [], error }) {
      this.$emit('update', { headers, items })
    },
    onSparqlSelectorChange({ name = '' }) {
      this.$emit('change', { name })
    }
  }
}
</script>
