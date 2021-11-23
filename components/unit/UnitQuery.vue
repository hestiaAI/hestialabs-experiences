<template>
  <div>
    <!-- advanced view -->
    <template v-if="$store.state.power">
      <VRow>
        <VCol cols="12" lg="6">
          <UnitCustomPipeline
            v-if="customPipeline"
            v-bind="{ fileManager, customPipeline }"
            @update="onUnitResultsUpdate"
          />
          <UnitSparql
            v-else
            v-bind="{ selectedExample, query, queryDisabled }"
            class="mr-lg-6"
            @update="onUnitResultsUpdate"
            @change="onChangeSelector"
          />
        </VCol>
        <VCol cols="12" lg="6">
          <UnitFilterableTable :data="result" />
        </VCol>
        <template v-if="result">
          <VCol
            v-for="(specFile, vegaIndex) in vegaFiles"
            :key="vegaIndex"
            cols="12"
            style="text-align: center"
          >
            <UnitVegaViz
              :spec-file="specFile"
              :data="result"
              :div-id="`viz-${index}-${specFile.name}`"
            />
          </VCol>
        </template>
      </VRow>
    </template>

    <!-- default view -->
    <template v-else>
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
                parameterName: defaultViewElements.parameterName
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
              <VCol
                v-for="(specFile, vegaIndex) in vegaFiles"
                :key="'vega-' + vegaIndex"
                style="text-align: center"
              >
                <UnitVegaViz
                  :spec-file="specFile"
                  :data="result"
                  :div-id="`viz-${index}-${vegaIndex}`"
                />
              </VCol>
            </VRow>
            <VRow
              v-for="(graphName, vizVueIndex) in vizVueGraphs"
              :key="'viz-vue-' + vizVueIndex"
            >
              <VCol>
                <ChartView :graph-name="graphName" :data="result" />
              </VCol>
            </VRow>
            <VRow
              v-for="(src, vizUrlIndex) in vizUrls"
              :key="'viz-url-' + vizUrlIndex"
            >
              <VCol>
                <UnitIframe :src="src" :data="result" />
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
              <VCol style="text-align: center">
                <p><i>No relevant data found</i></p>
              </VCol>
            </VRow>
          </template>
        </template>
      </VCard>
    </template>
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
    allSparql: {
      // Only used by the advanced view
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
    vizNames() {
      return this.defaultViewElements.visualizations ?? []
    },
    vizUrls() {
      return this.vizNames.filter(n => n.startsWith('/'))
    },
    vizVueGraphs() {
      return this.vizNames.filter(n => n.endsWith('.vue'))
    },
    vegaFiles() {
      return this.vizNames.map(n => this.vega[n]).filter(n => n)
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
