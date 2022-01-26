<template>
  <VForm v-if="fileManager !== null">
    <UnitConsentFormSection
      v-for="(section, index) in consentForm"
      :key="`section-${index}`"
      v-bind="{
        index,
        dataCheckboxDisabled
      }"
    />
    <BaseAlert v-if="missingRequired">
      Some required fields are not filled in.
    </BaseAlert>
    <BaseAlert v-if="missingRequiredDataProcessing.length > 0">
      Some experience required for sending this form has not been ran:
      {{ missingRequiredDataProcessing.join(', ') }}.
    </BaseAlert>
    <BaseAlert v-if="missingRequiredData.length > 0">
      Some data required for sending this form has not been included:
      {{ missingRequiredData.join(', ') }}.
    </BaseAlert>
    <VRow>
      <VCol>
        <VIcon v-if="config.filedrop" class="mr-2" color="#424242"
          >$vuetify.icons.mdiNumeric1CircleOutline</VIcon
        >
        <BaseButton
          text="Download results"
          :status="generateStatus"
          :error="generateError"
          :progress="generateProgress"
          :disabled="
            missingRequired ||
            missingRequiredDataProcessing.length > 0 ||
            missingRequiredData.length > 0
          "
          @click="generateZIP"
        />
        <a
          v-show="false"
          ref="downloadLink"
          :href="href"
          :download="filename"
        ></a>
      </VCol>
      <VCol v-if="config.filedrop">
        <VIcon class="mr-2" color="#424242"
          >$vuetify.icons.mdiNumeric2CircleOutline</VIcon
        >
        <a :href="config.filedrop" target="_blank">
          <BaseButton text="Drop file here" />
        </a>
      </VCol>
    </VRow>
  </VForm>
</template>

<script>
import { mapState } from 'vuex'
import JSZip from 'jszip'
import { padNumber } from '~/utils/utils'
import { createObjectURL, mimeTypes } from '@/utils/utils'

// In the case of changes that would break the import, this version number must be incremented
// and the function versionCompatibilityHandler of import.vue must be able to handle previous versions.
const VERSION = 3

export default {
  props: {
    defaultView: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      zipFile: [],
      generateStatus: false,
      generateError: false,
      generateProgress: false,
      timestamp: 0,
      href: null
    }
  },
  computed: {
    ...mapState(['config', 'results', 'fileManager', 'consentForm']),
    resultMap() {
      return this.results[this.key]
    },
    missingRequired() {
      // FIXME
      return false
      // // If one section with attribute required has not been filled
      // return !this.consentForm.every(section => {
      //   if ('required' in section) {
      //     if (section.type === 'checkbox') {
      //       // At least one checkbox must be selected
      //       return section.selected.length > 0
      //     } else if (section.type === 'radio') {
      //       // A radio button must be selected
      //       return section.selected !== ''
      //     } else if (section.type === 'input' || section.type === 'multiline') {
      //       // Some text must be given
      //       return 'value' in section && section.value !== ''
      //     } else if (
      //       section.type === 'data' &&
      //       typeof section.required === 'boolean'
      //     ) {
      //       // Some data must be given
      //       if (
      //         section.includedResults.length === 1 &&
      //         section.includedResults[0] === 'file-explorer'
      //       ) {
      //         return this.$store.state.selectedFiles[this.key].length > 0
      //       }
      //       return section.includedResults.length > 0
      //     }
      //   }
      //   return true
      // })
    },
    missingRequiredDataProcessing() {
      // FIXME
      return false
      // const section = this.consentForm.find(section => section.type === 'data')
      // return this.defaultView
      //   .filter(
      //     block =>
      //       typeof section.required === 'object' &&
      //       section.required.includes(block.key) &&
      //       !this.resultMap[block.key]
      //   )
      //   .map(block => block.title)
    },
    missingRequiredData() {
      // FIXME
      return false
      // const section = this.consentForm.find(section => section.type === 'data')
      // return this.defaultView
      //   .filter(
      //     block =>
      //       typeof section.required === 'object' &&
      //       section.required.includes(block.key) &&
      //       !section.includedResults.includes(block.key)
      //   )
      //   .map(block => block.title)
    },
    dataCheckboxDisabled() {
      return Object.fromEntries(
        Object.entries(this.resultMap).map(([k, r]) => [k, !r])
      )
    },
    key() {
      return this.$route.params.key
    },
    filename() {
      const date = new Date(this.timestamp)
      const yearMonthDay = `${date.getUTCFullYear()}-${padNumber(
        date.getUTCMonth() + 1,
        2
      )}-${padNumber(date.getUTCDate(), 2)}`
      const filename = `${this.key}_${yearMonthDay}_${padNumber(
        date.getUTCHours(),
        2
      )}${padNumber(date.getUTCMinutes(), 2)}_UTC.zip`
      return filename
    }
  },
  methods: {
    async generateZIP() {
      this.generateStatus = false
      this.generateProgress = true

      const zip = new JSZip()

      const revResponse = await window.fetch('/git-revision.txt')
      const revText = await revResponse.text()
      const gitRevision = revText.replace(/[\n\r]/g, '')
      // Add info about the experience
      const manifest = this.$store.getters.manifest(this.$route)
      this.timestamp = Date.now()
      const experience = {
        key: manifest.key,
        timestamp: this.timestamp,
        version: VERSION,
        gitRevision
      }
      zip.file('experience.json', JSON.stringify(experience, null, 2))

      // Add consent log
      zip.file('consent.json', JSON.stringify(this.consentForm, null, 2))

      // Add included data
      const dataSection = this.consentForm.find(
        section => section.type === 'data'
      )
      const keys = this.defaultView.map(block => block.key)
      dataSection.value
        .map(key => [key, keys.indexOf(key)])
        .filter(([key, i]) => i !== -1)
        .forEach(([key, i]) => {
          const content = JSON.parse(JSON.stringify(this.defaultView[i]))
          content.result = this.resultMap[key]
          content.index = i
          zip.file(
            `block${padNumber(i, 2)}.json`,
            JSON.stringify(content, null, 2)
          )
        })

      // Add whole files
      if (dataSection.value.includes('file-explorer')) {
        const zipFilesFolder = zip.folder('files')
        const files = this.$store.state.selectedFiles[this.key]
        for (const file of files) {
          zipFilesFolder.file(
            file.filename,
            this.fileManager.fileDict[file.filename]
          )
        }
      }

      const content = await zip.generateAsync({ type: 'uint8array' })
      this.zipFile = content

      this.generateStatus = true
      this.generateProgress = false

      this.href = createObjectURL(this.zipFile, mimeTypes.zip)
      await this.$nextTick()
      this.$refs.downloadLink.click()
    }
  }
}
</script>
