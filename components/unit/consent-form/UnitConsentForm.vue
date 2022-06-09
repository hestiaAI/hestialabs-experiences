<template>
  <VContainer>
    <VForm v-if="fileManager !== null">
      <UnitConsentFormSection
        v-for="(section, index) in consentForm"
        :key="`section-${index}`"
        :index="index"
      />
      <BaseAlert v-if="missingRequiredFields">
        Some required fields are not filled in.
      </BaseAlert>
      <BaseAlert v-if="missingRequiredData.length > 0">
        Some data required for sending this form has not been processed or
        included:
        {{ missingRequiredData.join(', ') }}.
      </BaseAlert>
      <BaseAlert v-if="!config.publicKey" type="info">
        The results will not be encrypted because this instance has been
        configured without public key.
      </BaseAlert>
      <BaseAlert v-if="sentErrorMessage" type="error">
        <p>Failed to upload results:</p>
        <p>{{ sentErrorMessage }}</p>
        <p>
          Consider downloading the encrypted results and sending them by other
          means.
        </p>
      </BaseAlert>
      <VRow v-if="bubbleName">
        <VCol>
          <BaseButton
            text="Share results with your group"
            :status="sentStatus"
            :error="!!sentErrorMessage"
            :progress="sentProgress"
            :disabled="missingRequiredFields || missingRequiredData.length > 0"
            @click="sendForm"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <BaseButton
            ref="downloadButton"
            text="Download results"
            :status="generateStatus"
            :error="generateError"
            :progress="generateProgress"
            :disabled="missingRequiredFields || missingRequiredData.length > 0"
            @click="downloadZIP"
          />
          <a
            v-show="false"
            ref="downloadLink"
            :href="href"
            :download="filename"
          ></a>
        </VCol>
        <VCol v-if="config.filedrop">
          <a :href="config.filedrop" target="_blank">
            <BaseButton text="Drop file here" />
          </a>
        </VCol>
      </VRow>
    </VForm>
  </VContainer>
</template>

<script>
import { mapState } from 'vuex'
import JSZip from 'jszip'
import { padNumber } from '~/utils/utils'
import { encryptFile } from '~/utils/encryption'
import { createObjectURL, mimeTypes } from '@/utils/utils'

// In the case of changes that would break the import, this version number must be incremented
// and the function versionCompatibilityHandler of import.vue must be able to handle previous versions.
const VERSION = 3

export default {
  data() {
    const { viewBlocks } = this.$store.getters.experience(this.$route)
    return {
      zipFile: undefined,
      generateStatus: false,
      generateError: false,
      generateProgress: false,
      sentStatus: false,
      sentErrorMessage: undefined,
      sentProgress: false,
      filename: '',
      href: null,
      viewBlocks
    }
  },
  computed: {
    ...mapState(['results', 'fileManager', 'consentForm', 'selectedFiles']),
    config() {
      return this.$store.getters.config(this.$route)
    },
    bubbleName() {
      return this.$route.params.bubble
    },
    missingRequiredFields() {
      return !this.consentForm.every(section => {
        if ('required' in section) {
          if (
            section.type === 'data' &&
            section.value.length === 1 &&
            section.value[0] === 'file-explorer'
          ) {
            return this.selectedFiles.length > 0
          } else {
            return section.value && section.value.length
          }
        }
        return true
      })
    },
    missingRequiredData() {
      const section = this.consentForm.find(section => section.type === 'data')
      return this.viewBlocks
        .filter(
          ({ key }) =>
            typeof section.required === 'object' &&
            section.required.includes(key) &&
            (!Object.keys(this.results).includes(key) ||
              !section.value.includes(key))
        )
        .map(({ title }) => title)
    }
  },
  methods: {
    async downloadZIP() {
      this.generateStatus = false
      this.generateProgress = true

      const content = await this.generateZIP()
      this.generateStatus = true
      this.generateProgress = false
      this.href = createObjectURL(content, mimeTypes.zip)
      await this.$nextTick()
      this.$refs.downloadLink.click()
    },
    async makeFilename(timestamp) {
      const date = new Date(timestamp)
      const uniqueId = await this.fileManager.hashAllFiles()
      const yearMonthDay = `${date.getUTCFullYear()}-${padNumber(
        date.getUTCMonth() + 1,
        2
      )}-${padNumber(date.getUTCDate(), 2)}`
      const filename = `${this.$route.params.experience}_${yearMonthDay}_${uniqueId}.zip`
      return filename
    },
    async generateZIP(publicKey) {
      const zip = new JSZip()

      const revResponse = await window.fetch('/git-revision.txt')
      const revText = await revResponse.text()
      const gitRevision = revText.replace(/[\n\r]/g, '')
      const timestamp = Date.now()
      this.filename = await this.makeFilename(timestamp)
      const experience = {
        experience: this.$route.params.experience,
        timestamp,
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
      const keys = this.viewBlocks.map(block => block.id)
      dataSection.value
        .map(key => [key, keys.indexOf(key)])
        .filter(([key, i]) => i !== -1)
        .forEach(([key, i]) => {
          const content = JSON.parse(JSON.stringify(this.viewBlocks[i]))
          content.result = this.results[key]
          content.index = i
          zip.file(
            `block${padNumber(i, 2)}.json`,
            JSON.stringify(content, null, 2)
          )
        })

      // Add whole files
      if (dataSection.value.includes('file-explorer')) {
        const zipFilesFolder = zip.folder('files')
        for (const file of this.selectedFiles) {
          zipFilesFolder.file(
            file.filename,
            this.fileManager.fileDict[file.filename]
          )
        }
      }

      const content = await zip.generateAsync({ type: 'uint8array' })
      if (publicKey) {
        return encryptFile(content, publicKey)
      }
      return content
    },
    getCookie(name) {
      if (!document.cookie) {
        return null
      }
      const cookie = document.cookie
        .split(';')
        .map(c => c.trim())
        .filter(c => c.startsWith(name + '='))

      if (cookie.length === 0) {
        return null
      }
      return decodeURIComponent(cookie[0].split('=')[1])
    },
    async sendForm() {
      this.sentStatus = false
      this.sentErrorMessage = undefined
      this.sentProgress = true

      const { publicKey } = this.config
      const content = await this.generateZIP(publicKey)
      // Programmatically create the form data
      // Names must correspond to the dummy form defined in /static/export-data-form-dummy.html
      const formData = new FormData()
      const zip = new File([content], this.filename, {
        type: 'application/zip'
      })
      formData.append('password', '0123')
      formData.append('file', zip, this.filename)
      let success = false
      let errorMessage
      try {
        const authCookie = this.getCookie('csrftoken')
        const resp = await fetch(
          `${process.env.apiUrl}/bubbles/${this.$route.params.bubble}/files`,
          {
            method: 'POST',
            headers: {
              'X-CSRFToken': authCookie
            },
            body: formData
          }
        )
        if (resp.ok) {
          success = true
        } else {
          console.error(resp)
          // use http status text in cas json() fails
          errorMessage = resp.statusText
          errorMessage = await resp.json()
        }
      } catch (error) {
        errorMessage = errorMessage || 'Error'
        console.error(error)
      }
      this.sentStatus = success
      this.sentErrorMessage = errorMessage
      this.sentProgress = false
    }
  }
}
</script>
