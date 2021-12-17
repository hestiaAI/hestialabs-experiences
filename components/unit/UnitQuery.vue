<template>
  <div>
    <VCard v-if="defaultViewElements" class="pa-2 my-6">
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
            v-bind="{ allSparql, sparqlQuery, queryDisabled }"
            class="mr-lg-6"
            @update="onUnitResultsUpdate"
          />
        </VCol>
      </VRow>
      <template v-if="finished">
        <template v-if="hasData">
          <VRow>
            <VCol>
              <UnitVegaViz
                v-if="vizVega"
                :spec-file="vizVega"
                :data="result"
                class="text-center"
              />
              <ChartView
                v-else-if="vizVue"
                :graph-name="vizVue"
                :data="result"
                :viz-props="defaultViewElements.vizProps"
              />
              <UnitIframe v-else-if="vizUrl" :src="vizUrl" :data="result" />
            </VCol>
          </VRow>
          <VRow v-if="showTable">
            <VCol>
              <UnitFilterableTable :data="result" />
            </VCol>
          </VRow>
        </template>
        <template v-else>
          <VRow>
            <VCol class="text-center">
              <BaseAlert>No relevant data found</BaseAlert>
            </VCol>
          </VRow>
        </template>
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
    queryDisabled: {
      type: Boolean,
      default: false
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
      result: undefined,
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
    hasData() {
      return this.result && (this.result.headers?.length ?? 1) > 0
    }
  },
  methods: {
    onUnitResultsUpdate(result) {
      // Postprocessing
      if (this.defaultViewElements.postprocessor !== undefined) {
        result =
          this.postprocessors[this.defaultViewElements.postprocessor](result)
      }
      this.result = result
      this.finished = true
      this.$emit('update', { index: this.index, result })
    },
    onChangeSelector(query) {
      this.$emit('change', query)
    }
  }
}
</script>
