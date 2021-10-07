<template>
  <v-container>
    <v-row>
      <v-col>
        <base-button text="consent form" @click="switchForm" />
      </v-col>
    </v-row>
    <v-form v-if="showForm">
      <v-row>
        <v-col> Scope of the report </v-col>
      </v-row>
      <v-radio-group v-model="scope">
        <v-radio :label="radio1" :value="radio1"></v-radio>
        <v-radio :label="radio2" :value="radio2"></v-radio>
      </v-radio-group>
      <v-row>
        <v-col> Results to include </v-col>
      </v-row>
      <v-checkbox
        v-for="(items, index) in allItems"
        :key="index"
        v-model="includedResults"
        :disabled="items.length === 0"
        :label="'Data block ' + index"
        :value="[index, JSON.stringify(items)]"
      ></v-checkbox>
      <base-button text="Generate encrypted ZIP" @click="generateZIP" />
      <base-data-download-button
        :data="zipFile"
        extension="zip"
        :disabled="!success"
      />
      <base-button text="Send" :disabled="!success" @click="sendForm" />
    </v-form>
  </v-container>
</template>

<script>
import JSZip from 'jszip'

export default {
  props: {
    allItems: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showForm: false,
      radio1: 'Share only with PO and Alex',
      radio2: 'Share publicly',
      scope: '',
      includedResults: [],
      zipFile: new Blob(),
      success: false
    }
  },
  methods: {
    switchForm() {
      this.showForm = !this.showForm
    },
    async generateZIP() {
      this.success = false

      const zip = new JSZip()

      zip.file('scope.txt', this.scope)

      this.includedResults.forEach(result =>
        zip.file(`block${result[0]}.json`, result[1])
      )

      const content = await zip.generateAsync({ type: 'blob' })
      this.zipFile = content

      this.success = true
    },
    sendForm() {
      throw new Error('not implemented')
    }
  }
}
</script>
