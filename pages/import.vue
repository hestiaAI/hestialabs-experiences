<template>
  <div>
    <h2>Key Generation</h2>
    <p>
      This step only needs to be done once. Copy the public key in the config
      and store the secret key in a safe place.
    </p>
    <base-button text="Generate keys" @click="generateKeys" />

    <h2 class="mt-6">Import</h2>
    <p>
      Either provide a plaintext ZIP, or an encrypted ZIP along with the
      corresponding secret key.
    </p>
    <v-file-input
      v-model="inputZIP"
      label="Encrypted or plaintext ZIP file"
    ></v-file-input>
    <v-checkbox v-model="decrypt" label="Decrypt"></v-checkbox>
    <v-file-input
      v-model="secretKey"
      label="Secret Key"
      :disabled="!decrypt"
    ></v-file-input>
    <base-button
      text="Import"
      v-bind="{ status, error, progress, disabled: !inputZIP }"
      @click="importZIP"
    />
    <base-data-download-button
      :data="outputZIP"
      extension="zip"
      text="Download plaintext"
      :disabled="!status || error"
    />
    <p v-if="error">{{ message }}</p>
    <template v-if="status && !error">
      <v-card class="pa-2 my-6">
        <!-- Experience details -->
        <v-card-title class="justify-center">Experience Details</v-card-title>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Experience</v-list-item-title>
            <v-list-item-subtitle>{{ experience.key }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Date</v-list-item-title>
            <v-list-item-subtitle>{{
              new Date(experience.timestamp)
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>

      <!-- Consent log -->
      <v-card class="pa-2 my-6">
        <v-card-title class="justify-center">Consent Log</v-card-title>
        <v-card-text>
          <unit-consent-form-section
            v-for="(section, index) in consent"
            :key="`section-${index}`"
            v-bind="{ section, index, readonly: true }"
          />
        </v-card-text>
      </v-card>

      <!-- Results -->
      <v-card
        v-for="(result, resultIndex) in results"
        :key="resultIndex"
        class="pa-2 my-6"
      >
        <v-card-title class="justify-center">{{ result.title }}</v-card-title>
        <v-row>
          <v-col
            v-for="(specFile, vegaIndex) in allVegaFiles[resultIndex]"
            :key="vegaIndex"
            style="text-align: center"
          >
            <unit-vega-viz
              :spec-file="specFile"
              :data="result.result"
              :div-id="`viz-${resultIndex}-${vegaIndex}`"
            />
          </v-col>
        </v-row>
        <v-row
          v-for="(graphName, vizVueIndex) in allVueGraphNames[resultIndex]"
          :key="`viz-${resultIndex}-${vizVueIndex}`"
        >
          <v-col>
            <vue-graph-by-name :graph-name="graphName" :data="result.result" />
          </v-col>
        </v-row>
        <v-row
          v-for="(src, vizUrlIndex) in allVizUrls[resultIndex]"
          :key="'viz-url-' + vizUrlIndex"
        >
          <v-col>
            <unit-iframe :src="src" :data="result.result" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <unit-filterable-table :data="result.result" />
          </v-col>
        </v-row>
      </v-card>
    </template>
  </div>
</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'

import UnitFilterableTable from '~/components/UnitFilterableTable'

const _sodium = require('libsodium-wrappers')

export default {
  components: { UnitFilterableTable },
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
    visualizations() {
      return this.manifest.visualizations
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
