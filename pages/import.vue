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
      accept="application/zip"
      label="Encrypted or plaintext ZIP file"
    ></v-file-input>
    <v-checkbox v-model="decrypt" label="Decrypt"></v-checkbox>
    <v-file-input
      v-model="secretKey"
      label="Secret Key"
      :disabled="!decrypt"
    ></v-file-input>
    <base-button text="Import" :disabled="!inputZIP" @click="importZIP" />
    <base-data-download-button
      :data="outputZIP"
      extension="zip"
      text="Download plaintext"
      :disabled="!success || (decrypt && !secretKey)"
    />
    <template v-if="success">
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
            v-for="(section, name, index) in consent"
            :key="`section-${index}`"
            v-bind="{ section, name, index, readonly: true }"
          />
        </v-card-text>
      </v-card>

      <!-- Results -->
      <v-card v-for="(result, i) in results" :key="i" class="pa-2 my-6">
        <v-card-title class="justify-center">{{ result.title }}</v-card-title>
        <v-row>
          <v-col
            v-for="(specFile, j) in allVegaFiles[i]"
            :key="j"
            style="text-align: center"
          >
            <unit-vega-viz
              :spec-file="specFile"
              :values="allProcessedItems[i][j]"
              :div-id="`viz-${result.query}-${specFile.name}`"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <unit-query-results
              v-bind="{
                headers: result.headers.map(h => ({ text: h, value: h })),
                items: result.items
              }"
            />
          </v-col>
        </v-row>
      </v-card>
    </template>
  </div>
</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'

import csvProcessors from '@/manifests/csv-processors'

const _sodium = require('libsodium-wrappers')

export default {
  data() {
    return {
      secretKey: null,
      inputZIP: null,
      decrypt: false,
      outputZIP: null,
      success: false,
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
    example() {
      return this.manifest.examples.find(ex => ex.name === 'main')
    },
    visualizations() {
      return this.manifest.visualizations.main
    },
    allVegaFiles() {
      return this.results.map(r =>
        this.example.vega.filter(s => r.visualizations.includes(s.name))
      )
    },
    allProcessedItems() {
      // For each block
      return this.results.map((r, i) =>
        // For each viz
        this.allVegaFiles[i].map(spec => {
          // Find the viz definition for this query
          const def = this.visualizations.find(
            v => r.query === v.query && spec.name === v.vega
          )
          // If it has a preprocessor defined, run it
          if (def.preprocessor) {
            return csvProcessors[def.preprocessor](r.headers, r.items)[1]
          }
          return r.items
        })
      )
    }
  },
  methods: {
    async importZIP() {
      this.success = false
      if (!this.inputZIP) {
        return
      }

      await _sodium.ready
      const sodium = _sodium

      // Decrypt
      if (this.decrypt) {
        const secretKey = await this.secretKey.text()
        const sk = sodium.from_hex(secretKey)
        const pk = sodium.from_hex(this.$store.state.config.publicKey)
        const buf = await this.inputZIP.arrayBuffer()
        const ciphertext = new Uint8Array(buf)
        this.outputZIP = new Blob([
          sodium.crypto_box_seal_open(ciphertext, pk, sk)
        ])
      } else {
        this.outputZIP = this.inputZIP
      }

      // Extract files
      const zip = new JSZip()
      try {
        await zip.loadAsync(this.outputZIP)
      } catch {
        console.error('Error when loading zip file')
        return
      }
      this.experience = JSON.parse(
        await zip.file('experience.json').async('string')
      )
      this.consent = JSON.parse(await zip.file('consent.json').async('string'))
      const files = zip.file(/block[0-9]+.json/)
      const res = await Promise.all(files.map(r => r.async('string')))
      this.results = res.map(JSON.parse)

      this.success = true
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
