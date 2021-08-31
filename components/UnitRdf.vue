<template>
  <div>
    <h2 class="my-3">RDF</h2>
    <div class="d-flex flex-column flex-sm-row align-start">
      <the-rdf-format-selector class="ma-sm-2" :value.sync="format" />
      <base-button
        v-bind="{ progress, status, error, disabled }"
        text="Generate RDF"
        class="ma-sm-2"
        @click="generateRDF"
      />
      <base-download-button
        v-bind="{ data, extension }"
        :disabled="!message"
        class="ma-sm-2"
      />
      <base-share-button
        v-bind="{ disabled }"
        :disabled="!message"
        class="ma-sm-2"
      />
    </div>
    <code-editor :value="message" :error="error" class="mt-6" readonly />
  </div>
</template>

<script>
import rdfUtils from '@/utils/rdf'
import { processError } from '@/utils/utils'

export default {
  props: {
    rml: {
      type: String,
      default: ''
    },
    inputFiles: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      format: {},
      message: '',
      status: false,
      error: false,
      progress: false,
      rdf: ''
    }
  },
  computed: {
    disabled() {
      return !this.rml || !this.inputFiles || this.progress
    },
    extension() {
      if (this.error) {
        // use default extension
        return
      }
      return this.format.ext
    },
    data() {
      // if there is an error, download the message, o/w the RDF
      return this.error ? this.message : this.rdf
    }
  },
  methods: {
    handleRdfData({ data: rdf, elapsed }) {
      this.error = false
      this.rdf = rdf
      const secs = elapsed / 1000
      const { text, toRDF } = this.format
      this.message = `RDF generated successfully in ${secs} sec. (Format: ${text})`
      this.$emit('update', { rdf, toRDF })
    },
    handleRdfError(error) {
      console.error(error)
      this.error = true
      this.message = processError(error)
      this.$emit('update', { error })
    },
    handleRdfEnd() {
      this.progress = false
      this.status = true
    },
    async generateRDF() {
      // let parent know generation started
      this.$emit('update', {})
      this.rdf = ''
      this.message = ''
      this.progress = true
      this.status = false
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
