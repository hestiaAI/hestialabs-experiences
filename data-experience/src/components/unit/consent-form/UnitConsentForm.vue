<template>
  <VContainer class="pt-8">
    <VForm v-if="fileManager !== null" @submit.prevent="sendForm">
      <UnitConsentFormSection
        v-for="(section, index) in consentForm"
        :key="`section-${index}`"
        :index="index"
      />
      <BasePasswordField
        v-if="bubbleConfig.bypassLogin"
        :value.sync="codeword"
        label="Codeword"
      />
      <BaseAlert v-if="missingRequiredFields">
        Some required fields are not filled in.
      </BaseAlert>
      <BaseAlert v-if="missingRequiredData.length > 0">
        Some data required for sending this form has not been processed or
        included:
        {{ missingRequiredData.join(', ') }}.
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
            type="submit"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VMenu bottom>
            <template #activator="{ attrs, on }">
              <VBtn
                v-bind="attrs"
                class="my-2"
                outlined
                :status="generateStatus"
                :error="generateError"
                :progress="generateProgress"
                :disabled="
                  missingRequiredFields || missingRequiredData.length > 0
                "
                v-on="on"
              >
                Download your data
              </VBtn>
            </template>
            <VList>
              <VListItem @click="downloadZIP(true)">
                Download encrypted Zip
              </VListItem>
              <VListItem
                ref="downloadButton"
                @click="downloadZIP(false)"
              >
                Download Zip
              </VListItem>
            </VList>
          </VMenu>
          <a
            v-show="false"
            ref="downloadLink"
            :href="href"
            :download="filename"
          />
        </VCol>
        <!--  TODO remove filedrop everywhere ?
        <VCol v-if="siteConfig.filedrop">
          <a :href="siteConfig.filedrop" target="_blank">
            <BaseButton text="Drop file here" />
          </a>
        </VCol>
          -->
      </VRow>
    </VForm>
  </VContainer>
</template>

<script>
import { mapState } from '@/utils/store-helper'
import JSZip from 'jszip'
import BubbleAPI from '@/utils/bubble-api'
import { padNumber } from '~/utils/utils'
import { encryptFile } from '~/utils/encryption'
import { createObjectURL, mimeTypes } from '@/utils/utils'
import UnitConsentFormSection from './UnitConsentFormSection.vue'
import BasePasswordField from '@/components/base/BasePasswordField.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'

export default {
  name: 'UnitConsentForm',
  components: { UnitConsentFormSection, BasePasswordField, BaseAlert, BaseButton },
  data() {
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
      encrypt: false,
      codeword: this.bubbleCodeword
    }
  },
  computed: {
    ...mapState(['results', 'fileManager', 'consentForm', 'selectedFiles', 'experienceConfig', 'bubbleConfig', 'bubbleCodeword']),
    bubbleAPI() {
      if (!this.bubbleConfig) {
        return undefined
      }
      return new BubbleAPI(this.bubbleConfig.apiUrl)
    },
    bubbleName() {
      return this.bubbleConfig.id
    },
    destinationBubbleName() {
      return this.bubbleConfig.consent?.destinationBubble
    },
    missingRequiredFields() {
      return !this.consentForm.every((section) => {
        if ('required' in section) {
          if (section.type === 'data' &&
                        section.value.length === 1 &&
                        section.value[0] === 'file-explorer') {
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
      return this.experienceConfig.viewBlocks
        .filter(({ key }) => typeof section.required === 'object' &&
                section.required.includes(key) &&
                (!Object.keys(this.results).includes(key) ||
                    !section.value.includes(key)))
        .map(({ title }) => title)
    }
  },
  methods: {
    async getPublicKey() {
      if (this.destinationBubbleName) {
        const { publicKey } = await this.bubbleAPI.getConfig(this.destinationBubbleName)
        return publicKey
      } else {
        return this.bubbleConfig.publicKey
      }
    },
    async downloadZIP(encrypt) {
      this.generateStatus = false
      this.generateProgress = true
      const content = await this.generateZIP(encrypt)
      this.generateStatus = true
      this.generateProgress = false
      this.href = createObjectURL(content, mimeTypes.zip)
      await this.$nextTick()
      this.$refs.downloadLink.click()
    },
    async makeFilename(timestamp) {
      const date = new Date(timestamp)
      const uniqueId = await this.fileManager.hashAllFiles()
      const yearMonthDay = `${date.getUTCFullYear()}-${padNumber(date.getUTCMonth() + 1, 2)}-${padNumber(date.getUTCDate(), 2)}`
      const filename = `${this.experienceConfig.slug}_${yearMonthDay}_${uniqueId}.zip`
      return filename
    },
    async generateZIP(encrypt) {
      const { viewBlocks, version, slug } = this.experienceConfig
      const zip = new JSZip()
      const revResponse = await window.fetch('/git-revision.txt')
      const revText = await revResponse.text()
      const gitRevision = revText.replace(/[\n\r]/g, '')
      const timestamp = Date.now()
      this.filename = await this.makeFilename(timestamp)
      const experienceData = {
        experience: slug,
        timestamp,
        version,
        gitRevision
      }
      zip.file('experience.json', JSON.stringify(experienceData, null, 2))
      // Add consent log
      zip.file('consent.json', JSON.stringify(this.consentForm, null, 2))
      // Add included data
      const dataSection = this.consentForm.find(section => section.type === 'data')
      const keys = viewBlocks.map(block => block.id)
      dataSection.value
        .map(key => [key, keys.indexOf(key)])
        .filter(([key, i]) => i !== -1)
        .forEach(([key, i]) => {
          const content = JSON.parse(JSON.stringify(viewBlocks[i]))
          content.result = this.results[key]
          content.index = i
          zip.file(`block${padNumber(i, 2)}.json`, JSON.stringify(content, null, 2))
        })
      // Add whole files
      if (dataSection.value.includes('file-explorer')) {
        const zipFilesFolder = zip.folder('files')
        for (const file of this.selectedFiles) {
          zipFilesFolder.file(file.filename, this.fileManager.fileDict[file.filename])
        }
      }
      const publicKey = await this.getPublicKey()
      const content = await zip.generateAsync({ type: 'uint8array' })
      if (encrypt) {
        return encryptFile(content, publicKey)
      }
      return content
    },
    async sendForm() {
      this.sentStatus = false
      this.sentErrorMessage = undefined
      this.sentProgress = true
      const destBubble = this.destinationBubbleName
      const content = await this.generateZIP(true)
      const zip = new File([content], this.filename, {
        type: 'application/zip'
      })
      const errorMessage = await this.bubbleAPI.uploadFile(
        zip,
        destBubble,
        this.bubbleName,
        this.codeword
      )

      this.sentStatus = !errorMessage
      this.sentErrorMessage = errorMessage
      this.sentProgress = false
    }
  }
}
</script>
