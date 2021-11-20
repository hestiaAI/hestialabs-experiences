<template>
  <div>
    <template v-if="customPipeline">
      <p>Advanced view not supported for this experience</p>
    </template>

    <template v-else>
      <v-row class="no-gutters">
        <v-col>
          <TheSelectorExample
            :value.sync="selectedExample"
            :items="examples"
            :disabled="examples.length === 1"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <UnitIntroduction :company-name="title" :data-portal="dataPortal" />
        </v-col>
      </v-row>

      <UnitRml
        :yarrrml-example="selectedExample.yarrrml"
        @update="onUnitRmlUpdate"
      />

      <v-row>
        <v-col cols="12" lg="6">
          <h2 class="my-3">Files</h2>
          <slot name="unit-files" :update="onUnitFilesUpdate" />
        </v-col>
        <v-col cols="12" lg="6">
          <UnitRdf v-bind="{ rml, inputFiles }" @update="onUnitRdfUpdate" />
        </v-col>
      </v-row>

      <UnitQuery
        v-bind="{
          selectedExample,
          visualizations,
          query,
          queryDisabled
        }"
        @change="onQueryChange"
      />
    </template>
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
    customPipeline: Function
  },
  data() {
    // main example is selected by default
    const selectedExample = this.examples[0]
    return {
      selectedExample,
      inputFiles: undefined,
      rml: '',
      query: null,
      queryDisabled: false
    }
  },
  methods: {
    onUnitRmlUpdate({ rml = '', error }) {
      this.rml = rml
    },
    onUnitFilesUpdate({ inputFiles: i, error }) {
      this.inputFiles = i
    },
    onUnitRdfUpdate({ toRDF, elapsed, error }) {
      if (!error) {
        console.info(`RDF updated. Time elapsed: ${elapsed}`)
        // disable query if output is JSON-LD
        this.queryDisabled = !toRDF
      } else {
        // disabled query if an error occurred
        this.queryDisabled = true
      }
    },
    onQueryChange(query) {
      this.query = query
    }
  }
}
</script>
