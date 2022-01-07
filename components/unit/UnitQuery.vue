<template>
  <div>
    <VCard v-if="defaultViewElements">
      <VCardTitle class="justify-center">{{
        defaultViewElements.title
      }}</VCardTitle>
      <VRow>
        <VCol cols="8" class="mx-auto">
          {{ defaultViewElements.text }}
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <UnitCustomPipeline
            v-if="customPipeline !== undefined"
            v-bind="{
              fileManager,
              customPipeline,
              parameterName: defaultViewElements.parameterName,
              defaultViewElements
            }"
            @update="onUnitResultsUpdate"
          />
          <UnitSql
            v-else-if="sql"
            v-bind="{
              sql,
              parameterName: defaultViewElements.parameterName,
              parameterKey: defaultViewElements.parameterKey
            }"
            @update="onUnitResultsUpdate"
          />
          <UnitSparql
            v-else
            v-bind="{ sparqlQuery }"
            class="mr-lg-6"
            @update="onUnitResultsUpdate"
          />
        </VCol>
      </VRow>
      <template v-if="finished">
        <VRow>
          <VCol>
            <UnitVegaViz
              v-if="vizVega"
              :spec-file="vizVega"
              :data="clonedResult"
              class="text-center"
            />
            <ChartView
              v-else-if="vizVue"
              :graph-name="vizVue"
              :data="clonedResult"
              :viz-props="defaultViewElements.vizProps"
            />
            <UnitIframe v-else-if="vizUrl" :src="vizUrl" :data="clonedResult" />
          </VCol>
        </VRow>
        <VRow v-if="showTable">
          <VCol>
            <UnitFilterableTable :data="result" />
          </VCol>
        </VRow>
      </template>
      <template v-else-if="error">
        <BaseAlert type="error">{{ error }}</BaseAlert>
      </template>
    </VCard>
  </div>
</template>

<script>
import FileManager from '~/utils/file-manager'

export default {
  props: {
    sparqlQuery: {
      type: String,
      default: null
    },
    defaultViewElements: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: 0
    },
    customPipeline: {
      type: Function,
      default: undefined
    },
    sql: {
      type: String,
      default: ''
    },
    fileManager: {
      type: FileManager,
      required: true
    },
    vega: {
      type: Object,
      default: () => {}
    },
    postprocessors: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      error: false,
      finished: false
    }
  },
  computed: {
    showTable() {
      return this.defaultViewElements.showTable
    },
    vizName() {
      return this.defaultViewElements.visualization
    },
    vizUrl() {
      return this.vizName?.startsWith('/') ? this.vizName : undefined
    },
    vizVue() {
      return this.vizName?.endsWith('.vue') ? this.vizName : undefined
    },
    vizVega() {
      return this.vega[this.vizName]
    },
    result: {
      get() {
        return this.$store.state.results[this.$route.params.key][
          this.defaultViewElements.key
        ]
      },
      set(result) {
        this.$store.commit('setResult', {
          company: this.$route.params.key,
          experience: this.defaultViewElements.key,
          result
        })
      }
    },
    clonedResult() {
      return JSON.parse(JSON.stringify(this.result))
    }
  },
  methods: {
    onUnitResultsUpdate(result) {
      if (result.error) {
        this.finished = false
        this.error = result.error
      } else {
        // Postprocessing
        if (this.defaultViewElements.postprocessor !== undefined) {
          result =
            this.postprocessors[this.defaultViewElements.postprocessor](result)
        }
        this.result = result
        this.finished = true
        this.error = false
      }
    }
  }
}
</script>
