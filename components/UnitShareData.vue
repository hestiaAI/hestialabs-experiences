<template>
  <div>
    <h2 class="my-3">Share Data</h2>
    <div class="d-flex flex-column flex-sm-row align-start">
      <v-text-field
        v-model="username"
        label="Username"
        class="ma-sm-2"
      ></v-text-field>
    </div>
    <div class="d-flex flex-column flex-sm-row align-start">
      <base-button
        :progress="progressGenerate"
        :status="statusGenerate"
        :error="errorGenerate"
        :disabled="disabledGenerate"
        text="Generate RDF"
        icon="mdiStepForward"
        class="ma-sm-2"
        @click="constructRDF"
      />
      <base-button
        :progress="progressShare"
        :status="statusShare"
        :error="errorShare"
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
    <div class="d-flex flex-column flex-sm-row align-start">
      <slot name="selector" :change="v => (sparql = v)" class="ma-sm-2" />
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
import { updateEndpoint } from '@/utils/endpoint'
import { personalizeRDF } from '@/utils/sharing'

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
      progressGenerate: false,
      statusGenerate: false,
      errorGenerate: false,
      progressShare: false,
      statusShare: false,
      errorShare: false,
      rdfOutput: '',
      username: ''
    }
  },
  computed: {
    disabledGenerate() {
      return (
        !this.rdfInput ||
        !this.sparql ||
        !this.username ||
        this.progressGenerate
      )
    },
    disabledShare() {
      return !this.rdfOutput || this.progressShare
    }
  },
  methods: {
    async constructRDF() {
      this.errorGenerate = false
      this.progressGenerate = true
      try {
        const rdf = personalizeRDF(this.username, this.rdfInput)
        this.rdfOutput = await construct(rdf, this.sparql)
      } catch (error) {
        console.error(error)
        this.errorGenerate = true
      }
      this.statusGenerate = true
      this.progressGenerate = false
    },
    async share() {
      this.errorShare = false
      this.progressShare = true
      try {
        await updateEndpoint(this.rdfOutput)
      } catch (error) {
        console.error(error)
        this.errorShare = true
      }
      this.statusShare = true
      this.progressShare = false
    }
  }
}
</script>
