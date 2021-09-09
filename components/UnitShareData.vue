<template>
  <div>
    <h2 class="my-3">Share Data</h2>
    <div class="d-flex flex-column flex-sm-row align-start">
      <slot name="selector" :change="v => (sparql = v)" class="ma-sm-2" />
      <base-button
        :progress="progress[0]"
        :status="status[0]"
        :error="error[0]"
        :disabled="disabledGenerate"
        text="Generate RDF"
        class="ma-sm-2"
        @click="constructRDF"
      />
      <base-button
        :progress="progress[1]"
        :status="status[1]"
        :error="error[1]"
        :disabled="disabledShare"
        text="Share"
        icon="mdiShareVariant"
        class="ma-sm-2"
        @click="share"
      />
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
import { updateEndpoint } from '~/utils/endpoint'

export default {
  props: {
    rdfInput: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sparql: '',
      progress: [false, false],
      status: [false, false],
      error: [false, false],
      rdfOutput: ''
    }
  },
  computed: {
    disabledGenerate() {
      const i = 0
      return !this.rdfInput || !this.sparql || this.progress[i]
    },
    disabledShare() {
      const i = 1
      return !this.rdfOutput || this.progress[i]
    }
  },
  methods: {
    async constructRDF() {
      const i = 0
      this.error[i] = false
      this.progress[i] = true
      try {
        this.rdfOutput = await construct(this.rdfInput, this.sparql)
      } catch (error) {
        console.error(error)
        this.error[i] = true
      }
      this.status[i] = true
      this.progress[i] = false
    },
    async share() {
      const i = 1
      this.error[i] = false
      this.progress[i] = true
      try {
        await updateEndpoint(this.rdfOutput)
      } catch (error) {
        console.error(error)
        this.error[i] = true
      }
      this.status[i] = true
      this.progress[i] = false
    }
  }
}
</script>
