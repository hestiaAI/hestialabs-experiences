<template>
  <div>
    <h2>Key Generation</h2>
    <p>
      This step only needs to be done once. Copy the public key in the config
      and store the secret key in a safe place.
    </p>
    <BaseButton text="Generate keys" @click="generateKeys" />

    <h2 class="mt-6">Import</h2>
    <p>
      Either provide a plaintext ZIP, or an encrypted ZIP along with the
      corresponding secret key.
    </p>
    <VFileInput
      v-model="inputZIP"
      label="Encrypted or plaintext ZIP file"
    ></VFileInput>
    <VCheckbox v-model="decrypt" label="Decrypt"></VCheckbox>
    <VFileInput
      v-model="secretKey"
      label="Secret Key"
      :disabled="!decrypt"
    ></VFileInput>
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
      </VCard>

      <!-- Consent log -->
      <VCard class="pa-2 my-6">
        <VCardTitle class="justify-center">Consent Log</VCardTitle>
        <VCardText>
          <UnitConsentFormSection
            v-for="(section, index) in consent"
            :key="`section-${index}`"
            v-bind="{ section, index, readonly: true }"
          />
        </VCardText>
      </VCard>

      <!-- Results -->
      <VCard
        v-for="(result, resultIndex) in results"
        :key="resultIndex"
        class="pa-2 my-6"
      >
        <VCardTitle class="justify-center">{{ result.title }}</VCardTitle>
        <VRow>
          <VCol
            v-for="(specFile, vegaIndex) in allVegaFiles[resultIndex]"
            :key="vegaIndex"
            class="text-center"
          >
            <UnitVegaViz
              :spec-file="specFile"
              :data="result.result"
              :div-id="`viz-${resultIndex}-${vegaIndex}`"
            />
          </VCol>
        </VRow>
        <VRow
          v-for="(graphName, vizVueIndex) in allVueGraphNames[resultIndex]"
          :key="`viz-${resultIndex}-${vizVueIndex}`"
        >
          <VCol>
            <ChartView :graph-name="graphName" :data="result.result" />
          </VCol>
        </VRow>
        <VRow
          v-for="(src, vizUrlIndex) in allVizUrls[resultIndex]"
          :key="'viz-url-' + vizUrlIndex"
        >
          <VCol>
            <UnitIframe :src="src" :data="result.result" />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <UnitFilterableTable :data="result.result" />
          </VCol>
        </VRow>
      </VCard>
    </template>
  </div>
</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'

const _sodium = require('libsodium-wrappers')

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
      results: null,
      consent: null
    }
  },
  computed: {
    manifest() {
      return this.$store.getters.manifest({
        params: { key: this.experience.key }
      })
    },
    allVegaFiles() {
      return this.results.map(
        r =>
          r.visualizations?.map(n => this.manifest.vega[n]).filter(n => n) ?? []
      )
    },
    allVizUrls() {
      return this.results.map(r =>
        r.visualizations?.filter(n => n.startsWith('/'))
      )
    },
    allVueGraphNames() {
      return this.results.map(r =>
        r.visualizations?.filter(n => n.endsWith('.vue'))
      )
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
        const message = 'No ZIP provided'
        this.handleError(new Error(message))
        return
      }

      await _sodium.ready
      const sodium = _sodium

      // Decrypt
      if (this.decrypt) {
        try {
          const secretKey = await this.secretKey.text()
          const sk = sodium.from_hex(secretKey)
          const pk = sodium.from_hex(this.$store.state.config.publicKey)
          const buf = await this.inputZIP.arrayBuffer()
          const ciphertext = new Uint8Array(buf)
          this.outputZIP = new Blob([
            sodium.crypto_box_seal_open(ciphertext, pk, sk)
          ])
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
        if (this.decrypt) {
          this.handleError(error, 'An error occurred while loading the ZIP.')
        } else {
          this.handleError(
            error,
            'An error occurred while loading the ZIP. If it is encrypted, please provide the secret key.'
          )
        }
        return
      }
      // Extract files
      try {
        this.experience = JSON.parse(
          await zip.file('experience.json').async('string')
        )
        this.consent = JSON.parse(
          await zip.file('consent.json').async('string')
        )
        const files = zip.file(/block[0-9]+.json/)
        const res = await Promise.all(files.map(r => r.async('string')))
        this.results = res.map(JSON.parse)
      } catch (error) {
        this.handleError(
          error,
          'An error occurred while processing the files. Check that the content of the ZIP has not been modified.'
        )
        return
      }

      this.handleEnd()
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
