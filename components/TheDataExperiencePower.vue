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

    <v-row>
      <v-col>
        <unit-introduction :company-name="title" :data-portal="dataPortal" />
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

    <unit-query
      v-bind="{
        selectedExample,
        rdf,
        visualizations,
        query
      }"
      @change="onQueryChange"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  props: {
    examples: Array,
    visualizations: Object,
    title: String,
    dataPortal: String,
    queryShortcut: Boolean
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
      query: null
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
    onQueryChange(query) {
      this.query = query
    }
  }
}
</script>
