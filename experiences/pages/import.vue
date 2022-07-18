<template>
  <VContainer>
    <h2>Key Generation</h2>
    <p>
      This step only needs to be done once. Copy the public key in the config
      and store the secret key in a safe place.
    </p>
    <BaseButton text="Generate keys" @click="generateKeys" />

    <h2 class="mt-6">
      Import
    </h2>
    <p>
      Please provide a ZIP file containing exported results and the associated
      consent form.
    </p>
    <VFileInput v-model="inputZIP" label="Encrypted or plaintext ZIP file" />
    <VCheckbox v-model="decrypt" label="Decrypt" />
    <VFileInput v-model="secretKey" label="Secret Key" :disabled="!decrypt" />
    <BaseButton
      text="Import"
      v-bind="{ status, error, progress, disabled: !inputZIP }"
      @click="importZIP"
    />
    <BaseButtonDownloadData
      :data="outputZIP"
      extension="zip"
      text="Download plaintext"
      :disabled="!status || error"
    />
    <p v-if="error">
      {{ message }}
    </p>
    <template v-if="status && !error">
      <VCard class="pa-2 my-6">
        <!-- Experience details -->
        <VCardTitle class="justify-center">
          Experience Details
        </VCardTitle>
        <VListItem two-line>
          <VListItemContent>
            <VListItemTitle>Experience</VListItemTitle>
            <VListItemSubtitle>{{ experience.experience }}</VListItemSubtitle>
          </VListItemContent>
        </VListItem>
        <VListItem two-line>
          <VListItemContent>
            <VListItemTitle>Date</VListItemTitle>
            <VListItemSubtitle>
              {{ new Date(experience.timestamp) }}
            </VListItemSubtitle>
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
        <VCardTitle class="justify-center">
          Consent Log
        </VCardTitle>
        <VCardText>
          <UnitConsentFormSection
            v-for="(section, index) in consentForm"
            :key="`section-${index}`"
            :index="index"
            readonly
          />
        </VCardText>
      </VCard>

      <!-- Results -->
      <VCard
        v-for="(
          { title, visualization: viz, vizProps, result }, resultIndex
        ) in sortedResults"
        :key="resultIndex"
        class="pa-2 my-6"
      >
        <VCardTitle class="justify-center">
          {{ title }}
        </VCardTitle>
        <VRow>
          <VCol>
            <UnitVegaViz
              v-if="typeof viz === 'object'"
              :spec-file="viz"
              :data="result"
              class="text-center"
            />
            <ChartView
              v-else-if="viz.endsWith('.vue')"
              :graph-name="viz"
              :data="result"
              :viz-props="vizProps"
            />
            <UnitIframe
              v-else-if="viz.startsWith('/')"
              :src="viz"
              :data="result"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <UnitFilterableTable v-bind="{ ...result.result }" />
          </VCol>
        </VRow>
      </VCard>

      <!-- File explorer -->
      <VRow v-if="hasFileExplorer">
        <VCol>
          <UnitFileExplorer />
        </VCol>
      </VRow>
    </template>
  </VContainer>
</template>

<script>
import { mapState } from 'vuex'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import _sodium from 'libsodium-wrappers'
import FileManager from '~/utils/file-manager'
import fileManagerWorkers from '~/utils/file-manager-workers'

export default {
  data() {
    return {
      secretKey: null,
      inputZIP: null,
      decrypt: false,
      outputZIP: null,
      status: false,
      error: false,
      progress: false,
      message: '',
      experience: null,
      results: null
    }
  },
  computed: {
    ...mapState(['fileManager', 'consentForm']),
    experienceConfig() {
      return this.$store.getters.experience({
        params: { experience: this.experience.slug }
      })
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

      // Decrypt
      if (this.decrypt) {
        try {
          const sk = await this.secretKey.text()
          const pk = this.$store.getters.routeConfig(this.$route).publicKey
          this.outputZIP = await this.decryptZIP(sk, pk, this.inputZIP)
        } catch (error) {
          this.handleError(
            error,
            'An error occurred during decryption. Check that the secret key is correct.'
          )
          return
        }
      } else {
        this.outputZIP = this.inputZIP
      }

      // Load ZIP
      const zip = new JSZip()
      try {
        await zip.loadAsync(this.outputZIP)
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
        const consentForm = JSON.parse(
          await zip.file('consent.json').async('string')
        )
        this.$store.commit('setConsentForm', consentForm)
        // Included results
        const resultFiles = zip.file(/block[0-9]+.json/)
        const results = await Promise.all(
          resultFiles.map(r => r.async('string'))
        )
        this.results = results.map(JSON.parse)
        // Included whole files
        const folderContent = zip.file(/files\/.*/)
        const blobs = await Promise.all(folderContent.map(r => r.async('blob')))
        const fileObjects = folderContent.map(
          (r, i) => new File([blobs[i]], r.name.substring(6))
        )
        const { preprocessors, files } = this.experienceConfig
        const fileManager = new FileManager(
          preprocessors,
          fileManagerWorkers,
          files
        )
        await fileManager.init(fileObjects)
        this.$store.commit('setFileManager', fileManager)
      } catch (error) {
        this.handleError(
          error,
          'An error occurred while processing the files. Check that the content of the ZIP has not been modified.'
        )
        return
      }

      this.handleEnd()
    },
    async decryptZIP(secretKey, publicKey, inputZIP) {
      await _sodium.ready
      const sodium = _sodium
      const sk = sodium.from_hex(secretKey)
      const pk = sodium.from_hex(publicKey)
      const buf = await inputZIP.arrayBuffer()
      const ciphertext = new Uint8Array(buf)
      return new Blob([sodium.crypto_box_seal_open(ciphertext, pk, sk)])
    },
    async generateKeys() {
      await _sodium.ready
      const sodium = _sodium

      const key = sodium.crypto_box_keypair()
      const pk = sodium.to_hex(key.publicKey)
      const sk = sodium.to_hex(key.privateKey)
      const zip = new JSZip()
      zip.file('public-key.txt', pk)
      zip.file('secret-key.txt', sk)
      const content = await zip.generateAsync({ type: 'blob' })
      FileSaver.saveAs(content, 'keys.zip')
    }
  }
}
</script>
