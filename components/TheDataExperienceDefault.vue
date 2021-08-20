<template>
  <div>
    <slot
      name="file-input"
      :loading="loading"
      :disabled="loading"
      :on-file-change="onFileChange"
    ></slot>

    <div class="mt-6">
      <template v-if="error">
        <v-alert type="error">{{ error }}</v-alert>
      </template>
      <template v-else-if="success">
        <v-alert type="success">Success</v-alert>
        <base-button nuxt download :href="rdfHref">
          <v-icon left>
            mdi-download
          </v-icon>
          Download
        </base-button>
      </template>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import processFiles from '@/utils/process-files'
import rdfUtils from '@/utils/rdf'
import { createObjectURL, revokeObjectURL } from '@/utils/utils'

import parseYarrrml from '@/lib/parse-yarrrml'

function getErrorMessage(error) {
  return error instanceof Error ? error.message : error
}

export default {
  props: {
    accept: String,
    data: Array,
    examples: Array,
    ext: String,
    extensions: Array,
    files: Array,
    isSingleFileExperience: Boolean,
    label: String,
    multiple: Boolean,
    preprocessorFunc: Function
  },
  data() {
    return {
      loading: false,
      error: false,
      success: false,
      rdfHref: ''
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
      this.error = false
      this.success = false
      this.loading = true
      revokeObjectURL(this.rdfHref)
    },
    handleRdfData(data) {
      // handle data
      this.rdfHref = createObjectURL(data, 'application/n-quads')

      this.success = true
    },
    handleRdfError(error) {
      console.error(error)
      this.error = getErrorMessage(error)
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
          this.ext,
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
        this.error = error instanceof Error ? error.message : error
        this.loading = false
      }
    }
  }
}
</script>
