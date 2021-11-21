<!-- :change="v => (sparql = v)" -->
<template>
  <div>
    <template v-if="$store.state.power">
      <h2 class="my-3">SPARQL</h2>
      <div class="d-flex flex-column flex-sm-row align-start align-sm-end">
        <TheSelectorSparql
          :items="selectedExample.sparql"
          :disabled="!selectedExample.sparql.length"
          class="my-sm-2 mr-sm-2 mb-2"
          @change="onChangeSelector"
        />
        <BaseButton
          v-bind="{ progress, status, error, disabled }"
          text="Run Query"
          icon="mdiStepForward"
          class="ma-sm-2"
          @click="runQuery"
        />
        <BaseButtonDownloadData
          extension="rq"
          :data="sparql"
          class="ma-sm-2"
          :disabled="!sparql"
        />
      </div>
      <VTextField
        v-if="parametrized"
        v-model="queryParameter"
        :label="queryParameterName"
        class="my-sm-2 mr-sm-2"
      ></VTextField>
      <CodeEditor
        :value.sync="code"
        class="mt-6"
        line-numbers
        language="sparql"
      />
      <VAlert v-if="message" type="error">{{ message }}</VAlert>
    </template>

    <template v-else>
      <VRow>
        <VCol cols="4" class="mx-auto">
          <VTextField
            v-if="parametrized"
            v-model="queryParameter"
            :label="queryParameterName"
            class="my-sm-2 mr-sm-2"
          ></VTextField>
        </VCol>
      </VRow>
      <VRow>
        <VCol align="center">
          <BaseButton
            v-bind="{ progress, status, error, disabled }"
            text="Run"
            icon="mdiStepForward"
            class="ma-sm-2"
            @click="runQuery"
          />
        </VCol>
      </VRow>
    </template>
  </div>
</template>

<script>
import quadstore from '@/utils/sparql'
import { processError } from '@/utils/utils'

export default {
  props: {
    selectedExample: {
      type: Object,
      default: null
    },
    query: {
      type: Object,
      default: null
    },
    queryDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      queryParameter: '',
      message: '',
      status: false,
      error: false,
      progress: false,
      code: ''
    }
  },
  computed: {
    disabled() {
      return !this.sparql || this.queryDisabled
    },
    queryParameterName() {
      return this.sparql.match(/\$[^$]+\$/)[0].slice(1, -1)
    },
    sparql() {
      return this.query?.sparql || ''
    },
    parametrized() {
      return this.query?.parametrized || false
    }
  },
  watch: {
    code(c) {
      const query = JSON.parse(JSON.stringify(this.query))
      query.sparql = c
      this.$emit('change', query)
    },
    query(q) {
      this.code = q.sparql
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
          sparql = sparql.replace(/\$[^$]+\$/, this.queryParameter)
        }

        const results = await quadstore.select(sparql)
        this.$emit('update', results)
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
    onChangeSelector(query) {
      this.$emit('change', query)
    }
  }
}
</script>
