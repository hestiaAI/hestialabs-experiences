<!-- :change="v => (sparql = v)" -->
<template>
  <div>
    <h2 class="my-3">SPARQL</h2>
    <div class="d-flex flex-column flex-sm-row align-start align-sm-end">
      <slot
        name="selector"
        :change="onChangeSelector"
        classAttr="my-sm-2 mr-sm-2 mb-2"
      />
      <base-button
        v-bind="{ progress, status, error, disabled }"
        text="Run Query"
        icon="mdiStepForward"
        class="ma-sm-2"
        @click="runQuery"
      />
      <base-download-button
        extension="rq"
        :data="sparql"
        class="ma-sm-2"
        :disabled="!sparql"
      />
    </div>
    <v-text-field
      v-if="parametrized"
      v-model="queryParameter"
      :label="queryParameterName"
      class="my-sm-2 mr-sm-2"
    ></v-text-field>
    <code-editor
      :value.sync="sparql"
      class="mt-6"
      line-numbers
      language="sparql"
    />
    <v-alert v-if="message" type="error">{{ message }}</v-alert>
  </div>
</template>

<script>
import { queryHeadersItems } from '@/utils/sparql'
import { processError } from '@/utils/utils'

export default {
  props: {
    rdf: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sparql: '',
      parametrized: false,
      queryParameter: '',
      message: '',
      status: false,
      error: false,
      progress: false
    }
  },
  computed: {
    disabled() {
      return !this.rdf || !this.sparql
    },
    queryParameterName() {
      return this.sparql.match(/\$[a-zA-Z0-9]+\$/)[0].slice(1, -1)
    }
  },
  methods: {
    async runQuery() {
      try {
        this.message = ''
        this.error = false
        this.progress = true
        let sparql = this.sparql
        if (this.parametrized) {
          sparql = sparql.replace(/\$[a-zA-Z0-9]+\$/, this.queryParameter)
        }
        const [headers, items] = await queryHeadersItems(this.rdf, sparql)
        this.$emit('update', { headers, items })
      } catch (error) {
        console.error(error)
        this.error = true
        this.message = processError(error)
        this.$emit('update', { error })
      } finally {
        this.status = true
        this.progress = false
      }
    },
    onChangeSelector(event) {
      this.sparql = event.sparql
      this.parametrized = event.parametrized
      this.$emit('change', { name: event.name })
    }
  }
}
</script>
