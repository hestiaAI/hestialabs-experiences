<template>
  <div>
    <h2 class="my-3">RDF</h2>
    <div class="d-flex flex-column flex-sm-row align-start">
      <v-select
        v-model="toRDF"
        :items="[
          { text: 'N-Quads', value: true },
          { text: 'JSON-LD', value: false }
        ]"
        style="max-width: 150px"
        hide-details
        label="Format"
        class="ma-sm-2"
      />
      <base-button
        v-bind="{ progress, status, error, disabled }"
        text="Generate RDF"
        class="ma-sm-2"
        @click="generateRDF"
      />
      <base-download-button
        :extension="extension"
        :data="rdf"
        :disabled="!rdf"
        class="ma-sm-2"
      />
    </div>
    <code-editor :value="message" :error="error" class="mt-6" readonly />
  </div>
</template>

<script>
import rdfUtils from '@/utils/rdf'

export default {
  props: {
    rml: {
      type: String,
      required: true
    },
    inputFiles: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      toRDF: true,
      message: '',
      status: false,
      error: false,
      progress: false
    }
  },
  computed: {
    disabled() {
      return !this.rml || !this.inputFiles || this.progress
    },
    extension() {
      if (this.error) {
        return
      }
      return this.toRDF ? 'nq' : 'jsonld'
    }
  },
  methods: {
    handleRdfData({ data, elapsed }) {
      this.rdf = data
      this.error = false
      const secs = elapsed / 1000
      this.message = `RDF generated successfully in ${secs} sec.`
    },
    handleRdfError(error) {
      console.error(error)
      this.error = true
      this.message = error
    },
    handleRdfEnd() {
      this.progress = false
      this.status = true
    },
    async generateRDF() {
      this.rdf = ''
      this.message = ''
      this.progress = true
      await rdfUtils.generateRDF(
        this.handleRdfData,
        this.handleRdfError,
        this.handleRdfEnd,
        this.rml,
        this.inputFiles,
        this.toRDF
      )
    }
  }
}
</script>
