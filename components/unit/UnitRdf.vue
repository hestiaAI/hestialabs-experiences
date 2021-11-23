<template>
  <div>
    <h2 class="my-3">RDF</h2>
    <div class="d-flex flex-column flex-sm-row align-start align-sm-end">
      <TheSelectorRdfFormat class="my-sm-2 mr-sm-2 mb-2" :value.sync="format" />
      <BaseButton
        v-bind="{ progress, status, error, disabled }"
        text="Generate RDF"
        icon="mdiStepForward"
        class="ma-sm-2"
        @click="generateRDF"
      />
      <BaseButtonDownloadData
        v-bind="{ data, extension }"
        :disabled="!message"
        class="ma-sm-2"
      />
    </div>
    <CodeEditor :value="message" :error="error" class="mt-6" readonly />
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
      output: ''
    }
  },
  computed: {
    disabled() {
      return (
        !this.rml ||
        !this.inputFiles ||
        this.progress ||
        Object.keys(this.inputFiles).length === 0
      )
    },
    extension() {
      if (this.error) {
        // use default extension
        return
      }
      return this.format.ext
    },
    data() {
      // if there is an error, download the message, o/w the N-QUADS/JSON-lD
      return this.error ? this.message : this.output
    }
  },
  methods: {
    handleRdfData({ rdf, jsonld, elapsed }) {
      this.error = false
      // output is either RDF (N-QUADS) or JSON-LD
      this.output = rdf || jsonld
      const secs = elapsed / 1000
      const { text, toRDF } = this.format
      this.message = `RDF generated successfully in ${secs} sec. (Format: ${text})`
      this.$emit('update', { elapsed, toRDF })
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
    generateRDF() {
      // let parent know generation started
      this.$emit('update', {})
      this.rdf = ''
      this.message = ''
      this.progress = true
      this.status = false
      rdfUtils.generateRDF(
        this.handleRdfData,
        this.handleRdfError,
        this.handleRdfEnd,
        this.rml,
        this.inputFiles,
        this.format.toRDF
      )
    }
  }
}
</script>
