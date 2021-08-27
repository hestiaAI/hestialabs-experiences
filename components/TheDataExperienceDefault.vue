<template>
  <div>
    <slot name="unit-files" :update="onUnitFilesUpdate" />

    <base-download-button
      v-if="success"
      class="my-4"
      :data="rdf"
      extension="nq"
      text="Download RDF"
    />
    <template v-if="loading">
      <base-progress-circular class="ml-2" />
      <span>Generating Linked Data...</span>
    </template>
    <template v-else-if="error || success">
      <v-alert
        :type="error ? 'error' : 'success'"
        border="top"
        colored-border
        >{{ message }}</v-alert
      >
    </template>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import rdfUtils from '@/utils/rdf'
import parseYarrrml from '@/utils/parse-yarrrml'

function getErrorMessage(error) {
  return error instanceof Error ? error.message : error
}

export default {
  props: {
    examples: Array
  },
  data() {
    return {
      loading: false,
      error: false,
      success: false,
      message: '',
      rml: '',
      rdf: ''
    }
  },
  computed: {
    yarrrml() {
      // main example's YARRRML
      return this.examples.find(e => e.name === 'main').yarrrml
    }
  },
  watch: {
    yarrrml: {
      immediate: true,
      async handler(yarrrml) {
        // this should be quick ...
        this.rml = await parseYarrrml(yarrrml)
      }
    }
  },
  methods: {
    initState() {
      this.message = ''
      this.error = false
      this.success = false
      this.loading = true
    },
    handleRdfData({ data, elapsed }) {
      this.rdf = data
      this.success = true
      this.message = `Successfully processed in ${elapsed / 1000} sec.`
    },
    handleRdfError(error) {
      console.error(error)
      this.error = true
      this.message = getErrorMessage(error)
    },
    handleRdfEnd() {
      this.loading = false
    },
    async onUnitFilesUpdate({ inputFilesRocketRML }) {
      this.initState()
      try {
        if (!this.rml) {
          throw new Error('RML not ready')
        }
        await rdfUtils.generateRDF(
          this.handleRdfData,
          this.handleRdfError,
          this.handleRdfEnd,
          this.rml,
          inputFilesRocketRML
        )
      } catch (error) {
        console.error(error)
        this.error = true
        this.message = error instanceof Error ? error.message : error
        this.loading = false
      }
    }
  }
}
</script>
