<template>
  <VForm>
    <VCard class="pa-2 my-6">
      <VCardText>
        <UnitConsentFormSection
          v-for="(section, index) in consent"
          :key="`section-${index}`"
          v-bind="{
            section,
            index,
            dataCheckboxDisabled,
            showDataExplorer,
            fileManager
          }"
          @change="updateConsent"
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
            <BaseButtonDownloadData
              v-show="false"
              ref="downloadBtn"
              :data="zipFile"
              :filename="filename"
              extension="zip"
              text="Download"
            />
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
      </VCardText>
    </VCard>
  </VForm>
</template>

<script>
import { mapState } from 'vuex'
import JSZip from 'jszip'
import FileManager from '~/utils/file-manager.js'
import { padNumber } from '~/utils/utils'

// In the case of changes that would break the import, this version number must be incremented
// and the function versionCompatibilityHandler of import.vue must be able to handle previous versions.
const VERSION = 2

export default {
  props: {
    consentForm: {
      type: Array,
      required: true
    },
    allResults: {
      type: Array,
      required: true
    },
    defaultView: {
      type: Array,
      required: true
    },
    fileManager: {
      type: FileManager,
      required: true
    },
    showDataExplorer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      consent: JSON.parse(JSON.stringify(this.consentForm)),
      includedResults: [],
      zipFile: [],
      generateStatus: false,
      generateError: false,
      generateProgress: false,
      timestamp: 0
    }
  },
  computed: {
    ...mapState(['config']),
    zipReady() {
      return this.generateStatus && !this.generateError
    },
    missingRequired() {
      // If one section with attribute required has not been filled
      return !this.consent.every(section => {
        if ('required' in section) {
          if (section.type === 'checkbox') {
            // At least one checkbox must be selected
            return section.selected.length > 0
          } else if (section.type === 'radio') {
            // A radio button must be selected
            return section.selected !== ''
          } else if (section.type === 'input' || section.type === 'multiline') {
            // Some text must be given
            return 'value' in section && section.value !== ''
          } else if (
            section.type === 'data' &&
            typeof section.required === 'boolean'
          ) {
            // Some data must be given
            if (
              section.includedResults.length === 1 &&
              section.includedResults[0] === 'file-explorer'
            ) {
              return this.$store.state.selectedFiles[this.key].length > 0
            }
            return section.includedResults.length > 0
          }
        }
        return true
      })
    },
    missingRequiredDataProcessing() {
      const section = this.consent.find(section => section.type === 'data')
      return this.defaultView
        .filter(
          (block, i) =>
            typeof section.required === 'object' &&
            section.required.includes(block.key) &&
            typeof this.allResults[i] === 'undefined'
        )
        .map(block => block.title)
    },
    missingRequiredData() {
      const section = this.consent.find(section => section.type === 'data')
      return this.defaultView
        .filter(
          block =>
            typeof section.required === 'object' &&
            section.required.includes(block.key) &&
            !section.includedResults.includes(block.key)
        )
        .map(block => block.title)
    },
    dataCheckboxDisabled() {
      return this.allResults.map(r => typeof r === 'undefined')
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
    },
    tooBig() {
      const limit = this.config.formSizeLimitMegaBytes
      if (!limit) {
        return false
      }
      const megabyte = 1048576
      return this.encryptedZipFile.length > limit * megabyte
    }
  },
  watch: {
    includedResults: {
      deep: true,
      handler() {
        this.resetStatus()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // Add titles and keys to the data section
      const section = this.consent.find(section => section.type === 'data')
      section.titles = this.defaultView.map(e => e.title)
      section.keys = this.defaultView.map(e => e.key)
      // Copy included results preset
      section.includedResults = section.includedResults ?? []
      this.includedResults = section.includedResults ?? []
    },
    async generateZIP() {
      this.resetStatus()
      this.generateProgress = true

      const zip = new JSZip()

      // Add info about the experience
      const manifest = this.$store.getters.manifest(this.$route)
      this.timestamp = Date.now()
      const experience = {
        key: manifest.key,
        timestamp: this.timestamp,
        version: VERSION
      }
      zip.file('experience.json', JSON.stringify(experience))

      // Add consent log
      zip.file('consent.json', JSON.stringify(this.consent))

      // Add included data
      const keys = this.defaultView.map(block => block.key)
      this.includedResults
        .map(key => keys.indexOf(key))
        .filter(i => i !== -1)
        .forEach(i => {
          const content = JSON.parse(JSON.stringify(this.defaultView[i]))
          content.result = JSON.parse(this.allResults[i])
          content.index = i
          zip.file(`block${padNumber(i, 2)}.json`, JSON.stringify(content))
        })

      // Add whole files
      if (this.includedResults.includes('file-explorer')) {
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

      await this.$nextTick()

      this.$refs.downloadBtn.$el.click()
    },
    updateConsent({ index, selected, value, includedResults }) {
      const section = this.consent[index]
      if (section.type === 'checkbox' || section.type === 'radio') {
        section.selected = selected
      } else if (section.type === 'input' || section.type === 'multiline') {
        section.value = value
      } else if (section.type === 'data') {
        section.includedResults = includedResults
        this.includedResults = includedResults
      }
      // For reactivity
      this.$set(this.consent, index, section)

      this.resetStatus()
    },
    resetStatus() {
      this.generateStatus = false
      this.generateError = false
      this.sentStatus = false
      this.sentError = false
    }
  }
}
</script>
