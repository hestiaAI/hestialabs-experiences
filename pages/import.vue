<template>
  <div>
    <h2 class="mt-6">Import</h2>
    <p>
      Please provide a ZIP file containing exported results and the associated
      consent form.
    </p>
    <VFileInput v-model="inputZIP" label="ZIP file"></VFileInput>
    <BaseButton
      text="Import"
      v-bind="{ status, error, progress, disabled: !inputZIP }"
      @click="importZIP"
    />
    <p v-if="error">{{ message }}</p>
    <template v-if="status && !error">
      <VCard class="pa-2 my-6">
        <!-- Experience details -->
        <VCardTitle class="justify-center">Experience Details</VCardTitle>
        <VListItem two-line>
          <VListItemContent>
            <VListItemTitle>Experience</VListItemTitle>
            <VListItemSubtitle>{{ experience.key }}</VListItemSubtitle>
          </VListItemContent>
        </VListItem>
        <VListItem two-line>
          <VListItemContent>
            <VListItemTitle>Date</VListItemTitle>
            <VListItemSubtitle>{{
              new Date(experience.timestamp)
            }}</VListItemSubtitle>
          </VListItemContent>
        </VListItem>
        <VListItem two-line>
          <VListItemContent>
            <VListItemTitle>Version</VListItemTitle>
            <VListItemSubtitle>{{ experience.version }}</VListItemSubtitle>
          </VListItemContent>
        </VListItem>
      </VCard>

      <!-- Consent log -->
      <VCard class="pa-2 my-6">
        <VCardTitle class="justify-center">Consent Log</VCardTitle>
        <VCardText>
          <UnitConsentFormSection
            v-for="(section, index) in consent"
            :key="`section-${index}`"
            v-bind="{ section, index, readonly: true, fileManager }"
          />
        </VCardText>
      </VCard>

      <!-- Results -->
      <VCard
        v-for="(result, resultIndex) in sortedResults"
        :key="resultIndex"
        class="pa-2 my-6"
      >
        <VCardTitle class="justify-center">{{ result.title }}</VCardTitle>
        <VRow>
          <VCol>
            <UnitVegaViz
              v-if="allVizVega[resultIndex]"
              :spec-file="allVizVega[resultIndex]"
              :data="result.result"
              :div-id="`viz-${resultIndex}`"
              class="text-center"
            />
            <ChartView
              v-else-if="allVizVue[resultIndex]"
              :graph-name="allVizVue[resultIndex]"
              :data="result.result"
              :viz-props="result.vizProps"
            />
            <UnitIframe
              v-else-if="allVizUrl[resultIndex]"
              :src="allVizUrl[resultIndex]"
              :data="result.result"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <UnitFilterableTable :data="result.result" />
          </VCol>
        </VRow>
      </VCard>

      <!-- File explorer -->
      <VRow v-if="hasFileExplorer">
        <VCol>
          <UnitFileExplorer v-bind="{ fileManager, selectable: false }" />
        </VCol>
      </VRow>
    </template>
  </div>
</template>

<script>
import JSZip from 'jszip'
import FileManager from '~/utils/file-manager'

export default {
  data() {
    return {
      inputZIP: null,
      status: false,
      error: false,
      progress: false,
      message: '',
      experience: null,
      results: null,
      consent: null,
      fileManager: null
    }
  },
  computed: {
    manifest() {
      return this.$store.getters.manifest({
        params: { key: this.experience.key }
      })
    },
    allVizVega() {
      return this.sortedResults.map(r => this.manifest.vega[r.visualization])
    },
    allVizUrl() {
      return this.sortedResults.map(r =>
        r.visualization?.startsWith('/') ? r.visualization : undefined
      )
    },
    allVizVue() {
      return this.sortedResults.map(r =>
        r.visualization?.endsWith('.vue') ? r.visualization : undefined
      )
    },
    sortedResults() {
      return this.results.slice(0).sort((a, b) => a.index - b.index)
    },
    hasFileExplorer() {
      return this.fileManager?.fileList.length > 0
    }
  },
  methods: {
    handleError(error, message) {
      console.error(error)
      this.error = true
      this.message = message === undefined ? error.message : message
      this.handleEnd()
    },
    handleEnd() {
      this.status = true
      this.progress = false
    },
    async importZIP() {
      this.status = false
      this.error = false
      this.message = ''
      this.progress = true
      if (!this.inputZIP) {
        this.handleError(new Error('No ZIP provided'))
        return
      }

      // Load ZIP
      const zip = new JSZip()
      try {
        await zip.loadAsync(this.inputZIP)
      } catch (error) {
        this.handleError(error, 'An error occurred while loading the ZIP.')
        return
      }
      // Extract files
      try {
        // Experience details
        this.experience = JSON.parse(
          await zip.file('experience.json').async('string')
        )
        // Consent log
        this.consent = JSON.parse(
          await zip.file('consent.json').async('string')
        )
        // Included results
        const resultFiles = zip.file(/block[0-9]+.json/)
        const results = await Promise.all(
          resultFiles.map(r => r.async('string'))
        )
        this.results = results.map(JSON.parse)
        // Included whole files
        const folderContent = zip.file(/files\/.*/)
        const blobs = await Promise.all(folderContent.map(r => r.async('blob')))
        const files = folderContent.map(
          (r, i) => new File([blobs[i]], r.name.substr(6))
        )
        this.fileManager = new FileManager(this.manifest.preprocessors)
        await this.fileManager.init(files, true)
      } catch (error) {
        this.handleError(
          error,
          'An error occurred while processing the files. Check that the content of the ZIP has not been modified.'
        )
        return
      }

      // Version compatibility
      this.versionCompatibilityHandler()

      this.handleEnd()
    },
    /* Transform the imported zip to make it compatible with the current version */
    versionCompatibilityHandler() {
      if (!('version' in this.experience)) {
        this.experience.version = 1
      }
      const version = this.experience.version
      if (version === 1) {
        // Convert the array of viz to a single viz
        // Note: this feature was only used for one tinder block
        for (const r of this.results) {
          if ('visualizations' in r) {
            r.visualization = r.visualizations[0]
          }
        }
      }
    }
  }
}
</script>
