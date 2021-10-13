<template>
  <div>
    <v-file-input
      v-model="inputZIP"
      accept="application/zip"
      label="Encrypted or plaintext ZIP file"
    ></v-file-input>
    <v-checkbox v-model="decrypt" label="Decrypt"></v-checkbox>
    <v-text-field
      v-model="secretKey"
      label="Secret Key"
      :disabled="!decrypt"
    ></v-text-field>
    <base-button text="Import" @click="importZIP" />
    <base-data-download-button
      :data="outputZIP"
      extension="zip"
      text="Download plaintext"
      :disabled="!success"
    />
    <template v-if="success">
      <v-card class="pa-2 my-6">
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

      <v-card class="pa-2 my-6">
        <v-card-title class="justify-center">{{ result.title }}</v-card-title>
        <v-row>
          <v-col
            v-for="(specFile, index) in vegaFiles"
            :key="index"
            style="text-align: center"
          >
            <unit-vega-viz
              :spec-file="specFile"
              :values="processedItems[index]"
              :div-id="`viz-${result.query}-${specFile.name}`"
            />
          </v-col>
        </v-row>
      </v-card>
    </template>
  </div>
</template>

<script>
import JSZip from 'jszip'

import csvProcessors from '@/manifests/csv-processors'

const _sodium = require('libsodium-wrappers')

export default {
  data() {
    return {
      secretKey: '',
      inputZIP: new Blob(),
      decrypt: false,
      outputZIP: [],
      success: false,
      experience: null,
      result: null
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
    vegaFiles() {
      return this.example.vega.filter(s =>
        this.result.visualizations.includes(s.name)
      )
    },
    processedItems() {
      // For each viz
      return this.vegaFiles.map(spec => {
        // Find the viz definition for this query
        const def = this.visualizations.find(
          v => this.result.query === v.query && spec.name === v.vega
        )
        // If it has a preprocessor defined, run it
        if (def.preprocessor) {
          return csvProcessors[def.preprocessor](
            this.result.headers,
            this.result.items
          )[1]
        }
        return this.result.items
      })
    }
  },
  methods: {
    async importZIP() {
      this.success = false
      await _sodium.ready
      const sodium = _sodium

      // Decrypt
      if (this.decrypt) {
        const sk = sodium.from_hex(this.secretKey)
        const pk = sodium.from_hex(this.$store.state.config.publicKey)
        const buf = await this.inputZIP.arrayBuffer()
        const ciphertext = new Uint8Array(buf)
        this.outputZIP = sodium.crypto_box_seal_open(ciphertext, pk, sk)
      } else {
        this.outputZIP = this.inputZIP
      }

      // Extract files
      const zip = new JSZip()
      await zip.loadAsync(this.outputZIP)
      this.experience = JSON.parse(
        await zip.file('experience.json').async('string')
      )
      this.result = JSON.parse(await zip.file('block1.json').async('string'))

      this.success = true
    }
  }
}
</script>
