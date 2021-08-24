<template>
  <div>
    <slot
      name="file-input"
      :loading="loading"
      :disabled="loading"
      :handle-files="onFileChange"
      :status="error || success"
      :error="error"
      :message="message"
    ></slot>

    <base-download-button
      v-if="success"
      class="my-4"
      :data="rdf"
      :mime-type="mimeType"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import processFiles from '@/utils/process-files'
import rdfUtils from '@/utils/rdf'

import parseYarrrml from '@/lib/parse-yarrrml'

function getErrorMessage(error) {
  return error instanceof Error ? error.message : error
}

export default {
  props: {
    examples: Array,
    extensions: Array,
    files: Array,
    isSingleFileExperience: Boolean,
    preprocessorFunc: Function
  },
  data() {
    return {
      loading: false,
      error: false,
      success: false,
      message: '',
      rdf: '',
      mimeType: 'application/n-quads'
    }
  },
  computed: {
    yarrrml() {
      // main example's YARRRML
      return this.examples.find(e => e.name === 'main').yarrrml
    }
  },
  methods: {
    initState() {
      this.message = ''
      this.error = false
      this.success = false
      this.loading = true
    },
    handleRdfData(data) {
      this.rdf = data
      this.success = true
    },
    handleRdfError(error) {
      console.error(error)
      this.error = true
      this.message = getErrorMessage(error)
    },
    handleRdfEnd() {
      this.loading = false
    },
    async onFileChange(submittedFiles) {
      this.initState()
      try {
        const { inputFilesRocketRML } = await processFiles(
          submittedFiles,
          this.files,
          true,
          this.extensions,
          this.preprocessorFunc,
          this.isSingleFileExperience
        )
        const rml = await parseYarrrml(this.yarrrml)
        await rdfUtils.generateRDF(
          this.handleRdfData,
          this.handleRdfError,
          this.handleRdfEnd,
          rml,
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
