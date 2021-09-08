<template>
  <div>
    <h2 class="my-3">Share Data</h2>
    <div class="d-flex flex-column flex-sm-row align-start">
      <base-button
        v-bind="{ progress, status, error, disabled }"
        text="Generate RDF"
        class="ma-sm-2"
        @click="constructRDF"
      />
      <base-share-button :data="rdfOutput" class="ma-sm-2" />
      <base-download-button
        extension="nq"
        :data="rdfOutput"
        :disabled="!rdfOutput"
        class="ma-sm-2"
      />
    </div>
    <code-editor
      :value.sync="sparql"
      class="mt-6"
      line-numbers
      language="sparql"
      readonly
    />
  </div>
</template>

<script>
import { construct } from '@/utils/sparql'

export default {
  props: {
    rdfInput: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sparql: 'CONSTRUCT WHERE { ?s ?p ?o }',
      status: false,
      error: false,
      progress: false,
      rdfOutput: ''
    }
  },
  computed: {
    disabled() {
      return !this.rdfInput || this.progress
    }
  },
  methods: {
    async constructRDF() {
      this.progress = true
      this.status = false
      this.error = false
      try {
        this.rdfOutput = await construct(this.rdfInput, this.sparql)
      } catch (error) {
        console.error(error)
        this.error = true
      }
      this.progress = false
      this.status = true
    }
  }
}
</script>
